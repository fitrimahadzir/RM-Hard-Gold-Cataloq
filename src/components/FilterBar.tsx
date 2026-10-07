import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, X, Check } from 'lucide-react';
import { FilterState, SortOption } from '../types';

interface FilterBarProps {
  filters: FilterState;
  onFilterChange: (newFilters: FilterState) => void;
  onClearFilters: () => void;
  sortBy: SortOption;
  onSortChange: (newSort: SortOption) => void;
  totalCount: number;
  availableSizes?: string[];
  sizeLabel?: string;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  onFilterChange,
  onClearFilters,
  sortBy,
  onSortChange,
  totalCount,
  availableSizes = ['16 (16.5 mm)', '17 (17.3 mm)', '18 (18.1 mm)', '19 (18.9 mm)'],
  sizeLabel = 'Size',
}) => {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const hasActiveFilters =
    filters.metal !== 'all' ||
    filters.size !== 'all' ||
    filters.gender !== 'all';

  const sortLabels: Record<SortOption, string> = {
    'weight-asc': 'Weight: Low to High',
    'weight-desc': 'Weight: High to Low',
    'name-asc': 'Name A–Z',
    'featured': 'Featured',
  };

  return (
    <div
      ref={dropdownRef}
      className="w-full px-6 md:px-12 lg:px-16 py-4 flex flex-col md:flex-row items-center md:items-center justify-between gap-4 text-xs tracking-wider text-[#E8CFCF]"
    >
      {/* Left side: Filters + Pill Group + Clear All */}
      <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 md:gap-4 relative">
        <span className="text-[#F2D6D6] font-medium text-[13px]">Filters</span>

        {/* Pill-shaped bordered group (No prices, based on size, metal & gender) */}
        <div className="relative inline-flex items-center rounded-full border border-[#F2D6D6]/40 bg-[#45101F]/60 backdrop-blur-sm px-3 md:px-4 py-1.5 gap-2 md:gap-4 select-none">
          {/* Size Chip */}
          <div className="relative">
            <button
              onClick={() => setOpenDropdown(openDropdown === 'size' ? null : 'size')}
              className={`flex items-center gap-1 hover:text-[#FFF5F5] transition-colors cursor-pointer py-0.5 text-[12px] ${
                filters.size !== 'all' ? 'text-[#FFF5F5] font-semibold' : 'text-[#E8CFCF]'
              }`}
              aria-label={`Filter by ${sizeLabel}`}
              aria-expanded={openDropdown === 'size'}
            >
              <span>{filters.size !== 'all' ? filters.size : sizeLabel}</span>
              {filters.size !== 'all' ? (
                <span
                  onClick={(e) => {
                    e.stopPropagation();
                    onFilterChange({ ...filters, size: 'all' });
                  }}
                  className="p-0.5 rounded-full hover:bg-white/20 transition-colors"
                >
                  <X className="w-2.5 h-2.5" />
                </span>
              ) : (
                <ChevronDown className="w-3 h-3 opacity-70" />
              )}
            </button>

            {openDropdown === 'size' && (
              <div className="absolute top-full left-0 mt-2 w-52 bg-[#340A18] border border-[#F2D6D6]/30 rounded-xl shadow-2xl py-2 z-40 text-left backdrop-blur-md">
                <button
                  onClick={() => {
                    onFilterChange({ ...filters, size: 'all' });
                    setOpenDropdown(null);
                  }}
                  className="w-full px-3 py-1.5 flex items-center justify-between text-xs hover:bg-[#4D1525] hover:text-white transition-colors cursor-pointer"
                >
                  <span>All Sizes</span>
                  {filters.size === 'all' && <Check className="w-3 h-3 text-[#F2D6D6]" />}
                </button>
                {availableSizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => {
                      onFilterChange({ ...filters, size });
                      setOpenDropdown(null);
                    }}
                    className="w-full px-3 py-1.5 flex items-center justify-between text-xs hover:bg-[#4D1525] hover:text-white transition-colors cursor-pointer"
                  >
                    <span className="truncate">{size}</span>
                    {filters.size === size && <Check className="w-3 h-3 text-[#F2D6D6]" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Metal Chip */}
          <div className="relative">
            <button
              onClick={() => setOpenDropdown(openDropdown === 'metal' ? null : 'metal')}
              className={`flex items-center gap-1 hover:text-[#FFF5F5] transition-colors cursor-pointer py-0.5 text-[12px] ${
                filters.metal !== 'all' ? 'text-[#FFF5F5] font-semibold' : 'text-[#E8CFCF]'
              }`}
              aria-label="Filter by metal"
              aria-expanded={openDropdown === 'metal'}
            >
              <span>{filters.metal !== 'all' ? filters.metal : 'Metal'}</span>
              {filters.metal !== 'all' ? (
                <span
                  onClick={(e) => {
                    e.stopPropagation();
                    onFilterChange({ ...filters, metal: 'all' });
                  }}
                  className="p-0.5 rounded-full hover:bg-white/20 transition-colors"
                >
                  <X className="w-2.5 h-2.5" />
                </span>
              ) : (
                <ChevronDown className="w-3 h-3 opacity-70" />
              )}
            </button>

            {openDropdown === 'metal' && (
              <div className="absolute top-full left-0 mt-2 w-40 bg-[#340A18] border border-[#F2D6D6]/30 rounded-xl shadow-2xl py-2 z-40 text-left backdrop-blur-md">
                {[
                  { id: 'all', label: 'All Metals' },
                  { id: 'White gold', label: 'White gold' },
                  { id: 'Yellow gold', label: 'Yellow gold' },
                  { id: 'Rose gold', label: 'Rose gold' },
                ].map((metal) => (
                  <button
                    key={metal.id}
                    onClick={() => {
                      onFilterChange({ ...filters, metal: metal.id });
                      setOpenDropdown(null);
                    }}
                    className="w-full px-3 py-1.5 flex items-center justify-between text-xs hover:bg-[#4D1525] hover:text-white transition-colors cursor-pointer"
                  >
                    <span>{metal.label}</span>
                    {filters.metal === metal.id && <Check className="w-3 h-3 text-[#F2D6D6]" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Gender Chip */}
          <div className="relative">
            <button
              onClick={() => setOpenDropdown(openDropdown === 'gender' ? null : 'gender')}
              className={`flex items-center gap-1 hover:text-[#FFF5F5] transition-colors cursor-pointer py-0.5 text-[12px] ${
                filters.gender !== 'all' ? 'text-[#FFF5F5] font-semibold' : 'text-[#E8CFCF]'
              }`}
              aria-label="Filter by gender"
              aria-expanded={openDropdown === 'gender'}
            >
              <span>{filters.gender !== 'all' ? filters.gender : 'Gender'}</span>
              {filters.gender !== 'all' ? (
                <span
                  onClick={(e) => {
                    e.stopPropagation();
                    onFilterChange({ ...filters, gender: 'all' });
                  }}
                  className="p-0.5 rounded-full hover:bg-white/20 transition-colors"
                >
                  <X className="w-2.5 h-2.5" />
                </span>
              ) : (
                <ChevronDown className="w-3 h-3 opacity-70" />
              )}
            </button>

            {openDropdown === 'gender' && (
              <div className="absolute top-full right-0 md:left-0 mt-2 w-36 bg-[#340A18] border border-[#F2D6D6]/30 rounded-xl shadow-2xl py-2 z-40 text-left backdrop-blur-md">
                {[
                  { id: 'all', label: 'All' },
                  { id: 'Women', label: 'Women' },
                  { id: 'Unisex', label: 'Unisex' },
                ].map((gender) => (
                  <button
                    key={gender.id}
                    onClick={() => {
                      onFilterChange({ ...filters, gender: gender.id });
                      setOpenDropdown(null);
                    }}
                    className="w-full px-3 py-1.5 flex items-center justify-between text-xs hover:bg-[#4D1525] hover:text-white transition-colors cursor-pointer"
                  >
                    <span>{gender.label}</span>
                    {filters.gender === gender.id && <Check className="w-3 h-3 text-[#F2D6D6]" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Clear all filters */}
        {hasActiveFilters && (
          <button
            onClick={onClearFilters}
            className="text-[12px] text-[#E8CFCF]/70 hover:text-[#FFF5F5] underline underline-offset-4 decoration-[#F2D6D6]/30 transition-colors cursor-pointer"
          >
            Clear all filters
          </button>
        )}
      </div>

      {/* Right side: Sort by (Weight & Name) + Pieces Count */}
      <div className="flex items-center gap-3 relative self-center md:self-auto">
        <span className="text-[#E8CFCF]/80 text-[12px]">Sort by</span>

        <div className="relative">
          <button
            onClick={() => setOpenDropdown(openDropdown === 'sort' ? null : 'sort')}
            className="rounded-full border border-[#F2D6D6]/40 bg-[#45101F]/60 backdrop-blur-sm px-3.5 py-1.5 flex items-center gap-2 hover:border-[#F2D6D6]/70 transition-colors cursor-pointer text-[12px] text-[#FFF5F5]"
            aria-label="Sort products"
            aria-expanded={openDropdown === 'sort'}
          >
            <span>{sortLabels[sortBy]}</span>
            <ChevronDown className="w-3 h-3 opacity-70" />
          </button>

          {openDropdown === 'sort' && (
            <div className="absolute top-full right-0 mt-2 w-52 bg-[#340A18] border border-[#F2D6D6]/30 rounded-xl shadow-2xl py-2 z-40 text-left backdrop-blur-md">
              {(
                [
                  { id: 'weight-asc', label: 'Weight: Low to High' },
                  { id: 'weight-desc', label: 'Weight: High to Low' },
                  { id: 'name-asc', label: 'Name A–Z' },
                  { id: 'featured', label: 'Featured' },
                ] as const
              ).map((option) => (
                <button
                  key={option.id}
                  onClick={() => {
                    onSortChange(option.id);
                    setOpenDropdown(null);
                  }}
                  className="w-full px-3 py-1.5 flex items-center justify-between text-xs hover:bg-[#4D1525] hover:text-white transition-colors cursor-pointer"
                >
                  <span>{option.label}</span>
                  {sortBy === option.id && <Check className="w-3 h-3 text-[#F2D6D6]" />}
                </button>
              ))}
            </div>
          )}
        </div>

        <span className="text-[#E8CFCF]/80 text-[12px] tabular-nums pl-1">
          {totalCount} Pieces
        </span>
      </div>
    </div>
  );
};
