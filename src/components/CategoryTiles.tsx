import React from 'react';
import { ArrowRight } from 'lucide-react';
import { CategoryId, CategoryInfo } from '../types';
import RingSvg from '../../public/image/Ring.svg?raw';
import PendantSvg from '../../public/image/Pendant.svg?raw';
import BraceletSvg from '../../public/image/Bracelet.svg?raw';
import NecklaceSvg from '../../public/image/Necklace.svg?raw';
import EarringSvg from '../../public/image/Earring.svg?raw';

const CATEGORY_ICONS: Record<CategoryId, string> = {
  ring: RingSvg,
  'pendant-bead': PendantSvg,
  bracelet: BraceletSvg,
  necklace: NecklaceSvg,
  earring: EarringSvg,
};

interface CategoryTilesProps {
  categories: CategoryInfo[];
  onSelectCategory: (category: CategoryId) => void;
  activeCategory?: CategoryId;
  className?: string;
}

export const CategoryTiles: React.FC<CategoryTilesProps> = ({
  categories,
  onSelectCategory,
  activeCategory,
  className = '',
}) => {
  return (
    <div
      className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4 lg:gap-5 ${className}`}
    >
      {categories.map((cat) => {
        const isActive = cat.id === activeCategory;
        return (
          <button
            key={cat.id}
            onClick={() => onSelectCategory(cat.id)}
            aria-current={isActive ? 'page' : undefined}
            className={`group relative text-left rounded-[12px] px-4 py-4 md:py-5 transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#F2D6D6] ${
              isActive
                ? 'bg-[#350A18] border border-[#F2D6D6]/45 shadow-[0_0_0_1px_rgba(242,214,214,0.15)]'
                : 'bg-[#350A18]/60 hover:bg-[#350A18] border border-[#F2D6D6]/10 hover:border-[#F2D6D6]/35'
            }`}
          >
            <span
              className={`block font-serif font-semibold text-lg md:text-xl leading-snug ${
                isActive ? 'text-[#FFF5F5]' : 'text-[#F2D6D6]'
              }`}
            >
              {cat.label}
            </span>
            <span className="block text-[11px] uppercase tracking-[0.18em] text-[#E8CFCF]/60 mt-1.5 tabular-nums">
              {cat.pieceCount} pcs
            </span>
            <ArrowRight
              className={`w-4 h-4 mt-3 md:mt-4 transition-all ${
                isActive
                  ? 'text-[#F2D6D6] translate-x-1'
                  : 'text-[#F2D6D6]/50 group-hover:text-[#F2D6D6] group-hover:translate-x-1'
              }`}
            />
            <span
              className={`absolute bottom-4 right-4 w-9 h-9 [&>svg]:w-full [&>svg]:h-full [&>svg]:fill-current transition-colors ${
                isActive ? 'text-[#F2D6D6]' : 'text-[#F2D6D6]/55 group-hover:text-[#F2D6D6]'
              }`}
              aria-hidden="true"
              dangerouslySetInnerHTML={{ __html: CATEGORY_ICONS[cat.id] }}
            />
          </button>
        );
      })}
    </div>
  );
};
