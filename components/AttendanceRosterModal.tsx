
import React, { useState, useEffect, useMemo } from 'react';
import { JamEvent, Member, Instrument } from '../types';

interface AttendanceRosterModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: JamEvent;
  members: Member[];
  onUpdateAttendance: (eventId: number, presentMemberIds: string[]) => void;
}

const SearchIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8"></circle>
        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
    </svg>
);

const AttendanceRosterModal: React.FC<AttendanceRosterModalProps> = ({ isOpen, onClose, event, members, onUpdateAttendance }) => {
    const [presentMemberIds, setPresentMemberIds] = useState<Set<string>>(new Set());
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        if (event) {
            setPresentMemberIds(new Set(event.checkedInMembers));
        }
    }, [event]);

    const handleTogglePresent = (memberId: string) => {
        setPresentMemberIds(prev => {
            const newSet = new Set(prev);
            if (newSet.has(memberId)) {
                newSet.delete(memberId);
            } else {
                newSet.add(memberId);
            }
            return newSet;
        });
    };
    
    const filteredMembers = useMemo(() => members.filter(member => 
        member.fullName.toLowerCase().includes(searchQuery.toLowerCase())
    ), [members, searchQuery]);

    const handleMarkAll = (present: boolean) => {
        if (present) {
            setPresentMemberIds(new Set(members.map(m => m.id)));
        } else {
            setPresentMemberIds(new Set());
        }
    }

    const handleSave = () => {
        onUpdateAttendance(event.id, Array.from(presentMemberIds));
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in" onClick={onClose}>
            <div className="bg-brand-dark border border-brand-brown rounded-2xl shadow-2xl w-full max-w-md p-6 sm:p-8 flex flex-col" style={{ height: '90vh', maxHeight: '700px' }} onClick={e => e.stopPropagation()}>
                <div className="flex-shrink-0">
                    <h2 className="text-2xl font-serif font-bold text-white mb-1">Attendance</h2>
                    <p className="text-brand-gold text-lg font-semibold mb-4">{event.title}</p>
                    
                    {/* Search and Bulk Actions */}
                     <div className="relative mb-2">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                            <SearchIcon className="w-5 h-5 text-brand-cream/60" />
                        </span>
                        <input
                            type="text"
                            placeholder="Search members..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-brand-dark/70 border border-brand-brown rounded-md py-2 pl-10 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-brand-gold focus:border-brand-gold"
                        />
                    </div>
                    <div className="flex justify-between items-center mb-4 text-sm">
                         <p className="text-brand-cream/80">{presentMemberIds.size} / {members.length} Present</p>
                        <div className="flex gap-2">
                            <button onClick={() => handleMarkAll(true)} className="text-brand-gold hover:underline">Mark All Present</button>
                            <button onClick={() => handleMarkAll(false)} className="text-brand-cream/70 hover:underline">Mark All Absent</button>
                        </div>
                    </div>
                </div>

                {/* Member List */}
                <div className="flex-grow overflow-y-auto pr-2 -mr-2">
                    <ul className="space-y-2">
                        {filteredMembers.map(member => {
                            const isPresent = presentMemberIds.has(member.id);
                            return (
                                <li key={member.id} className="flex items-center justify-between bg-brand-dark/70 p-2 rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <img src={member.photo} alt={member.fullName} className="w-8 h-8 rounded-full object-cover"/>
                                        <span className="font-medium text-brand-cream">{member.fullName}</span>
                                    </div>
                                    <button
                                        onClick={() => handleTogglePresent(member.id)}
                                        className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-brand-dark focus:ring-brand-gold ${isPresent ? 'bg-brand-gold' : 'bg-brand-brown'}`}
                                    >
                                        <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform duration-300 ${isPresent ? 'translate-x-6' : 'translate-x-1'}`} />
                                    </button>
                                </li>
                            )
                        })}
                    </ul>
                </div>

                {/* Footer Actions */}
                <div className="flex-shrink-0 pt-4 mt-2 border-t border-brand-brown/50">
                    <div className="flex justify-end gap-4">
                        <button onClick={onClose} className="bg-brand-brown/70 text-brand-cream font-bold py-2 px-6 rounded-lg hover:bg-brand-brown transition-colors duration-300">
                            Cancel
                        </button>
                        <button onClick={handleSave} className="bg-brand-gold text-brand-dark font-bold py-2 px-6 rounded-lg hover:bg-yellow-400 transition-colors duration-300">
                            Save
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AttendanceRosterModal;
