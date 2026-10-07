import React, { useState, useMemo } from 'react';
import { Header } from './components/Header';
import { CategoryTiles } from './components/CategoryTiles';
import { HomePage } from './components/HomePage';
import { FilterBar } from './components/FilterBar';
import { ProductCard } from './components/ProductCard';
import { Footer } from './components/Footer';
import { QuickViewModal } from './components/QuickViewModal';
import { SearchModal } from './components/SearchModal';
import { LoginModal } from './components/LoginModal';
import { CATEGORIES, PRODUCTS } from './data/products';
import { CATEGORY_ICONS } from './icons';
import { Product, FilterState, SortOption, CategoryId } from './types';

export default function App() {
  // Home view vs Catalog (category) view
  const [view, setView] = useState<'home' | 'catalog'>('home');

  // Category state (1. Pendant & Bead, 2. Ring, 3. Bracelet, 4. Necklace, 5. Earring)
  const [activeCategory, setActiveCategory] = useState<CategoryId>('pendant-bead');

  // Modals & Selected pieces
  const [selectedQuickView, setSelectedQuickView] = useState<Product | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  // Filters & Sorting (No prices, based on weight, size & metal)
  const [filters, setFilters] = useState<FilterState>({
    metal: 'all',
    size: 'all',
    gender: 'all',
    searchQuery: '',
  });

  const [sortBy, setSortBy] = useState<SortOption>('featured');

  // Active Category Info
  const currentCategoryInfo = useMemo(
    () => CATEGORIES.find((c) => c.id === activeCategory) || CATEGORIES[0],
    [activeCategory]
  );

  // Available unique sizes for the active category
  const availableCategorySizes = useMemo(() => {
    const list = PRODUCTS.filter((p) => p.category === activeCategory).flatMap(
      (p) => p.sizes
    );
    return Array.from(new Set(list));
  }, [activeCategory]);

  // Clear all filters
  const handleClearFilters = () => {
    setFilters({
      metal: 'all',
      size: 'all',
      gender: 'all',
      searchQuery: '',
    });
  };

  // Change category handler
  const handleCategoryChange = (category: CategoryId) => {
    setActiveCategory(category);
    setView('catalog');
    setFilters((prev) => ({
      ...prev,
      size: 'all',
    }));
  };

  // Back to homepage
  const handleHome = () => {
    setView('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Featured pieces for the homepage hero grid
  const featuredProducts = useMemo(
    () => [
      PRODUCTS.find((p) => p.id === 'ring-drop')!,
      PRODUCTS.find((p) => p.id === 'ring-traditions')!,
      PRODUCTS.find((p) => p.id === 'ring-light')!,
      PRODUCTS.find((p) => p.id === 'ring-big-heart')!,
      PRODUCTS.find((p) => p.id === 'ring-power')!,
      PRODUCTS.find((p) => p.id === 'ring-glow')!,
      PRODUCTS.find((p) => p.id === 'pendant-soleil')!,
      PRODUCTS.find((p) => p.id === 'necklace-sovereign')!,
      PRODUCTS.find((p) => p.id === 'earring-starlight')!,
    ],
    []
  );

  // Filtered & Sorted products for current category
  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((product) => {
      // Must match the selected category
      if (product.category !== activeCategory) return false;

      // Metal filter
      if (filters.metal !== 'all' && product.metal !== filters.metal) return false;

      // Size filter (checks whether the selected size is in the product's available sizes)
      if (filters.size !== 'all' && !product.sizes.includes(filters.size)) {
        return false;
      }

      // Gender filter
      if (filters.gender !== 'all' && product.gender !== filters.gender) return false;

      // Search Query
      if (filters.searchQuery.trim() !== '') {
        const q = filters.searchQuery.toLowerCase();
        const matches =
          product.name.toLowerCase().includes(q) ||
          product.subtitle.toLowerCase().includes(q) ||
          product.shortDesc.toLowerCase().includes(q) ||
          product.metal.toLowerCase().includes(q) ||
          product.gemstone.toLowerCase().includes(q);
        if (!matches) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'weight-asc') return a.weightNumeric - b.weightNumeric;
      if (sortBy === 'weight-desc') return b.weightNumeric - a.weightNumeric;
      if (sortBy === 'name-asc') return a.name.localeCompare(b.name);
      return 0; // featured default
    });
  }, [activeCategory, filters, sortBy]);

  // Check if any filter is active
  const isAnyFilterActive =
    filters.metal !== 'all' ||
    filters.size !== 'all' ||
    filters.gender !== 'all' ||
    filters.searchQuery !== '';

  const displayTotalCount = isAnyFilterActive
    ? filteredProducts.length
    : currentCategoryInfo.pieceCount;

  return (
    <div className="min-h-screen w-full bg-[#2A0A14] py-3 sm:py-6 md:py-10 px-2 sm:px-4 md:px-8 lg:px-12 flex flex-col items-center justify-start text-[#E8CFCF]">
      {/* 
        Main Rounded Container:
        - Deep burgundy/maroon (#45101F)
        - Rounded corners (~24px - 32px)
        - Subtle inner shadow and hairline border
      */}
      <main className="w-full max-w-[1360px] bg-[#45101F] rounded-[24px] md:rounded-[32px] border border-[#F2D6D6]/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.08),0_20px_50px_rgba(0,0,0,0.65)] overflow-hidden flex flex-col pb-12 transition-all">
        {/* HEADER (3-Column Layout with B2B Actions) */}
        <Header
          onOpenSearch={() => setIsSearchOpen(true)}
          onHome={handleHome}
          activeCategory={activeCategory}
          onSelectCategory={handleCategoryChange}
        />

        {/* LOGO STRIP: full-width band (category page only) */}
        {view === 'catalog' && (
          <div className="w-full px-6 md:px-12 lg:px-16 mt-2">
            <img
              src="/image/image-01.webp"
              alt="RM Banner"
              className="w-full h-[20px] object-cover rounded-[8px]"
            />
          </div>
        )}

        {/* CATEGORY TILES on category page (menu bar removed everywhere) */}
        {view === 'catalog' && (
          <div className="w-full px-6 md:px-12 lg:px-16 pt-8">
            <CategoryTiles
              categories={CATEGORIES}
              activeCategory={activeCategory}
              onSelectCategory={handleCategoryChange}
            />
          </div>
        )}

        {view === 'home' ? (
          /* ================= HOMEPAGE ================= */
          <HomePage
            categories={CATEGORIES}
            featured={featuredProducts}
            onSelectCategory={handleCategoryChange}
            onQuickView={(p) => setSelectedQuickView(p)}
          />
        ) : (
          <>
            {/* DYNAMIC PAGE TITLE */}
            <div className="w-full text-center mt-8 mb-6 md:mt-10 md:mb-8">
              <div className="flex items-center justify-center gap-3 md:gap-4">
                <span
                  aria-hidden="true"
                  className="inline-block h-[26px] sm:h-[32px] md:h-[40px] [&>svg]:h-full [&>svg]:fill-current text-[#F2D6D6]/80 select-none"
                  dangerouslySetInnerHTML={{ __html: CATEGORY_ICONS[activeCategory] }}
                />
                <h1 className="font-serif text-5xl sm:text-6xl md:text-[64px] font-thin text-[#F2D6D6] tracking-normal select-none">
                  {currentCategoryInfo.label}
                </h1>
              </div>
              <p className="text-[11px] uppercase tracking-[0.25em] text-[#E8CFCF]/60 mt-1">
                Exclusive Catalog · Pricing Based on Current Market Gold Rates
              </p>
            </div>

            {/* FILTER BAR (Category-specific Sizing & Metal without fixed prices) */}
            <FilterBar
              filters={filters}
              onFilterChange={setFilters}
              onClearFilters={handleClearFilters}
              sortBy={sortBy}
              onSortChange={setSortBy}
              totalCount={displayTotalCount}
              availableSizes={availableCategorySizes}
              sizeLabel={currentCategoryInfo.sizeLabel}
            />

            {/* PRODUCT GRID (Preview & Weight Display) */}
            <section
              className="w-full px-6 md:px-12 lg:px-16 mt-6 md:mt-8"
              aria-label={`${currentCategoryInfo.label} collection`}
            >
              {filteredProducts.length === 0 ? (
                <div className="py-24 text-center">
                  <p className="font-serif text-2xl text-[#F2D6D6] mb-2">
                    No {currentCategoryInfo.label.toLowerCase()} match your filters
                  </p>
                  <p className="text-xs text-[#E8CFCF]/70 mb-6">
                    Please reset your filter parameters to view the full atelier collection.
                  </p>
                  <button
                    onClick={handleClearFilters}
                    className="px-6 py-2 bg-[#7A4A55] hover:bg-[#8D5764] text-[#F2D6D6] text-xs uppercase tracking-widest rounded-[4px] transition-colors cursor-pointer"
                  >
                    Reset Filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-3 lg:grid-cols-6 gap-4 md:gap-5 lg:gap-6">
                  {filteredProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onQuickView={(p) => setSelectedQuickView(p)}
                    />
                  ))}
                </div>
              )}
            </section>
          </>
        )}

        {/* FOOTER */}
        <Footer />
      </main>

      {/* High-Resolution Preview & Specs Modal */}
      <QuickViewModal
        product={selectedQuickView}
        onClose={() => setSelectedQuickView(null)}
      />

      {/* Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        products={PRODUCTS}
        onSelectProduct={(p) => setSelectedQuickView(p)}
      />

      {/* B2B VIP Portal Login Modal */}
      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
      />
    </div>
  );
}
