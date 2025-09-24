
import React from 'react';
import { Instrument } from '../types';

// --- SVG Icon Components ---
export const RotoIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><ellipse cx="12" cy="8" rx="8" ry="3"></ellipse><path d="M4 8v10a8 5 0 0 0 16 0V8"></path></svg>
);
export const DrumIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z"/><path d="m18.5 14.5-2-2.5-2.5-2"/><path d="M12 2v3"/><path d="m4.93 4.93 2.12 2.12"/><path d="M2 12h3"/><path d="m4.93 19.07 2.12-2.12"/><path d="M12 12a10 10 0 0 0-10 10h20a10 10 0 0 0-10-10Z"/></svg>
);
export const ThapDholIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><ellipse cx="12" cy="6" rx="9" ry="4"/><path d="M3 6v12c0 2.21 4.03 4 9 4s9-1.79 9-4V6"/><ellipse cx="12" cy="18" rx="9" ry="4"/></svg>
);
export const BaseIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="4"></circle></svg>
);
export const TashaIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12c0 5.523 4.477 10 10 10s10-4.477 10-10"/><path d="M2 12h20"/><ellipse cx="12" cy="12" rx="10" ry="5"/></svg>
);
export const OtherIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
);

export const instrumentIcons: Record<Instrument, React.FC<{ className?: string }>> = {
  [Instrument.ROTO]: RotoIcon,
  [Instrument.DRUM]: DrumIcon,
  [Instrument.THAP_DHOL]: ThapDholIcon,
  [Instrument.BASE]: BaseIcon,
  [Instrument.TASHA]: TashaIcon,
  [Instrument.OTHER]: OtherIcon,
};