
import React, { useState, useCallback, useRef } from 'react';
import { Instrument, SkillLevel, RegistrationFormData, FormStatus, Member } from '../types';
import { generateWelcomeMessage } from '../services/geminiService';
import { instrumentIcons } from './InstrumentIcons';

interface RegistrationFormProps {
    onAddMember: (member: Member) => void;
    memberCount: number;
    memberLimit: number;
}

const CameraIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle></svg>
);

const RegistrationForm: React.FC<RegistrationFormProps> = ({ onAddMember, memberCount, memberLimit }) => {
  const [formData, setFormData] = useState<RegistrationFormData>({
    fullName: '',
    email: '',
    phone: '',
    photo: '',
    instrument: Instrument.DRUM,
    otherInstrument: '',
    skillLevel: SkillLevel.BEGINNER,
    experience: '',
  });
  const [status, setStatus] = useState<FormStatus>(FormStatus.IDLE);
  const [error, setError] = useState<string | null>(null);
  const [welcomeMessage, setWelcomeMessage] = useState<string>('');
  const [verificationLink, setVerificationLink] = useState<string>('');
  const photoInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (loadEvent) => {
        setFormData(prev => ({ ...prev, photo: loadEvent.target?.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name as keyof RegistrationFormData]: value }));
  };
  
  const handleRadioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setFormData(prev => ({ ...prev, [name]: value as SkillLevel }));
  }

  const handleInstrumentChange = (instrument: Instrument) => {
    setFormData(prev => ({
      ...prev,
      instrument,
      otherInstrument: instrument !== Instrument.OTHER ? '' : prev.otherInstrument,
    }));
  };

  const resetForm = useCallback(() => {
    setFormData({
      fullName: '',
      email: '',
      phone: '',
      photo: '',
      instrument: Instrument.DRUM,
      otherInstrument: '',
      skillLevel: SkillLevel.BEGINNER,
      experience: '',
    });
    if (photoInputRef.current) {
        photoInputRef.current.value = '';
    }
    setStatus(FormStatus.IDLE);
    setError(null);
    setVerificationLink('');
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formData.photo) {
        setError('Please upload a member photo.');
        return;
    }
    if (formData.instrument === Instrument.OTHER && !formData.otherInstrument) {
        setError('Please specify your instrument.');
        return;
    }
    setError(null);
    setStatus(FormStatus.LOADING);
    
    try {
      const message = await generateWelcomeMessage(formData);
      setWelcomeMessage(message);
      
      const verificationToken = Date.now().toString(36) + Math.random().toString(36).substring(2);

      const newMember: Member = {
          ...formData,
          id: crypto.randomUUID(), // Optimal unique ID
          verificationToken,
          verificationStatus: 'pending',
      };
      
      const verifyUrl = `${window.location.origin}${window.location.pathname}?verify=${newMember.verificationToken}`;
      setVerificationLink(verifyUrl);

      onAddMember(newMember);
      
      setStatus(FormStatus.SUCCESS);
    } catch (err) {
      console.error(err);
      setError('Something went wrong while generating your welcome message. Please try again later.');
      setStatus(FormStatus.ERROR);
    }
  };

  if (memberCount >= memberLimit) {
    return (
      <div className="w-full max-w-lg bg-brand-dark/50 backdrop-blur-md rounded-xl shadow-2xl p-8 text-center animate-fade-in">
        <h2 className="text-3xl font-bold font-serif text-brand-gold mb-4">We're Full!</h2>
        <p className="text-lg text-brand-cream mb-6">
          Our musical group has reached its capacity of {memberLimit} members. Thank you for your interest! Please check back later.
        </p>
      </div>
    );
  }

  if (status === FormStatus.SUCCESS) {
    return (
      <div className="w-full max-w-lg bg-brand-dark/50 backdrop-blur-md rounded-xl shadow-2xl p-8 text-center animate-fade-in">
        <h2 className="text-3xl font-bold font-serif text-brand-gold mb-4">Almost There!</h2>
        <p className="text-lg text-brand-cream mb-4">
          We've "sent" a verification link to your email. Please click the link below to complete your registration.
        </p>
        <div className="bg-brand-dark/70 p-4 rounded-lg mb-6 text-left">
          <p className="text-sm text-brand-cream/70 mb-2">For demonstration purposes, your verification link is:</p>
          <a
            href={verificationLink}
            className="text-brand-gold break-all text-sm hover:underline"
            target="_blank" // Open in new tab to simulate leaving the page
            rel="noopener noreferrer"
          >
            {verificationLink}
          </a>
        </div>
        <p className="text-lg text-brand-cream whitespace-pre-wrap mb-6">{welcomeMessage}</p>
        <button
          onClick={resetForm}
          className="w-full bg-brand-gold text-brand-dark font-bold py-3 px-4 rounded-lg hover:bg-yellow-400 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-brand-dark focus:ring-brand-gold"
        >
          Register Another Member
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-lg bg-brand-dark/50 backdrop-blur-md rounded-xl shadow-2xl p-6 sm:p-8">
      <h2 className="text-2xl sm:text-3xl font-bold font-serif text-center text-white mb-6">Join Our Jam!</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Photo Upload */}
        <div>
            <label className="block text-sm font-medium text-brand-cream mb-2">Member Photo (Required)</label>
            <div className="flex items-center gap-4">
                <div className="relative">
                    <img
                        src={formData.photo || 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'}
                        alt="Member preview"
                        className="w-24 h-24 rounded-full object-cover bg-brand-dark/70 border-2 border-brand-brown"
                    />
                    {!formData.photo && (
                        <div className="absolute inset-0 flex items-center justify-center text-brand-cream/70">
                            <CameraIcon className="w-8 h-8"/>
                        </div>
                    )}
                </div>
                <button
                    type="button"
                    onClick={() => photoInputRef.current?.click()}
                    className="bg-brand-brown/70 text-brand-cream font-bold py-2 px-4 rounded-lg hover:bg-brand-brown transition-colors duration-300"
                >
                    {formData.photo ? 'Change Photo' : 'Upload Photo'}
                </button>
                <input
                    type="file"
                    ref={photoInputRef}
                    onChange={handlePhotoChange}
                    accept="image/*"
                    className="hidden"
                />
            </div>
        </div>
      
        {/* Full Name */}
        <div>
          <label htmlFor="fullName" className="block text-sm font-medium text-brand-cream">Full Name</label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            required
            className="mt-1 block w-full bg-brand-dark/70 border border-brand-brown rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-brand-gold focus:border-brand-gold"
          />
        </div>

        {/* Email & Phone */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-brand-cream">Email Address</label>
            <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required className="mt-1 block w-full bg-brand-dark/70 border border-brand-brown rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-brand-gold focus:border-brand-gold" />
          </div>
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-brand-cream">Phone Number</label>
            <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} required className="mt-1 block w-full bg-brand-dark/70 border border-brand-brown rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-brand-gold focus:border-brand-gold" />
          </div>
        </div>
        
        {/* Instrument */}
        <div>
          <label className="block text-sm font-medium text-brand-cream">Primary Instrument</label>
          <div className="mt-2 grid grid-cols-3 gap-2 sm:gap-3">
            {Object.values(Instrument).map(inst => {
              const Icon = instrumentIcons[inst];
              const isSelected = formData.instrument === inst;
              return (
                <button
                  type="button"
                  key={inst}
                  onClick={() => handleInstrumentChange(inst)}
                  className={`flex flex-col items-center justify-center p-2 sm:p-3 rounded-lg border-2 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-brand-dark focus:ring-brand-gold ${
                    isSelected
                      ? 'bg-brand-gold text-brand-dark border-brand-gold'
                      : 'bg-brand-dark/70 border-brand-brown text-brand-cream hover:border-brand-gold/70'
                  }`}
                  aria-pressed={isSelected}
                >
                  <Icon className="w-6 h-6 sm:w-8 sm:h-8 mb-1" />
                  <span className="text-xs sm:text-sm font-medium">{inst}</span>
                </button>
              );
            })}
          </div>
        </div>
        
        {/* Other Instrument Input (Conditional) */}
        {formData.instrument === Instrument.OTHER && (
          <div className="animate-fade-in">
            <label htmlFor="otherInstrument" className="block text-sm font-medium text-brand-cream">Please Specify</label>
            <input
              type="text"
              id="otherInstrument"
              name="otherInstrument"
              value={formData.otherInstrument}
              onChange={handleChange}
              required
              className="mt-1 block w-full bg-brand-dark/70 border border-brand-brown rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-brand-gold focus:border-brand-gold"
              placeholder="e.g., Harmonica"
            />
          </div>
        )}


        {/* Skill Level */}
        <div>
          <label className="block text-sm font-medium text-brand-cream">Skill Level</label>
          <div className="mt-2 grid grid-cols-3 gap-3 bg-brand-dark/70 border border-brand-brown rounded-lg p-2">
            {Object.values(SkillLevel).map(level => (
              <div key={level}>
                <input type="radio" id={level} name="skillLevel" value={level} checked={formData.skillLevel === level} onChange={handleRadioChange} className="sr-only peer" />
                <label htmlFor={level} className="w-full text-center block text-sm font-medium rounded-md py-2 px-3 transition-colors duration-200 cursor-pointer peer-checked:bg-brand-gold peer-checked:text-brand-dark text-brand-cream hover:bg-brand-brown/50">
                  {level}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Experience */}
        <div>
          <label htmlFor="experience" className="block text-sm font-medium text-brand-cream">Musical Experience (Optional)</label>
          <textarea id="experience" name="experience" rows={3} value={formData.experience} onChange={handleChange} className="mt-1 block w-full bg-brand-dark/70 border border-brand-brown rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-brand-gold focus:border-brand-gold" placeholder="Tell us about your musical journey..."></textarea>
        </div>

        {/* Error Message */}
        {error && <p className="text-red-400 text-sm text-center">{error}</p>}

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            disabled={status === FormStatus.LOADING}
            className="w-full flex justify-center items-center bg-brand-gold text-brand-dark font-bold py-3 px-4 rounded-lg hover:bg-yellow-400 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-brand-dark focus:ring-brand-gold disabled:bg-brand-brown disabled:cursor-not-allowed"
          >
            {status === FormStatus.LOADING ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </>
            ) : "Register Now"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default RegistrationForm;
