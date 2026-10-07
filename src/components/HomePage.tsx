import React from 'react';
import { ArrowRight, Gem, FileText, CalendarCheck, MessageCircle } from 'lucide-react';
import { CategoryId, CategoryInfo, Product } from '../types';
import { ProductCard } from './ProductCard';
import { CategoryTiles } from './CategoryTiles';
import { waLink } from '../config';

interface HomePageProps {
  categories: CategoryInfo[];
  featured: Product[];
  onSelectCategory: (category: CategoryId) => void;
  onQuickView: (product: Product) => void;
}

const SERVICES = [
  {
    icon: Gem,
    title: 'Fine Craftsmanship',
    desc: 'Handcrafted jewelry made from premium 916 (22K) and 18K gold.',
  },
  {
    icon: FileText,
    title: 'Custom Design',
    desc: 'Personalized and bespoke pieces tailored to your own preferences.',
  },
  {
    icon: CalendarCheck,
    title: 'Care & Aftercare',
    desc: 'Assistance with resizing, cleaning and maintenance of your jewelry.',
  },
];

export const HomePage: React.FC<HomePageProps> = ({
  categories,
  featured,
  onSelectCategory,
  onQuickView,
}) => {
  const totalPieces = categories.reduce((sum, c) => sum + c.pieceCount, 0);

  return (
    <div className="w-full px-6 md:px-12 lg:px-16 pt-6">
      {/* HERO */}
      <section className="relative w-full overflow-hidden rounded-[16px] md:rounded-[24px] border border-[#F2D6D6]/15">
        <img
          src="/image/image-02.jpg"
          alt="RM Haute Joaillerie"
          className="w-full h-[280px] md:h-[360px] object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#2A0A14]/95 via-[#2A0A14]/70 to-transparent" />
        <div className="absolute inset-0 flex flex-col justify-center gap-2.5 sm:gap-4 px-6 md:px-12 max-w-2xl">
          <span className="text-[8px] sm:text-[10px] md:text-[11px] uppercase tracking-[0.3em] text-[#F2D6D6]/80">
            Exclusive 916 &amp; 22K Gold Catalog
          </span>
          <h1 className="font-serif text-[24px] sm:text-3xl md:text-5xl lg:text-[56px] leading-tight font-thin text-[#F2D6D6]">
            Welcome to Our
            <br />
            Exclusive Cataloq
          </h1>
          <p className="text-[9px] sm:text-[11px] md:text-sm text-[#E8CFCF]/80 leading-relaxed max-w-md">
            {totalPieces} pieces across 5 categories — rings, pendants, bracelets, necklaces and
            earrings. Full specifications, weights and sizes with no fixed pricing.
          </p>
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 pt-1">
            <button
              onClick={() => onSelectCategory(categories[0].id)}
              className="group flex items-center gap-2 bg-[#F2D6D6] hover:bg-white text-[#2A0A14] text-[10px] sm:text-[11px] uppercase tracking-[0.2em] font-semibold px-3.5 py-2 sm:px-5 sm:py-2.5 rounded-[6px] transition-colors cursor-pointer"
            >
              Explore Catalog
              <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 transition-transform group-hover:translate-x-1" />
            </button>
            <a
              href={waLink('Hello RM Atelier, I would like to inquire about your jewelry collection.')}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 border border-[#F2D6D6]/40 hover:border-[#F2D6D6]/80 text-[#F2D6D6] text-[10px] sm:text-[11px] uppercase tracking-[0.2em] px-3.5 py-2 sm:px-5 sm:py-2.5 rounded-[6px] transition-colors cursor-pointer"
            >
              <MessageCircle className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              Inquire
            </a>
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="pt-12 md:pt-16" aria-label="Collection categories">
        <div className="flex items-end justify-between gap-4 pb-5 border-b border-white/10">
          <h2 className="font-serif text-2xl md:text-3xl font-light text-[#F2D6D6]">
            Category
          </h2>
          <span className="text-[10px] uppercase tracking-[0.25em] text-[#E8CFCF]/50 hidden sm:block">
            {totalPieces} pieces in total
          </span>
        </div>

        <CategoryTiles categories={categories} onSelectCategory={onSelectCategory} className="pt-6" />
      </section>

      {/* FEATURED PIECES */}
      <section className="pt-12 md:pt-16" aria-label="Selected pieces">
        <div className="flex items-end justify-between gap-4 pb-6 border-b border-white/10">
          <h2 className="font-serif text-2xl md:text-3xl font-light text-[#F2D6D6]">
            Selected pieces
          </h2>
          <button
            onClick={() => onSelectCategory(categories[0].id)}
            className="group flex items-center gap-1.5 text-[11px] uppercase tracking-[0.2em] text-[#E8CFCF]/70 hover:text-[#F2D6D6] transition-colors cursor-pointer"
          >
            View all
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
          </button>
        </div>

        <div className="grid grid-cols-3 lg:grid-cols-6 gap-4 md:gap-5 lg:gap-6 pt-8">
          {featured.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onQuickView={onQuickView}
            />
          ))}
        </div>
      </section>

      {/* SERVICES */}
      <section className="pt-12 md:pt-16" aria-label="Services">
        <div className="pb-6 border-b border-white/10">
          <h2 className="font-serif text-2xl md:text-3xl font-light text-[#F2D6D6]">
            Our Services
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5 pt-6">
          {SERVICES.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="bg-[#350A18]/60 border border-[#F2D6D6]/10 rounded-[12px] p-5 md:p-6"
            >
              <Icon className="w-5 h-5 text-[#F2D6D6]" />
              <h3 className="font-serif text-lg text-[#F2D6D6] mt-4">{title}</h3>
              <p className="text-xs leading-relaxed text-[#E8CFCF]/70 mt-2">{desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-[#350816] border border-[#F2D6D6]/15 rounded-[12px] px-6 py-5">
          <div>
            <p className="font-serif text-lg md:text-xl text-[#F2D6D6]">
              Have a question?
            </p>
            <p className="text-xs text-[#E8CFCF]/70 mt-1">
              Contact our team and we will assist you within 24 hours.
            </p>
          </div>
          <a
            href={waLink('Hello RM Atelier, I would like to inquire about your jewelry collection.')}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 bg-[#F2D6D6] hover:bg-white text-[#2A0A14] text-[11px] uppercase tracking-[0.2em] font-semibold px-5 py-2.5 rounded-[6px] transition-colors cursor-pointer shrink-0"
          >
            Contact Us
            <MessageCircle className="w-3.5 h-3.5" />
          </a>
        </div>
      </section>

    </div>
  );
};
