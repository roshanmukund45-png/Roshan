import React, { useRef } from 'react';

const DrumIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <ellipse cx="12" cy="6" rx="9" ry="4"/>
    <path d="M3 6v12c0 2.21 4.03 4 9 4s9-1.79 9-4V6"/>
    <path d="m3.5 10.5 17 3"/>
    <path d="m3.5 13.5 17-3"/>
  </svg>
);

const ShareIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
    <polyline points="16 6 12 2 8 6" />
    <line x1="12" y1="2" x2="12" y2="15" />
  </svg>
);

const CameraIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle></svg>
);


interface HeaderProps {
  onShareClick: () => void;
  logo: string | null;
  onLogoChange: (logo: string) => void;
}

const Header: React.FC<HeaderProps> = ({ onShareClick, logo, onLogoChange }) => {
  const logoInputRef = useRef<HTMLInputElement>(null);

  const handleLogoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (loadEvent) => {
        if (typeof loadEvent.target?.result === 'string') {
          onLogoChange(loadEvent.target.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLogoClick = () => {
    logoInputRef.current?.click();
  };

  return (
    <header className="relative py-6 px-4 sm:px-8 text-center bg-black/20 backdrop-blur-sm">
      <div className="flex items-center justify-center gap-4">
        <div className="relative group">
            <button onClick={handleLogoClick} className="w-10 h-10 sm:w-12 sm:h-12 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-brand-dark focus:ring-brand-gold" aria-label="Change group logo">
                {logo ? (
                    <img src={logo} alt="Group Logo" className="w-full h-full object-cover rounded-full" />
                ) : (
                    <DrumIcon className="w-full h-full text-brand-gold" />
                )}
                <div className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <CameraIcon className="w-1/2 h-1/2" />
                </div>
            </button>
            <input
                type="file"
                ref={logoInputRef}
                onChange={handleLogoFileChange}
                accept="image/*"
                className="hidden"
            />
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-white tracking-wider">
          Heramb Musical Group
        </h1>
        <DrumIcon className="w-8 h-8 sm:w-10 sm:h-10 text-brand-gold" />
      </div>
      <p className="text-lg sm:text-xl text-brand-gold mt-2 font-sans">(Rhythm Ensemble)</p>
      <button 
        onClick={onShareClick}
        className="absolute top-1/2 -translate-y-1/2 right-4 sm:right-8 flex items-center gap-2 bg-brand-brown/70 text-brand-cream font-bold py-2 px-4 rounded-lg hover:bg-brand-brown transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-brand-dark focus:ring-brand-gold"
        aria-label="Share website"
      >
        <ShareIcon className="w-5 h-5" />
        <span className="hidden sm:inline">Share</span>
      </button>
    </header>
  );
};

export default Header;
