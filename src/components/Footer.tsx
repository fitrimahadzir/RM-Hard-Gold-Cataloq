import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full px-6 md:px-12 lg:px-16 mt-14 pt-8 border-t border-white/10 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
      <img
        src="/image/RM-Logo-White.png"
        alt="RM Logo"
        className="h-6 w-auto object-contain"
      />
      <div className="text-[10px] lg:text-[11px] uppercase tracking-[0.18em] text-[#E8CFCF]/60 text-center lg:text-right">
        Copyright © 2026 | Reservia Manufacture
      </div>
    </footer>
  );
};
