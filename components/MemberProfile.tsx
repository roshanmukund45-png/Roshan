import React, { useState, useRef } from 'react';
import { Member, Instrument, SkillLevel } from '../types';
import { instrumentIcons } from './InstrumentIcons';
import { ClockIcon, CheckCircleIcon } from './Members';

interface MemberProfileProps {
  member: Member;
  onBack: () => void;
  isFounder: boolean;
  onUpdateMember: (updatedMember: Member) => void;
  onRegisterBiometrics: (member: Member) => void;
}

const CrownIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 4l3 12h14l3-12-6 7-4-7-4 7-6-7z"/>
    </svg>
);

const PartyPopperIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5.3 18.7l1.4-1.4"/><path d="M9 17l-1.4 1.4"/><path d="M14.7 13.3l1.4-1.4"/><path d="M13 15l-1.4 1.4"/><path d="M10 9.5L5.5 5"/><path d="M14.5 4L20 9.5"/><path d="M7 10.5a2.5 2.5 0 0 0 5 0V8a2.5 2.5 0 0 0-5 0Z"/><path d="M14 14a2.5 2.5 0 0 0 5 0V11a2.5 2.5 0 0 0-5 0Z"/>
    </svg>
);

const BackArrowIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline>
    </svg>
);

const EditIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
  </svg>
);

const RupeeIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 3h12"/><path d="M6 8h12"/><path d="M6 13h12"/><path d="M6 18h12"/><path d="M8 21V3"/><path d="M12 21V3"/></svg>
);

const ShieldIcon: React.FC<{ className?: string, isFilled?: boolean }> = ({ className, isFilled }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill={isFilled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
    </svg>
);

const FingerprintIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 12h.01"/><path d="M10.29 7.23a2 2 0 1 1-1.35 3.21 2 2 0 0 1 1.35-3.21z"/><path d="M14 12a2 2 0 1 0-2-2 2 2 0 0 0 2 2z"/><path d="M18.66 18.66a2 2 0 1 0-2.83-2.83 2 2 0 0 0 2.83 2.83z"/><path d="M18 12a6 6 0 1 0-6 6"/><path d="M12 18a6 6 0 1 0-6-6"/><path d="M12 2a10 10 0 1 0 10 10"/><path d="M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8z"/></svg>
);

const MemberProfile: React.FC<MemberProfileProps> = ({ member, onBack, isFounder, onUpdateMember, onRegisterBiometrics }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editableMember, setEditableMember] = useState<Member>(member);
  const photoInputRef = useRef<HTMLInputElement>(null);

  const instrumentName = member.instrument === Instrument.OTHER && member.otherInstrument ? member.otherInstrument : member.instrument;
  const isVerified = member.verificationStatus === 'verified';

  const handleEditToggle = () => {
    if (!isEditing) setEditableMember(member);
    setIsEditing(!isEditing);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditableMember(member);
  };

  const handleSave = () => {
    onUpdateMember(editableMember);
    setIsEditing(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const isNumeric = type === 'number';
    setEditableMember(prev => ({ ...prev, [name as keyof Member]: isNumeric ? (value === '' ? undefined : parseFloat(value)) : value }));
  };
  
  const handleRadioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setEditableMember(prev => ({ ...prev, [e.target.name]: e.target.value as SkillLevel }));
  }

  const handleInstrumentChange = (instrument: Instrument) => {
    setEditableMember(prev => ({
      ...prev,
      instrument,
      otherInstrument: instrument !== Instrument.OTHER ? '' : prev.otherInstrument,
    }));
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (loadEvent) => {
        setEditableMember(prev => ({ ...prev, photo: loadEvent.target?.result as string }));
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  if (isEditing) {
    // EDITING VIEW
    return (
        <div className="w-full max-w-lg bg-brand-dark/50 backdrop-blur-md rounded-xl shadow-2xl p-6 sm:p-8 animate-fade-in">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <button onClick={handleCancel} className="mr-4 p-2 rounded-full text-brand-cream/70 hover:bg-brand-brown hover:text-white transition-colors duration-200" aria-label="Cancel">
                <BackArrowIcon className="w-6 h-6" />
              </button>
              <h2 className="text-2xl sm:text-3xl font-bold font-serif text-white">Edit Profile</h2>
            </div>
          </div>

          <div className="space-y-6 max-h-[65vh] overflow-y-auto pr-2">
             {/* Photo */}
            <div className="flex items-center gap-4">
              <img src={editableMember.photo} alt="Member" className="w-20 h-20 rounded-full object-cover border-2 border-brand-gold/50" />
              <button type="button" onClick={() => photoInputRef.current?.click()} className="bg-brand-brown/70 text-brand-cream font-bold py-2 px-4 rounded-lg hover:bg-brand-brown">Change Photo</button>
              <input type="file" ref={photoInputRef} onChange={handlePhotoChange} accept="image/*" className="hidden"/>
            </div>
            {/* Name */}
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-brand-cream">Full Name</label>
              <input type="text" id="fullName" name="fullName" value={editableMember.fullName} onChange={handleChange} className="mt-1 block w-full bg-brand-dark/70 border border-brand-brown rounded-md py-2 px-3 text-white" />
            </div>
            {/* Contact */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-brand-cream">Email</label>
                <input type="email" id="email" name="email" value={editableMember.email} onChange={handleChange} className="mt-1 block w-full bg-brand-dark/70 border border-brand-brown rounded-md py-2 px-3 text-white" />
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-brand-cream">Phone</label>
                <input type="tel" id="phone" name="phone" value={editableMember.phone} onChange={handleChange} className="mt-1 block w-full bg-brand-dark/70 border border-brand-brown rounded-md py-2 px-3 text-white" />
              </div>
            </div>
            {/* Instrument */}
            <div>
                <label className="block text-sm font-medium text-brand-cream">Primary Instrument</label>
                <div className="mt-2 grid grid-cols-3 gap-2 sm:gap-3">
                    {Object.values(Instrument).map(inst => (
                        <button type="button" key={inst} onClick={() => handleInstrumentChange(inst)} className={`flex flex-col items-center p-2 rounded-lg border-2 ${editableMember.instrument === inst ? 'bg-brand-gold text-brand-dark border-brand-gold' : 'bg-brand-dark/70 border-brand-brown text-brand-cream'}`}>
                            {React.createElement(instrumentIcons[inst], { className: "w-6 h-6 mb-1"})}
                            <span className="text-xs">{inst}</span>
                        </button>
                    ))}
                </div>
            </div>
            {editableMember.instrument === Instrument.OTHER && (
                <input type="text" name="otherInstrument" value={editableMember.otherInstrument} onChange={handleChange} placeholder="Specify instrument" className="block w-full bg-brand-dark/70 border border-brand-brown rounded-md py-2 px-3 text-white"/>
            )}
            {/* Skill Level */}
            <div>
                <label className="block text-sm font-medium text-brand-cream">Skill Level</label>
                 <div className="mt-2 grid grid-cols-3 gap-3 bg-brand-dark/70 border border-brand-brown rounded-lg p-2">
                    {Object.values(SkillLevel).map(level => (
                      <div key={level}>
                        <input type="radio" id={`edit-${level}`} name="skillLevel" value={level} checked={editableMember.skillLevel === level} onChange={handleRadioChange} className="sr-only peer" />
                        <label htmlFor={`edit-${level}`} className="w-full text-center block text-sm font-medium rounded-md py-2 px-3 cursor-pointer peer-checked:bg-brand-gold peer-checked:text-brand-dark text-brand-cream">
                          {level}
                        </label>
                      </div>
                    ))}
                </div>
            </div>
            {/* Experience */}
            <div>
                <label htmlFor="experience" className="block text-sm font-medium text-brand-cream">Musical Experience</label>
                <textarea id="experience" name="experience" rows={3} value={editableMember.experience} onChange={handleChange} className="mt-1 block w-full bg-brand-dark/70 border border-brand-brown rounded-md py-2 px-3 text-white" />
            </div>
             {/* Pay Rate */}
            <div>
                <label htmlFor="payRate" className="block text-sm font-medium text-brand-cream">Pay Rate per Event (₹)</label>
                <input type="number" id="payRate" name="payRate" value={editableMember.payRate ?? ''} onChange={handleChange} min="0" step="1" className="mt-1 block w-full bg-brand-dark/70 border border-brand-brown rounded-md py-2 px-3 text-white"/>
            </div>
          </div>
          
          <div className="mt-6 flex justify-end">
            <button onClick={handleSave} className="bg-brand-gold text-brand-dark font-bold py-2 px-6 rounded-lg hover:bg-yellow-400">Save Changes</button>
          </div>
        </div>
    );
  }

  // DEFAULT VIEW
  return (
    <div className="w-full max-w-lg bg-brand-dark/50 backdrop-blur-md rounded-xl shadow-2xl p-6 sm:p-8 animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
            <button onClick={onBack} className="mr-4 p-2 rounded-full text-brand-cream/70 hover:bg-brand-brown hover:text-white transition-colors duration-200" aria-label="Back">
              <BackArrowIcon className="w-6 h-6" />
            </button>
            <h2 className="text-2xl sm:text-3xl font-bold font-serif text-white">
              Member Profile
            </h2>
        </div>
        <button onClick={handleEditToggle} className="flex items-center gap-2 bg-brand-brown/70 text-brand-cream font-bold py-2 px-4 rounded-lg hover:bg-brand-brown transition-colors duration-300">
            <EditIcon className="w-4 h-4" /> Edit
        </button>
      </div>

      {/* Profile Header */}
      <div className="flex flex-col items-center text-center">
        <img src={member.photo} alt={member.fullName} className="w-28 h-28 rounded-full object-cover border-4 border-brand-gold/80 shadow-lg mb-4"/>
        <h3 className="text-3xl font-bold font-serif text-white">{member.fullName}</h3>
        <div className="flex items-center gap-2 flex-wrap mt-2 justify-center">
            {member.isOwner && (<span className="flex items-center gap-1 text-sm font-bold bg-brand-gold text-brand-dark px-2 py-1 rounded-full"><CrownIcon className="w-4 h-4" /> Owner</span>)}
            {member.isFinanceOfficer && (<span className="flex items-center gap-1 text-sm font-bold bg-sky-500/30 text-sky-400 px-2 py-1 rounded-full"><ShieldIcon className="w-4 h-4" /> Finance Officer</span>)}
            {isFounder && (<span className="flex items-center gap-1 text-sm font-bold bg-indigo-500/30 text-indigo-400 px-2 py-1 rounded-full"><PartyPopperIcon className="w-4 h-4" /> Founder</span>)}
            {isVerified ? (<span className="flex items-center gap-1 text-sm font-bold bg-green-500/30 text-green-400 px-2 py-1 rounded-full" title="Verified"><CheckCircleIcon className="w-4 h-4" /> Verified</span>) : (<span className="flex items-center gap-1 text-sm font-bold bg-yellow-500/30 text-yellow-400 px-2 py-1 rounded-full" title="Pending Verification"><ClockIcon className="w-4 h-4" /> Pending</span>)}
        </div>
      </div>
      
      <div className="mt-8 space-y-6">
        {/* Contact Info */}
        <div className="bg-brand-dark/40 p-4 rounded-lg">
          <h4 className="font-bold text-lg text-brand-gold mb-2">Contact Information</h4>
          <p className="text-brand-cream"><strong>Email:</strong> {member.email}</p>
          <p className="text-brand-cream"><strong>Phone:</strong> {member.phone}</p>
        </div>
        {/* Musical Profile */}
        <div className="bg-brand-dark/40 p-4 rounded-lg">
          <h4 className="font-bold text-lg text-brand-gold mb-2">Musical Profile</h4>
          <p className="text-brand-cream flex items-center gap-2"><strong>Instrument:</strong> <span className="flex items-center gap-1">{React.createElement(instrumentIcons[member.instrument], { className: "w-4 h-4"})} {instrumentName}</span></p>
          <p className="text-brand-cream"><strong>Skill Level:</strong> {member.skillLevel}</p>
          {member.experience && <p className="text-brand-cream mt-2 pt-2 border-t border-brand-brown/50"><strong>Experience:</strong> <em>"{member.experience}"</em></p>}
        </div>
        {/* Salary Information */}
        <div className="bg-brand-dark/40 p-4 rounded-lg">
          <h4 className="font-bold text-lg text-brand-gold mb-2 flex items-center gap-2"><RupeeIcon className="w-5 h-5"/> Salary Information</h4>
          <p className="text-brand-cream"><strong>Pay Rate:</strong> ₹{member.payRate?.toFixed(2) ?? 'Not set'} per event</p>
        </div>
        {/* Biometric Check-in */}
        <div className="bg-brand-dark/40 p-4 rounded-lg">
            <h4 className="font-bold text-lg text-brand-gold mb-2 flex items-center gap-2"><FingerprintIcon className="w-5 h-5"/> Biometric Check-in</h4>
            {member.webAuthnCredentialId ? (
                <div className="flex items-center gap-2 text-green-400 font-semibold">
                    <CheckCircleIcon className="w-5 h-5"/>
                    <span>Enabled</span>
                </div>
            ) : (
                <>
                    <p className="text-brand-cream/80 text-sm mb-3">Enable faster, secure check-ins for events using your device's fingerprint or face recognition.</p>
                    <button onClick={() => onRegisterBiometrics(member)} className="bg-sky-600/70 text-white font-bold py-2 px-4 rounded-lg hover:bg-sky-600 transition-colors">
                        Enable Now
                    </button>
                </>
            )}
        </div>
      </div>
    </div>
  );
};

export default MemberProfile;
