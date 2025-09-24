
import React, { useState } from 'react';
import { JamEvent, Member } from '../types';
import AttendanceRosterModal from './AttendanceRosterModal';
import { generateAttendanceConfirmation, generateCancellationMessage } from '../services/geminiService';

interface AttendanceProps {
  events: JamEvent[];
  members: Member[];
  onUpdateAttendance: (eventId: number, presentMemberIds: string[]) => void;
  onRsvp: (eventId: number, memberId: string, isAttending: boolean) => void;
  onAddEvent: () => void;
  onEditEvent: (event: JamEvent) => void;
  onDeleteEvent: (eventId: number) => void;
  onCheckInBiometrics: (event: JamEvent) => void;
  activeMemberId: string | null;
  setActiveMemberId: (id: string | null) => void;
}

const CalendarIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
);

const UsersIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
);

const EditIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
  </svg>
);

const TrashIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"></polyline>
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
    <line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line>
  </svg>
);

const FingerprintIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 12h.01"/><path d="M10.29 7.23a2 2 0 1 1-1.35 3.21 2 2 0 0 1 1.35-3.21z"/><path d="M14 12a2 2 0 1 0-2-2 2 2 0 0 0 2 2z"/><path d="M18.66 18.66a2 2 0 1 0-2.83-2.83 2 2 0 0 0 2.83 2.83z"/><path d="M18 12a6 6 0 1 0-6 6"/><path d="M12 18a6 6 0 1 0-6-6"/><path d="M12 2a10 10 0 1 0 10 10"/><path d="M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8z"/></svg>
);

const Attendance: React.FC<AttendanceProps> = ({ events, members, onUpdateAttendance, onRsvp, onAddEvent, onEditEvent, onDeleteEvent, onCheckInBiometrics, activeMemberId, setActiveMemberId }) => {
  const [selectedEvent, setSelectedEvent] = useState<JamEvent | null>(null);
  const [isRosterOpen, setIsRosterOpen] = useState(false);
  const [notification, setNotification] = useState<{ message: string, type: 'success' | 'info' } | null>(null);

  // Determine if the current user has admin rights for attendance
  const activeMember = activeMemberId ? members.find(m => m.id === activeMemberId) : null;
  const canTakeAttendance = activeMember?.isOwner === true;

  const handleOpenRoster = (event: JamEvent) => {
    setSelectedEvent(event);
    setIsRosterOpen(true);
  };
  
  const handleCloseRoster = () => {
    setIsRosterOpen(false);
    setSelectedEvent(null);
  }

  const handleRsvpClick = async (event: JamEvent, isAttending: boolean) => {
    if (!activeMemberId) {
      alert("Please select a member first."); // Simple user selection simulation
      return;
    }
    
    onRsvp(event.id, activeMemberId, isAttending);
    
    setNotification(null);
    try {
        const message = isAttending 
            ? await generateAttendanceConfirmation(event)
            : await generateCancellationMessage(event);
        setNotification({ message, type: 'success' });
    } catch (error) {
        console.error("Failed to generate RSVP message", error);
        setNotification({ message: `Your RSVP has been updated!`, type: 'info' });
    }
    setTimeout(() => setNotification(null), 5000);
  }

  const sortedEvents = [...events].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <div className="w-full max-w-lg bg-brand-dark/50 backdrop-blur-md rounded-xl shadow-2xl p-6 sm:p-8 animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl sm:text-3xl font-bold font-serif text-white">Upcoming Jams</h2>
        {canTakeAttendance &&
          <button onClick={onAddEvent} className="bg-brand-gold text-brand-dark font-bold py-2 px-4 rounded-lg hover:bg-yellow-400 transition-colors duration-300">
              Add Event
          </button>
        }
      </div>

      <div className="mb-6">
        <label htmlFor="member-select" className="block text-sm font-medium text-brand-cream/80 mb-2">Simulating as:</label>
        <select
          id="member-select"
          value={activeMemberId || ''}
          onChange={(e) => setActiveMemberId(e.target.value)}
          className="w-full bg-brand-dark/70 border border-brand-brown rounded-md py-2 px-3 text-white focus:outline-none focus:ring-brand-gold focus:border-brand-gold"
        >
          {members.map(member => (
            <option key={member.id} value={member.id}>{member.fullName}{member.isOwner ? ' (Owner)' : ''}{member.isFinanceOfficer ? ' (Finance)' : ''}</option>
          ))}
        </select>
      </div>
      
      {notification && (
        <div className={`p-4 mb-4 text-sm rounded-lg ${notification.type === 'success' ? 'bg-green-500/20 text-green-300' : 'bg-blue-500/20 text-blue-300'}`} role="alert">
            {notification.message}
        </div>
      )}

      {sortedEvents.length === 0 ? (
        <p className="text-center text-brand-cream/70 py-8">No upcoming events scheduled. Check back soon!</p>
      ) : (
        <ul className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
          {sortedEvents.map(event => {
            const eventDate = new Date(event.date);
            const isAttending = activeMemberId ? event.attendees.includes(activeMemberId) : false;
            return (
              <li key={event.id} className="bg-brand-dark/70 border border-brand-brown rounded-lg p-4">
                <div className="flex justify-between items-start">
                    <div>
                        <h3 className="text-xl font-bold text-brand-gold">{event.title}</h3>
                        <div className="flex items-center gap-2 text-brand-cream/80 text-sm mt-1">
                          <CalendarIcon className="w-4 h-4" />
                          <span>{eventDate.toLocaleString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: '2-digit' })}</span>
                        </div>
                    </div>
                    {canTakeAttendance && (
                      <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                          <button onClick={() => onEditEvent(event)} className="p-1.5 text-brand-cream/70 hover:text-brand-gold transition-colors" aria-label="Edit event" title="Edit Event"><EditIcon className="w-4 h-4" /></button>
                          <button onClick={() => onDeleteEvent(event.id)} className="p-1.5 text-brand-cream/70 hover:text-red-400 transition-colors" aria-label="Delete event" title="Delete Event"><TrashIcon className="w-4 h-4" /></button>
                      </div>
                    )}
                </div>
                <div className="flex items-center gap-2 text-brand-cream/80 text-sm mt-1">
                    <UsersIcon className="w-4 h-4" />
                    <span>{event.attendees.length} going &bull; {event.checkedInMembers.length} checked in</span>
                </div>

                <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-2">
                  <button
                    onClick={() => handleRsvpClick(event, !isAttending)}
                    className={`w-full text-center font-bold py-2 px-4 rounded-lg transition-colors duration-300 ${
                      isAttending
                        ? 'bg-red-600/70 hover:bg-red-600 text-white'
                        : 'bg-green-600/70 hover:bg-green-600 text-white'
                    } ${canTakeAttendance ? 'col-span-2 sm:col-span-1' : 'col-span-2'}`}
                  >
                    {isAttending ? "Can't Make It" : "I'm Going!"}
                  </button>
                  {canTakeAttendance && (
                    <>
                      <button
                        onClick={() => handleOpenRoster(event)}
                        className="w-full bg-brand-brown/70 text-brand-cream font-bold py-2 px-4 rounded-lg hover:bg-brand-brown transition-colors duration-300"
                      >
                        Checklist
                      </button>
                      <button
                        onClick={() => onCheckInBiometrics(event)}
                        className="w-full flex items-center justify-center gap-2 bg-sky-600/70 text-white font-bold py-2 px-4 rounded-lg hover:bg-sky-600 transition-colors duration-300"
                        title="Biometric Check-in"
                      >
                        <FingerprintIcon className="w-5 h-5" />
                        <span>Biometrics</span>
                      </button>
                    </>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
      
      {isRosterOpen && selectedEvent && (
        <AttendanceRosterModal
          isOpen={isRosterOpen}
          onClose={handleCloseRoster}
          event={selectedEvent}
          members={members}
          onUpdateAttendance={onUpdateAttendance}
        />
      )}
    </div>
  );
};

export default Attendance;