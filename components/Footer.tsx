
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="py-4 px-4 sm:px-8 text-center text-brand-cream/60 bg-black/20 mt-auto">
      <p>&copy; {new Date().getFullYear()} Heramb Musical Group. All Rights Reserved.</p>
    </footer>
  );
};

export default Footer;
