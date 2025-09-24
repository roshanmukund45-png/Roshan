import React, { useState, useEffect } from 'react';
import { Member, JamEvent } from '../types';

// --- WebAuthn Helper Functions ---
// These helpers are for converting between ArrayBuffer and Base64
const bufferToBase64 = (buffer: ArrayBuffer): string => {
  return btoa(String.fromCharCode.apply(null, Array.from(new Uint8Array(buffer))));
};

const base64ToBuffer = (base64: string): ArrayBuffer => {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
};

// --- Interfaces ---
interface FingerprintModalProps {
  isOpen: boolean;
  mode: 'register' | 'checkin';
  member?: Member; // For registration
  event?: JamEvent; // For check-in
  allMembers: Member[]; // For check-in
  onClose: () => void;
  onUpdateMember: (updatedMember: Member) => void;
  onSuccess: (memberId: string) => void;
}

// --- Icons ---
const FingerprintIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 12h.01"/><path d="M10.29 7.23a2 2 0 1 1-1.35 3.21 2 2 0 0 1 1.35-3.21z"/><path d="M14 12a2 2 0 1 0-2-2 2 2 0 0 0 2 2z"/><path d="M18.66 18.66a2 2 0 1 0-2.83-2.83 2 2 0 0 0 2.83 2.83z"/><path d="M18 12a6 6 0 1 0-6 6"/><path d="M12 18a6 6 0 1 0-6-6"/><path d="M12 2a10 10 0 1 0 10 10"/><path d="M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8z"/></svg>
);
const CheckCircleIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
);
const AlertTriangleIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
);

// --- Component ---
const FingerprintModal: React.FC<FingerprintModalProps> = ({ isOpen, mode, member, event, allMembers, onClose, onUpdateMember, onSuccess }) => {
  const [status, setStatus] = useState<'idle' | 'pending' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const resetState = () => {
    setStatus('idle');
    setMessage('');
  };

  const handleClose = () => {
    resetState();
    onClose();
  };

  useEffect(() => {
    if (isOpen) {
      resetState();
      // Automatically trigger the process if in check-in mode
      if (mode === 'checkin') {
        handleCheckIn();
      }
    }
  }, [isOpen, mode]);

  const handleRegister = async () => {
    if (!member) return;
    setStatus('pending');
    setMessage('Follow the instructions from your browser or device...');

    try {
      const credential = await navigator.credentials.create({
        publicKey: {
          challenge: crypto.getRandomValues(new Uint8Array(32)),
          rp: { name: "Heramb Musical Group", id: window.location.hostname },
          user: {
            // FIX: The original code had a type error on `c.charCodeAt(0)`, indicating `c` was inferred as a number. Replaced with `TextEncoder().encode()` for a safer and more modern string-to-buffer conversion for the WebAuthn API.
            id: new TextEncoder().encode(member.id),
            name: member.email,
            displayName: member.fullName,
          },
          pubKeyCredParams: [{ type: "public-key", alg: -7 }], // ES256
          authenticatorSelection: {
            authenticatorAttachment: "platform",
            userVerification: "required",
          },
          timeout: 60000,
        },
      });

      if (credential) {
        const credentialId = bufferToBase64((credential as any).rawId);
        onUpdateMember({ ...member, webAuthnCredentialId: credentialId });
        setStatus('success');
        setMessage(`Success! Biometric check-in is now enabled for ${member.fullName}.`);
        setTimeout(handleClose, 3000);
      }
    } catch (err: any) {
      console.error("WebAuthn registration error:", err);
      setStatus('error');
      setMessage(err.message || 'Registration failed. Please try again.');
    }
  };

  const handleCheckIn = async () => {
    setStatus('pending');
    setMessage('Ready for check-in. Use your fingerprint or face recognition.');

    const allowCredentials = allMembers
        .filter(m => m.webAuthnCredentialId)
        .map(m => ({
            type: 'public-key' as PublicKeyCredentialType,
            id: base64ToBuffer(m.webAuthnCredentialId!),
        }));

    if (allowCredentials.length === 0) {
        setStatus('error');
        setMessage('No members have registered for biometric check-in yet.');
        return;
    }

    try {
        const assertion = await navigator.credentials.get({
            publicKey: {
                challenge: crypto.getRandomValues(new Uint8Array(32)),
                allowCredentials,
                userVerification: "required",
            },
        });

        if (assertion) {
            const credentialId = bufferToBase64((assertion as any).rawId);
            const foundMember = allMembers.find(m => m.webAuthnCredentialId === credentialId);
            if (foundMember) {
                setStatus('success');
                setMessage(`Welcome, ${foundMember.fullName}! You are checked in.`);
                onSuccess(foundMember.id);
                // Reset for the next person after a delay
                setTimeout(() => {
                    handleCheckIn();
                }, 3000);
            } else {
                setStatus('error');
                setMessage('Unrecognized member. Please register first.');
                 setTimeout(handleCheckIn, 3000);
            }
        }
    } catch (err: any) {
        console.error("WebAuthn assertion error:", err);
        setStatus('error');
        setMessage(err.message || 'Check-in failed. Please try again.');
        // Reset for the next person
        setTimeout(handleCheckIn, 3000);
    }
  };

  if (!isOpen) return null;
  
  const title = mode === 'register' ? 'Enable Biometric Check-in' : `Check-in for ${event?.title}`;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in" onClick={handleClose}>
        <div className="bg-brand-dark border border-brand-brown rounded-2xl shadow-2xl w-full max-w-sm p-6 sm:p-8 flex flex-col items-center text-center" onClick={e => e.stopPropagation()}>
            <h2 className="text-2xl font-serif font-bold text-white mb-4">{title}</h2>
            
            <div className="my-6">
                {status === 'idle' && <FingerprintIcon className="w-24 h-24 text-brand-cream/50" />}
                {status === 'pending' && <FingerprintIcon className="w-24 h-24 text-brand-gold animate-pulse" />}
                {status === 'success' && <CheckCircleIcon className="w-24 h-24 text-green-400" />}
                {status === 'error' && <AlertTriangleIcon className="w-24 h-24 text-red-400" />}
            </div>

            <p className="text-brand-cream text-lg min-h-[56px] flex items-center justify-center">{message || (mode === 'register' ? 'This will register your device\'s fingerprint or face recognition for secure attendance check-in.' : 'Waiting for check-in...')}</p>

            <div className="mt-8 w-full">
                {mode === 'register' && status !== 'pending' && status !== 'success' && (
                     <button onClick={handleRegister} className="w-full bg-brand-gold text-brand-dark font-bold py-3 px-4 rounded-lg hover:bg-yellow-400 transition-colors duration-300">
                        Register Now
                    </button>
                )}
                <button onClick={handleClose} className="mt-2 w-full bg-brand-brown/70 text-brand-cream font-bold py-2 px-4 rounded-lg hover:bg-brand-brown transition-colors duration-300">
                    {mode === 'register' ? 'Cancel' : 'Done'}
                </button>
            </div>
        </div>
    </div>
  );
};

export default FingerprintModal;