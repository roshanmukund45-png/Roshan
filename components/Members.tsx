
import React, { useState } from 'react';
import { Member, Instrument } from '../types';
import { instrumentIcons } from './InstrumentIcons';
import MemberProfile from './MemberProfile'; // Import the new component

interface MembersProps {
    members: Member[];
    memberLimit: number;
    setActiveView: (view: 'register' | 'attendance' | 'members') => void;
    onToggleOwner: (memberId: string) => void;
    ownerCount: number;
    ownerLimit: number;
    onUpdateMember: (updatedMember: Member) => void;
    onRegisterBiometrics: (member: Member) => void;
    onToggleFinanceOfficer: (memberId: string) => void;
    financeOfficerCount: number;
    financeOfficerLimit: number;
    activeMember: Member | undefined;
}

const CrownIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 4l3 12h14l3-12-6 7-4-7-4 7-6-7z"/>
    </svg>
);

const StarIcon: React.FC<{ className?: string, isFilled?: boolean }> = ({ className, isFilled }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill={isFilled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
    </svg>
);

const ShieldIcon: React.FC<{ className?: string, isFilled?: boolean }> = ({ className, isFilled }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill={isFilled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
    </svg>
);

const SearchIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8"></circle>
        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
    </svg>
);

const DownloadIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
        <polyline points="7 10 12 15 17 10"></polyline>
        <line x1="12" y1="15" x2="12" y2="3"></line>
    </svg>
);

const FileTextIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
        <polyline points="14 2 14 8 20 8"></polyline>
        <line x1="16" y1="13" x2="8" y2="13"></line>
        <line x1="16" y1="17" x2="8" y2="17"></line>
        <polyline points="10 9 9 9 8 9"></polyline>
    </svg>
);

export const CheckCircleIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
        <polyline points="22 4 12 14.01 9 11.01"></polyline>
    </svg>
);

export const ClockIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <polyline points="12 6 12 12 16 14"></polyline>
    </svg>
);

const PartyPopperIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5.3 18.7l1.4-1.4"/>
        <path d="M9 17l-1.4 1.4"/>
        <path d="M14.7 13.3l1.4-1.4"/>
        <path d="M13 15l-1.4 1.4"/>
        <path d="M10 9.5L5.5 5"/>
        <path d="M14.5 4L20 9.5"/>
        <path d="M7 10.5a2.5 2.5 0 0 0 5 0V8a2.5 2.5 0 0 0-5 0Z"/>
        <path d="M14 14a2.5 2.5 0 0 0 5 0V11a2.5 2.5 0 0 0-5 0Z"/>
    </svg>
);


const Members: React.FC<MembersProps> = ({ members, memberLimit, setActiveView, onToggleOwner, ownerCount, ownerLimit, onUpdateMember, onRegisterBiometrics, onToggleFinanceOfficer, financeOfficerCount, financeOfficerLimit, activeMember }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);

  const canManageRoles = activeMember?.isOwner === true;

  const filteredMembers = members.filter(member => {
    const instrumentName = member.instrument === Instrument.OTHER && member.otherInstrument 
        ? member.otherInstrument 
        : member.instrument;
    const lowerCaseQuery = searchQuery.toLowerCase();

    return (
        member.fullName.toLowerCase().includes(lowerCaseQuery) ||
        instrumentName.toLowerCase().includes(lowerCaseQuery)
    );
  });

  const selectedMemberData = members.find(m => m.id === selectedMemberId);
  const originalMemberIndex = selectedMemberData ? members.findIndex(m => m.id === selectedMemberData.id) : -1;

  const handleExportJSON = () => {
    if (members.length === 0) {
      alert("There are no members to export.");
      return;
    }

    const jsonString = JSON.stringify(members, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `heramb-musical-group-members-${new Date().toISOString().split('T')[0]}.json`;
    
    document.body.appendChild(link);
    link.click();
    
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleExportCSV = () => {
    if (members.length === 0) {
        alert("There are no members to export.");
        return;
    }

    const headers = ['id', 'fullName', 'email', 'phone', 'instrument', 'otherInstrument', 'skillLevel', 'experience', 'verificationStatus', 'isOwner', 'isFinanceOfficer'];
    
    const escapeCsvCell = (cellData: any): string => {
        const stringData = String(cellData ?? '');
        if (stringData.includes(',') || stringData.includes('"') || stringData.includes('\n')) {
            return `"${stringData.replace(/"/g, '""')}"`;
        }
        return stringData;
    };

    const csvContent = [
        headers.join(','),
        ...members.map(member => 
            headers.map(header => escapeCsvCell(member[header as keyof Member])).join(',')
        )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `heramb-musical-group-members-${new Date().toISOString().split('T')[0]}.csv`;
    
    document.body.appendChild(link);
    link.click();
    
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  if (selectedMemberData) {
    return (
        <MemberProfile 
            member={selectedMemberData} 
            onBack={() => setSelectedMemberId(null)}
            isFounder={originalMemberIndex < 3 && originalMemberIndex !== -1}
            onUpdateMember={onUpdateMember}
            onRegisterBiometrics={onRegisterBiometrics}
        />
    )
  }
  
  return (
    <div className="w-full max-w-lg bg-brand-dark/50 backdrop-blur-md rounded-xl shadow-2xl p-6 sm:p-8 animate-fade-in">
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-baseline gap-4">
            <h2 className="text-2xl sm:text-3xl font-bold font-serif text-white">
                Our Members
            </h2>
            <p className="text-lg font-sans font-semibold text-brand-gold">
                {members.length} / {memberLimit}
            </p>
        </div>
        <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 bg-brand-brown/70 rounded-lg p-1">
                <button onClick={handleExportJSON} className="text-brand-cream text-sm font-bold p-1 rounded-md hover:bg-brand-brown transition-colors" title="Export to JSON"><DownloadIcon className="w-5 h-5" /></button>
                <button onClick={handleExportCSV} className="text-brand-cream text-sm font-bold p-1 rounded-md hover:bg-brand-brown transition-colors" title="Export to CSV"><FileTextIcon className="w-5 h-5" /></button>
            </div>
            {canManageRoles && <button onClick={() => setActiveView('register')} className="bg-brand-gold/90 text-brand-dark text-sm font-bold py-2 px-4 rounded-lg hover:bg-brand-gold transition-colors" aria-label="Add new member">Add Member</button>}
        </div>
      </div>
      <div className="flex gap-4 text-sm text-brand-cream/70 mb-4">
        <span>Owners: {ownerCount} / {ownerLimit}</span>
        <span>Finance Officers: {financeOfficerCount} / {financeOfficerLimit}</span>
      </div>
      
      <div className="relative mb-6">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3"><SearchIcon className="w-5 h-5 text-brand-cream/60" /></span>
          <input type="text" placeholder="Search by name or instrument..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full bg-brand-dark/70 border border-brand-brown rounded-md py-2 pl-10 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-brand-gold focus:border-brand-gold"/>
      </div>

      {members.length === 0 ? (<p className="text-center text-brand-cream/70 py-8">No members have registered yet.</p>)
      : filteredMembers.length === 0 ? (<p className="text-center text-brand-cream/70 py-8">No members match your search.</p>)
      : (
        <ul className="space-y-3 max-h-[50vh] overflow-y-auto pr-2">
            {filteredMembers.map((member) => {
                const instrumentName = member.instrument === Instrument.OTHER && member.otherInstrument ? member.otherInstrument : member.instrument;
                const Icon = instrumentIcons[member.instrument];
                const isOwner = member.isOwner === true;
                const isFinanceOfficer = member.isFinanceOfficer === true;
                const canBecomeOwner = !isOwner && ownerCount < ownerLimit;
                const canBecomeFinanceOfficer = !isFinanceOfficer && financeOfficerCount < financeOfficerLimit;
                const originalIndex = members.findIndex(m => m.id === member.id);
                const isFounder = originalIndex < 3 && originalIndex !== -1;
                const isVerified = member.verificationStatus === 'verified';

                return (
                    <li key={member.id}>
                        <div className="w-full text-left bg-brand-dark/70 border border-brand-brown rounded-lg p-3 flex items-center gap-4">
                          <button onClick={() => setSelectedMemberId(member.id)} className="flex flex-grow items-center gap-4 group focus:outline-none">
                            <div className="relative flex-shrink-0">
                                <img src={member.photo} alt={member.fullName} className="w-12 h-12 rounded-full object-cover border-2 border-brand-gold/50 group-hover:border-brand-gold transition-colors"/>
                                <div className="absolute -bottom-1 -right-1 bg-brand-dark rounded-full p-0.5 border border-brand-gold/50"><Icon className="w-4 h-4 text-brand-gold" /></div>
                            </div>
                            <div className="flex-grow">
                                <h3 className="font-bold text-lg text-brand-cream group-hover:text-brand-gold transition-colors">{member.fullName}</h3>
                                <div className="flex items-center gap-2 flex-wrap mt-1">
                                    {isOwner && (<span className="flex items-center gap-1 text-xs font-bold bg-brand-gold text-brand-dark px-2 py-0.5 rounded-full"><CrownIcon className="w-3 h-3" /> Owner</span>)}
                                    {isFinanceOfficer && (<span className="flex items-center gap-1 text-xs font-bold bg-sky-500/30 text-sky-400 px-2 py-0.5 rounded-full"><ShieldIcon className="w-3 h-3" /> Finance Officer</span>)}
                                    {isFounder && (<span className="flex items-center gap-1 text-xs font-bold bg-indigo-500/30 text-indigo-400 px-2 py-0.5 rounded-full"><PartyPopperIcon className="w-3 h-3" /> Founder</span>)}
                                    {isVerified ? (<span className="flex items-center gap-1 text-xs font-bold bg-green-500/30 text-green-400 px-2 py-0.5 rounded-full" title="Verified"><CheckCircleIcon className="w-3 h-3" /> Verified</span>) : (<span className="flex items-center gap-1 text-xs font-bold bg-yellow-500/30 text-yellow-400 px-2 py-0.5 rounded-full" title="Pending Verification"><ClockIcon className="w-3 h-3" /> Pending</span>)}
                                </div>
                                <p className="text-sm text-brand-cream/80 mt-1">{instrumentName} - {member.skillLevel}</p>
                            </div>
                          </button>
                          {canManageRoles && (
                            <div className="ml-auto flex-shrink-0">
                                <button onClick={() => onToggleFinanceOfficer(member.id)} disabled={!isFinanceOfficer && !canBecomeFinanceOfficer} className={`p-2 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-brand-dark focus:ring-sky-400 ${isFinanceOfficer ? 'text-sky-400 hover:bg-sky-400/10' : canBecomeFinanceOfficer ? 'text-brand-cream/60 hover:text-sky-400 hover:bg-sky-400/10' : 'text-brand-cream/30 cursor-not-allowed'}`} aria-label={isFinanceOfficer ? 'Remove finance officer' : 'Make finance officer'}>
                                    <ShieldIcon className="w-6 h-6" isFilled={isFinanceOfficer} />
                                </button>
                                <button onClick={() => onToggleOwner(member.id)} disabled={!isOwner && !canBecomeOwner} className={`p-2 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-brand-dark focus:ring-brand-gold ${isOwner ? 'text-brand-gold hover:bg-brand-gold/10' : canBecomeOwner ? 'text-brand-cream/60 hover:text-brand-gold hover:bg-brand-gold/10' : 'text-brand-cream/30 cursor-not-allowed'}`} aria-label={isOwner ? 'Remove owner status' : 'Make owner'}>
                                    <StarIcon className="w-6 h-6" isFilled={isOwner} />
                                </button>
                            </div>
                          )}
                        </div>
                    </li>
                );
            })}
        </ul>
      )}
    </div>
  );
};

export default Members;