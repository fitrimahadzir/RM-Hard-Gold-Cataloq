import React from 'react';
import { Plus } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full px-6 md:px-12 lg:px-16 mt-14 pt-8 border-t border-white/10 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
      <img
        src="/image/RM-Logo-White.png"
        alt="RM Logo"
        className="h-6 w-auto object-contain"
      />
      <div className="flex items-center gap-5">
        <a
          href="/add-product"
          className="flex items-center gap-1.5 text-[10px] lg:text-[11px] uppercase tracking-[0.18em] text-[#E8CFCF]/70 hover:text-[#F2D6D6] transition-colors cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          Add Product
        </a>
        <div className="text-[10px] lg:text-[11px] uppercase tracking-[0.18em] text-[#E8CFCF]/60 text-center lg:text-right">
          Copyright © 2026 | Reservia Manufacture
        </div>
      </div>
    </footer>
  );
};
