import React, { useState } from 'react';
import { X, Search, ChevronDown, MessageCircle } from 'lucide-react';
import Hamburger from 'hamburger-react';
import { CategoryId } from '../types';
import { CATEGORIES } from '../data/products';
import { waLink } from '../config';

interface HeaderProps {
  onOpenSearch: () => void;
  onHome: () => void;
  activeCategory: CategoryId;
  onSelectCategory: (category: CategoryId) => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenSearch,
  onHome,
  activeCategory,
  onSelectCategory,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [catalogDropdownOpen, setCatalogDropdownOpen] = useState(false);

  return (
    <header className="relative w-full pt-8 pb-5 px-6 md:px-12 lg:px-16 text-[#E8CFCF]">
      {/* 3-Column Desktop Layout */}
      <div className="grid grid-cols-2 md:grid-cols-3 items-center w-full">
        {/* Left Zone: Hamburger + Links */}
        <div className="flex items-center gap-6">
          <span className="group lg:hidden">
            <Hamburger
              toggled={mobileMenuOpen}
              toggle={setMobileMenuOpen}
              size={17}
              color="#E8CFCF"
              aria-label="Toggle navigation menu"
            />
          </span>

          <nav className="hidden lg:flex items-center gap-6 text-[11px] tracking-[0.2em] font-medium uppercase text-[#E8CFCF]/90">
            <button
              onClick={onHome}
              className="hover:text-[#FFF5F5] transition-colors hover:underline underline-offset-4 decoration-[#F2D6D6]/40 cursor-pointer py-1"
            >
              Home
            </button>

            {/* Catalog with Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setCatalogDropdownOpen(true)}
              onMouseLeave={() => setCatalogDropdownOpen(false)}
            >
              <button
                onClick={() => setCatalogDropdownOpen(!catalogDropdownOpen)}
                className="hover:text-[#FFF5F5] transition-colors flex items-center gap-1 cursor-pointer py-1"
              >
                <span>Catalog</span>
                <ChevronDown className="w-2.5 h-2.5 opacity-70" />
              </button>

              {catalogDropdownOpen && (
                <div className="absolute top-full left-0 mt-1 w-48 bg-[#350A18] border border-[#F2D6D6]/30 rounded-xl shadow-2xl py-2 z-50 text-left backdrop-blur-md">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => {
                        onSelectCategory(cat.id);
                        setCatalogDropdownOpen(false);
                      }}
                      className={`w-full px-4 py-2 flex items-center justify-between text-xs tracking-wider uppercase transition-colors cursor-pointer ${
                        activeCategory === cat.id
                          ? 'text-[#F2D6D6] font-semibold bg-white/5'
                          : 'text-[#E8CFCF]/80 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      <span>{cat.label}</span>
                      <span className="text-[10px] opacity-60 tabular-nums">
                        {cat.pieceCount}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </nav>
        </div>

        {/* Center Zone: RM Logo */}
        <div className="text-center md:block flex justify-end">
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              onHome();
            }}
            className="inline-block select-none hover:opacity-80 transition-opacity"
            aria-label="RM Home"
          >
            <img
              src="/image/RM-Logo-White.png"
              alt="RM Logo"
              className="h-7 md:h-9 lg:h-10 w-auto object-contain"
            />
          </a>
        </div>

        {/* Right Zone: Search & Inquire (WhatsApp) */}
        <div className="hidden md:flex items-center justify-end gap-6 text-[11px] tracking-[0.2em] font-medium uppercase text-[#E8CFCF]/90">
          <button
            onClick={onOpenSearch}
            className="hover:text-[#FFF5F5] transition-colors cursor-pointer flex items-center gap-1.5 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#F2D6D6]"
            aria-label="Open search dialog"
          >
            <Search className="w-3.5 h-3.5 opacity-80" />
            <span>Search</span>
          </button>

          <a
            href={waLink('Hello RM Atelier, I would like to inquire about your jewelry collection.')}
            target="_blank"
            rel="noreferrer"
            className="hover:text-[#FFF5F5] transition-colors cursor-pointer flex items-center gap-1.5 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#F2D6D6] px-2.5 py-1 rounded-[4px] border border-[#F2D6D6]/30 hover:border-[#F2D6D6]/60 bg-white/5"
            aria-label="Book private viewing or inquiry"
          >
            <MessageCircle className="w-3.5 h-3.5 opacity-80 text-[#F2D6D6]" />
            <span className="text-[#F2D6D6]">Inquire</span>
          </a>
        </div>
      </div>

      {/* Mobile action bar */}
      <div className="flex md:hidden items-center justify-between mt-4 pt-3 border-t border-white/5 text-[11px] tracking-[0.18em] uppercase text-[#E8CFCF]">
        <button
          onClick={onOpenSearch}
          className="flex items-center gap-1 hover:text-white py-1"
        >
          <Search className="w-3.5 h-3.5" />
          <span>Search</span>
        </button>
        <a
          href={waLink('Hello RM Atelier, I would like to inquire about your jewelry collection.')}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-1 text-[#F2D6D6] py-1 font-semibold"
        >
          <MessageCircle className="w-3.5 h-3.5" />
          <span>Inquire</span>
        </a>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-[#2A0A14]/95 backdrop-blur-md flex flex-col p-8 md:hidden">
          <div className="flex items-center justify-between pb-6 border-b border-white/10">
            <img
              src="/image/RM-Logo-White.png"
              alt="RM Logo"
              className="h-6 w-auto object-contain"
            />
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 text-[#E8CFCF] hover:text-white"
              aria-label="Close menu"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <nav className="pt-6 flex flex-col gap-3 font-serif text-xl tracking-wide text-[#F2D6D6]">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onHome();
              }}
              className="text-left transition-colors hover:text-white"
            >
              Home
            </button>
          </nav>

          <div className="pt-6 border-t border-white/10">
            <p className="text-xs uppercase tracking-[0.25em] text-[#F2D6D6]/60 mb-3">
              Categories
            </p>
            <nav className="flex flex-col gap-3 font-serif text-xl tracking-wide text-[#F2D6D6]">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => {
                    onSelectCategory(cat.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`text-left transition-colors flex items-center justify-between ${
                    activeCategory === cat.id ? 'text-white font-medium underline' : 'opacity-80'
                  }`}
                >
                  <span>{cat.label}</span>
                  <span className="text-xs font-sans opacity-60">
                    {cat.pieceCount} pcs
                  </span>
                </button>
              ))}
            </nav>
          </div>

          <div className="mt-auto pt-6 border-t border-white/10 flex flex-col gap-2 text-xs tracking-widest uppercase text-[#E8CFCF]/70">
            <p>© 2026 Reservia Manufacture</p>
          </div>
        </div>
      )}
    </header>
  );
};
