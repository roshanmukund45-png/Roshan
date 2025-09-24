
import React, { useState, useEffect } from 'react';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// --- SVG Icon Components ---
const CopyIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
);
const CheckIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
);
const WhatsAppIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91S17.5 2 12.04 2zM12.04 20.15c-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31c-.82-1.31-1.26-2.83-1.26-4.38 0-4.54 3.7-8.24 8.24-8.24 2.2 0 4.23.86 5.82 2.45s2.45 3.62 2.45 5.82c0 4.54-3.7 8.24-8.24 8.24zm4.52-6.14c-.25-.12-1.47-.72-1.7-.85-.23-.12-.39-.18-.56.18-.17.37-.64.85-.79 1.02-.15.18-.3.18-.56 0-.26-.12-1.1-.4-2.09-1.28-.77-.69-1.29-1.54-1.44-1.8-.15-.25 0-.39.12-.51.11-.11.25-.29.37-.43.12-.15.18-.25.28-.42.09-.17.04-.31-.02-.43s-.56-1.34-.76-1.84c-.2-.48-.4-.42-.56-.42-.15 0-.31-.02-.48-.02s-.45.06-.68.31c-.23.25-.87.85-.87 2.07s.9 2.4 1.02 2.57c.12.18 1.76 2.67 4.25 3.73.59.25 1.05.4 1.41.52.59.18 1.13.15 1.55.09.48-.06 1.47-.6 1.68-1.18.2-.58.2-1.08.15-1.18-.08-.12-.23-.18-.48-.31z"></path></svg>
);
const TelegramIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M9.78 18.65l.28-4.23 7.68-6.92c.34-.31-.07-.46-.52-.19L7.74 13.3 3.64 12c-.88-.25-.89-1.2.12-1.5l15.97-5.99c.78-.29 1.45.14 1.25.94l-2.54 12.08c-.24.93-1 .64-1.5.31l-4.1-3.25-2.02 1.93c-.23.23-.42.42-.83.42z"></path></svg>
);
const EmailIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
);
const ShareArrowIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
        <polyline points="16 6 12 2 8 6" />
        <line x1="12" y1="2" x2="12" y2="15" />
    </svg>
);


const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose }) => {
    const [copyButtonText, setCopyButtonText] = useState('Copy');
    const [isNativeShareSupported, setIsNativeShareSupported] = useState(false);

    const shareData = {
        title: 'Heramb Musical Group',
        text: "Come join our jam! Check out the Heramb Musical Group (Rhythm Ensemble) and sign up to play with us.",
        url: window.location.href,
    };
    
    useEffect(() => {
        if (isOpen) {
            setIsNativeShareSupported(!!navigator.share);
            // Reset button text when modal is closed/reopened
            setCopyButtonText('Copy');
        }
    }, [isOpen]);

    const handleCopy = () => {
        navigator.clipboard.writeText(window.location.href).then(() => {
            setCopyButtonText('Copied!');
            setTimeout(() => setCopyButtonText('Copy'), 2000);
        }).catch(err => {
            console.error('Failed to copy text: ', err);
            setCopyButtonText('Error');
            setTimeout(() => setCopyButtonText('Copy'), 2000);
        });
    };

    const handleNativeShare = async () => {
        try {
            await navigator.share(shareData);
        } catch (err) {
            console.error('Share failed:', err);
        }
    };

    if (!isOpen) return null;

    const shareUrl = window.location.href;
    const shareText = "Come join our jam! Check out the Heramb Musical Group (Rhythm Ensemble) and sign up to play with us.";
    const encodedShareText = encodeURIComponent(shareText);
    const encodedUrl = encodeURIComponent(shareUrl);

    const shareLinks = [
        { name: 'WhatsApp', Icon: WhatsAppIcon, href: `https://wa.me/?text=${encodedShareText}%20${encodedUrl}`, color: 'bg-green-500 hover:bg-green-600' },
        { name: 'Telegram', Icon: TelegramIcon, href: `https://t.me/share/url?url=${encodedUrl}&text=${encodedShareText}`, color: 'bg-sky-500 hover:bg-sky-600' },
        { name: 'Email', Icon: EmailIcon, href: `mailto:?subject=${encodeURIComponent('Join the Heramb Musical Group!')}&body=${encodedShareText}%0A%0A${encodedUrl}`, color: 'bg-gray-500 hover:bg-gray-600' }
    ];

    return (
        <div 
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in" 
            onClick={onClose}
        >
            <div 
                className="bg-brand-dark border border-brand-brown rounded-2xl shadow-2xl w-full max-w-sm p-6 sm:p-8 text-center" 
                onClick={e => e.stopPropagation()}
            >
                <h2 className="text-2xl font-serif font-bold text-white mb-2">Share The Jam</h2>
                <p className="text-brand-cream/70 mb-6">Invite others to join the rhythm!</p>

                {isNativeShareSupported && (
                    <button
                        onClick={handleNativeShare}
                        className="w-full flex items-center justify-center gap-3 bg-brand-gold text-brand-dark font-bold py-3 px-4 rounded-lg hover:bg-yellow-400 transition-colors duration-300 mb-6"
                    >
                        <ShareArrowIcon className="w-5 h-5" />
                        Share via...
                    </button>
                )}

                <div className="mb-6">
                    <label className="text-sm font-medium text-brand-cream/80 block mb-2 text-left">Group Website Link</label>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            readOnly
                            value={shareUrl}
                            className="w-full bg-brand-dark/70 border border-brand-brown rounded-md py-2 px-3 text-white text-sm truncate"
                        />
                        <button 
                            onClick={handleCopy}
                            className={`w-28 flex-shrink-0 flex items-center justify-center gap-2 text-brand-dark font-bold py-2 px-3 rounded-lg transition-colors duration-300 ${
                                copyButtonText === 'Copied!' ? 'bg-green-400' : 'bg-brand-gold hover:bg-yellow-400'
                            }`}
                        >
                            {copyButtonText === 'Copied!' ? <CheckIcon className="w-4 h-4" /> : <CopyIcon className="w-4 h-4" />}
                            {copyButtonText}
                        </button>
                    </div>
                </div>
                
                {!isNativeShareSupported && (
                    <>
                        <div className="flex items-center gap-4 my-6">
                            <div className="flex-grow h-px bg-brand-brown"></div>
                            <span className="text-brand-cream/60 text-sm">or share via</span>
                            <div className="flex-grow h-px bg-brand-brown"></div>
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                            {shareLinks.map(({ name, Icon, href, color }) => (
                                <a
                                    key={name}
                                    href={href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`flex flex-col items-center justify-center gap-2 p-4 rounded-lg text-white font-medium transition-colors duration-300 ${color}`}
                                >
                                    <Icon className="w-6 h-6" />
                                    <span>{name}</span>
                                </a>
                            ))}
                        </div>
                    </>
                )}


                <button 
                    onClick={onClose} 
                    className="mt-8 w-full bg-brand-brown/70 text-brand-cream font-bold py-2 px-4 rounded-lg hover:bg-brand-brown transition-colors duration-300"
                >
                    Close
                </button>
            </div>
        </div>
    );
};

export default ShareModal;
