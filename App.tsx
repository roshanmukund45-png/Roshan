import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import RegistrationForm from './components/RegistrationForm';
import Members from './components/Members';
import Attendance from './components/Attendance';
import CalendarView from './components/CalendarView';
import Finance from './components/Finance';
import EventModal from './components/EventModal';
import ShareModal from './components/ShareModal';
import FingerprintModal from './components/FingerprintModal';
import { Member, JamEvent, Instrument, SkillLevel, Financials, Transaction } from './types';
import { loadMembers, saveMembers, loadEvents, saveEvents, loadLogo, saveLogo, loadFinancials, saveFinancials } from './services/storageService';

const MEMBER_LIMIT = 50;
const OWNER_LIMIT = 5;
const FINANCE_OFFICER_LIMIT = 3;

const defaultAvatar = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLXdpZHRoPSIxIiBzdHJva2UtbGluZWNhcD0icm9udWQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiPjxwYXRoIGQ9Ik0yMCAyMXYtMmE0IDQgMCAwIDAtNC00SDhhNCA0IDAgMCAwLTQgNHYyIj48L3BhdGg+PGNpcmNsZSBjeD0iMTIiIGN5PSI3IiByPSI0Ij48L2NpcmNsZT48L3N2Zz4=';

// Define initial data for first-time load.
const initialMembers: Member[] = [
  { id: '1', fullName: 'Heramb', email: 'heramb@example.com', phone: '123-456-7890', photo: defaultAvatar, instrument: Instrument.DRUM, otherInstrument: '', skillLevel: SkillLevel.ADVANCED, experience: 'Founder and lead drummer.', verificationToken: 'founder1', verificationStatus: 'verified', isOwner: true, payRate: 4150 }, // 50 USD * 83
  { id: '2', fullName: 'Rhythm Raja', email: 'raja@example.com', phone: '123-456-7891', photo: defaultAvatar, instrument: Instrument.THAP_DHOL, otherInstrument: '', skillLevel: SkillLevel.ADVANCED, experience: 'Specializes in traditional beats.', verificationToken: 'founder2', verificationStatus: 'verified', isOwner: true, isFinanceOfficer: true, payRate: 4150 }, // 50 USD * 83
  { id: '3', fullName: 'Beatriz', email: 'beatriz@example.com', phone: '123-456-7892', photo: defaultAvatar, instrument: Instrument.TASHA, otherInstrument: '', skillLevel: SkillLevel.INTERMEDIATE, experience: 'Loves high-energy performances.', verificationToken: 'founder3', verificationStatus: 'verified', isOwner: false, payRate: 3320 }, // 40 USD * 83
];

const getInitialEvents = (): JamEvent[] => {
  const nextSaturday = new Date();
  nextSaturday.setDate(nextSaturday.getDate() + (6 - nextSaturday.getDay() + 7) % 7);
  nextSaturday.setHours(18, 0, 0, 0);

  const twoWeeksFromSaturday = new Date(nextSaturday);
  twoWeeksFromSaturday.setDate(twoWeeksFromSaturday.getDate() + 14);

  return [
    { id: 1, title: 'Weekly Jam Session', date: nextSaturday.toISOString(), attendees: ['1', '2'], checkedInMembers: ['1', '2'], paidMembers: [] },
    { id: 2, title: 'Rhythm Workshop', date: twoWeeksFromSaturday.toISOString(), attendees: [], checkedInMembers: [], paidMembers: [] },
  ];
};

const initialFinancials: Financials = {
    balance: 0,
    transactions: []
};

const App: React.FC = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [events, setEvents] = useState<JamEvent[]>([]);
  const [financials, setFinancials] = useState<Financials>({ balance: 0, transactions: []});
  const [groupLogo, setGroupLogo] = useState<string | null>(null);
  const [activeView, setActiveView] = useState<'register' | 'attendance' | 'members' | 'calendar' | 'finance'>('register');
  const [activeMemberId, setActiveMemberId] = useState<string | null>(null); // State for the currently 'logged in' user
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [eventModalState, setEventModalState] = useState<{ isOpen: boolean; event?: JamEvent; date?: string }>({ isOpen: false });
  const [fingerprintModalState, setFingerprintModalState] = useState<{ isOpen: boolean; mode: 'register' | 'checkin'; member?: Member; event?: JamEvent }>({ isOpen: false, mode: 'register' });

  // Load data and handle verification on mount
  useEffect(() => {
    const loadedMembers = loadMembers();
    if (loadedMembers.length > 0) {
      setMembers(loadedMembers);
      setActiveMemberId(loadedMembers[0].id); // Set active user
    } else {
      setMembers(initialMembers);
      setActiveMemberId(initialMembers[0].id); // Set active user
    }

    const loadedEvents = loadEvents();
    if (loadedEvents.length > 0) setEvents(loadedEvents);
    else setEvents(getInitialEvents());

    const loadedFinancials = loadFinancials();
    if (loadedFinancials) setFinancials(loadedFinancials);
    else setFinancials(initialFinancials);
    
    const loadedLogo = loadLogo();
    if (loadedLogo) setGroupLogo(loadedLogo);

    // Check for verification token in URL
    const urlParams = new URLSearchParams(window.location.search);
    const verifyToken = urlParams.get('verify');
    if (verifyToken) {
      setMembers(prevMembers => {
        const memberIndex = prevMembers.findIndex(m => m.verificationToken === verifyToken);
        if (memberIndex !== -1 && prevMembers[memberIndex].verificationStatus === 'pending') {
          const updatedMembers = [...prevMembers];
          updatedMembers[memberIndex] = { ...updatedMembers[memberIndex], verificationStatus: 'verified' };
          alert(`Welcome, ${updatedMembers[memberIndex].fullName}! Your registration is complete.`);
          window.history.replaceState({}, document.title, window.location.pathname);
          return updatedMembers;
        }
        return prevMembers;
      });
      setActiveView('members');
    }
  }, []);

  // Save data whenever it changes
  useEffect(() => { if (members.length > 0) saveMembers(members); }, [members]);
  useEffect(() => { if (events.length > 0) saveEvents(events); }, [events]);
  useEffect(() => { saveFinancials(financials); }, [financials]);

  const handleAddMember = (member: Member) => {
    setMembers(prevMembers => [...prevMembers, member]);
    setActiveView('members');
  };

  const handleUpdateMember = (updatedMember: Member) => {
    setMembers(prevMembers => prevMembers.map(m => m.id === updatedMember.id ? updatedMember : m));
  };
  
  const ownerCount = members.filter(m => m.isOwner).length;
  const financeOfficerCount = members.filter(m => m.isFinanceOfficer).length;
  
  const handleToggleOwner = (memberId: string) => {
    setMembers(prevMembers => {
      const member = prevMembers.find(m => m.id === memberId);
      if (!member) return prevMembers;
      if (member.isOwner) {
        return prevMembers.map(m => m.id === memberId ? { ...m, isOwner: false } : m);
      } else if (ownerCount < OWNER_LIMIT) {
        return prevMembers.map(m => m.id === memberId ? { ...m, isOwner: true } : m);
      } else {
        alert(`Cannot have more than ${OWNER_LIMIT} owners.`);
        return prevMembers;
      }
    });
  };

  const handleToggleFinanceOfficer = (memberId: string) => {
    setMembers(prevMembers => {
      const member = prevMembers.find(m => m.id === memberId);
      if (!member) return prevMembers;
      if (member.isFinanceOfficer) {
        return prevMembers.map(m => m.id === memberId ? { ...m, isFinanceOfficer: false } : m);
      } else if (financeOfficerCount < FINANCE_OFFICER_LIMIT) {
        return prevMembers.map(m => m.id === memberId ? { ...m, isFinanceOfficer: true } : m);
      } else {
        alert(`Cannot have more than ${FINANCE_OFFICER_LIMIT} finance officers.`);
        return prevMembers;
      }
    });
  };


  const handleUpdateAttendance = (eventId: number, presentMemberIds: string[]) => {
    setEvents(prevEvents => prevEvents.map(event => 
      event.id === eventId ? { ...event, checkedInMembers: presentMemberIds } : event
    ));
  };
  
  const handleRsvp = (eventId: number, memberId: string, isAttending: boolean) => {
    setEvents(prevEvents => prevEvents.map(event => {
      if (event.id !== eventId) return event;
      const attendees = new Set(event.attendees);
      if (isAttending) attendees.add(memberId);
      else attendees.delete(memberId);
      return { ...event, attendees: Array.from(attendees) };
    }));
  };

  // --- Event CRUD Handlers ---
  const handleCreateEvent = (title: string, dateTime: string) => {
    const newEvent: JamEvent = {
        id: Date.now(), title, date: dateTime, attendees: [], checkedInMembers: [], paidMembers: []
    };
    setEvents(prev => [...prev, newEvent]);
    setEventModalState({ isOpen: false });
  };

  const handleUpdateEvent = (updatedEvent: JamEvent) => {
      setEvents(prev => prev.map(e => e.id === updatedEvent.id ? updatedEvent : e));
      setEventModalState({ isOpen: false });
  };

  const handleDeleteEvent = (eventId: number) => {
      if (window.confirm('Are you sure you want to delete this event? This action cannot be undone.')) {
        setEvents(prev => prev.filter(e => e.id !== eventId));
        setEventModalState({ isOpen: false });
      }
  };
  
  // --- Biometric Handlers ---
  const handleRegisterBiometrics = (member: Member) => {
      setFingerprintModalState({ isOpen: true, mode: 'register', member });
  };
  const handleCheckInBiometrics = (event: JamEvent) => {
      setFingerprintModalState({ isOpen: true, mode: 'checkin', event });
  };
  const handleBiometricSuccess = (memberId: string) => {
      if (fingerprintModalState.mode === 'checkin' && fingerprintModalState.event) {
          const eventId = fingerprintModalState.event.id;
          setEvents(prevEvents => prevEvents.map(event => {
              if (event.id !== eventId) return event;
              const checkedIn = new Set(event.checkedInMembers);
              checkedIn.add(memberId);
              return { ...event, checkedInMembers: Array.from(checkedIn) };
          }));
      }
  };
  
  // --- Logo Handler ---
  const handleLogoChange = (newLogo: string) => {
      setGroupLogo(newLogo);
      saveLogo(newLogo);
  }

  // --- Financial Handlers ---
  const handleAddFunds = (amount: number, description: string) => {
      const newTransaction: Transaction = {
          id: crypto.randomUUID(),
          date: new Date().toISOString(),
          description,
          amount,
      };
      setFinancials(prev => ({
          balance: prev.balance + amount,
          transactions: [newTransaction, ...prev.transactions],
      }));
  };

  const handleRemoveFunds = (amount: number, description: string) => {
      if (financials.balance < amount) {
          alert("Insufficient funds for this withdrawal.");
          return;
      }
      const newTransaction: Transaction = {
          id: crypto.randomUUID(),
          date: new Date().toISOString(),
          description,
          amount: -amount,
      };
      setFinancials(prev => ({
          balance: prev.balance - amount,
          transactions: [newTransaction, ...prev.transactions],
      }));
  };

  const handleProcessPayment = (event: JamEvent, member: Member) => {
      const payRate = member.payRate ?? 0;
      if (financials.balance < payRate) {
          alert("Insufficient funds to process this payment.");
          return;
      }
      // 1. Update event's paid members
      setEvents(prevEvents => prevEvents.map(e => {
          if (e.id !== event.id) return e;
          const paid = new Set(e.paidMembers);
          paid.add(member.id);
          return { ...e, paidMembers: Array.from(paid) };
      }));

      // 2. Update financials
      const newTransaction: Transaction = {
          id: crypto.randomUUID(),
          date: new Date().toISOString(),
          description: `Payment to ${member.fullName} for ${event.title}`,
          amount: -payRate,
      };
      setFinancials(prev => ({
          balance: prev.balance - payRate,
          transactions: [newTransaction, ...prev.transactions],
      }));
  };
  
  const activeMember = members.find(m => m.id === activeMemberId);
  const canViewFinance = activeMember?.isOwner || activeMember?.isFinanceOfficer;

  const renderContent = () => {
    switch (activeView) {
      case 'register':
        return <RegistrationForm onAddMember={handleAddMember} memberCount={members.length} memberLimit={MEMBER_LIMIT} />;
      case 'members':
        return <Members members={members} memberLimit={MEMBER_LIMIT} setActiveView={setActiveView} onToggleOwner={handleToggleOwner} ownerCount={ownerCount} ownerLimit={OWNER_LIMIT} onUpdateMember={handleUpdateMember} onRegisterBiometrics={handleRegisterBiometrics} onToggleFinanceOfficer={handleToggleFinanceOfficer} financeOfficerCount={financeOfficerCount} financeOfficerLimit={FINANCE_OFFICER_LIMIT} activeMember={activeMember} />;
      case 'attendance':
        return <Attendance events={events} members={members} onUpdateAttendance={handleUpdateAttendance} onRsvp={handleRsvp} onAddEvent={() => setEventModalState({ isOpen: true })} onEditEvent={(event) => setEventModalState({ isOpen: true, event })} onDeleteEvent={handleDeleteEvent} onCheckInBiometrics={handleCheckInBiometrics} activeMemberId={activeMemberId} setActiveMemberId={setActiveMemberId} />;
      case 'calendar':
        return <CalendarView events={events} onSelectDate={(date) => setEventModalState({ isOpen: true, date })} onSelectEvent={(event) => setEventModalState({ isOpen: true, event })} />;
      case 'finance':
        return canViewFinance ? <Finance financials={financials} onAddFunds={handleAddFunds} onRemoveFunds={handleRemoveFunds} events={events} members={members} onProcessPayment={handleProcessPayment} /> : <div className="text-center p-8"><h2 className="text-2xl text-red-400">Access Denied</h2><p className="text-brand-cream/80 mt-2">You do not have permission to view this section.</p></div>;
      default:
        return <RegistrationForm onAddMember={handleAddMember} memberCount={members.length} memberLimit={MEMBER_LIMIT} />;
    }
  };

  return (
    <div className="min-h-screen bg-brand-dark bg-cover bg-center bg-fixed text-brand-cream flex flex-col" style={{backgroundImage: "url('/background.svg')"}}>
      <Header onShareClick={() => setIsShareModalOpen(true)} logo={groupLogo} onLogoChange={handleLogoChange} />
      <main className="flex-grow flex flex-col items-center p-4 sm:p-6">
        <div className="flex items-center gap-2 sm:gap-4 mb-6 flex-wrap justify-center">
            <button onClick={() => setActiveView('register')} className={`px-3 sm:px-4 py-2 font-bold rounded-t-lg transition-colors ${activeView === 'register' ? 'bg-brand-dark/50 text-brand-gold' : 'bg-black/20 text-brand-cream/70 hover:bg-black/40'}`}>Register</button>
            <button onClick={() => setActiveView('members')} className={`px-3 sm:px-4 py-2 font-bold rounded-t-lg transition-colors ${activeView === 'members' ? 'bg-brand-dark/50 text-brand-gold' : 'bg-black/20 text-brand-cream/70 hover:bg-black/40'}`}>Members</button>
            <button onClick={() => setActiveView('attendance')} className={`px-3 sm:px-4 py-2 font-bold rounded-t-lg transition-colors ${activeView === 'attendance' ? 'bg-brand-dark/50 text-brand-gold' : 'bg-black/20 text-brand-cream/70 hover:bg-black/40'}`}>Attendance</button>
            <button onClick={() => setActiveView('calendar')} className={`px-3 sm:px-4 py-2 font-bold rounded-t-lg transition-colors ${activeView === 'calendar' ? 'bg-brand-dark/50 text-brand-gold' : 'bg-black/20 text-brand-cream/70 hover:bg-black/40'}`}>Calendar</button>
            {canViewFinance && <button onClick={() => setActiveView('finance')} className={`px-3 sm:px-4 py-2 font-bold rounded-t-lg transition-colors ${activeView === 'finance' ? 'bg-brand-dark/50 text-brand-gold' : 'bg-black/20 text-brand-cream/70 hover:bg-black/40'}`}>Finance</button>}
        </div>
        {renderContent()}
      </main>
      <Footer />
      <ShareModal isOpen={isShareModalOpen} onClose={() => setIsShareModalOpen(false)} />
      <EventModal 
        isOpen={eventModalState.isOpen}
        onClose={() => setEventModalState({ isOpen: false })}
        event={eventModalState.event}
        selectedDate={eventModalState.date}
        onCreate={handleCreateEvent}
        onUpdate={handleUpdateEvent}
        onDelete={handleDeleteEvent}
      />
      <FingerprintModal
        isOpen={fingerprintModalState.isOpen}
        mode={fingerprintModalState.mode}
        member={fingerprintModalState.member}
        event={fingerprintModalState.event}
        allMembers={members}
        onClose={() => setFingerprintModalState({ isOpen: false, mode: 'register' })}
        onUpdateMember={handleUpdateMember}
        onSuccess={handleBiometricSuccess}
      />
    </div>
  );
};

export default App;