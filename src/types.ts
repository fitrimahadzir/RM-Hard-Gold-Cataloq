export type CategoryId = 'ring' | 'pendant' | 'bead' | 'bracelet' | 'necklace' | 'earring';

export interface CategoryInfo {
  id: CategoryId;
  label: string;
  singular: string;
  pieceCount: number;
  sizeLabel: string;
}

export interface Product {
  id: string;
  category: CategoryId;
  name: string; // e.g. "Drop"
  fullName: string; // e.g. "Ring «Drop»"
  subtitle: string; // e.g. "White gold diamonds."
  shortDesc: string; // Ringkasan ringkas produk
  description: string; // Deskripsi penuh
  metal: string;
  gemstone: string;
  gender: string;
  weight: string; // Estimated weight (e.g. "3.85 g")
  weightNumeric: number; // For weight sorting (e.g. 3.85)
  sizeLabel: string; // Size label per category
  sizes: string[]; // Size options per category
  image: string;
  karat: string;
  purity?: string; // Gold purity (Airtable "purity" column), e.g. "916 (22K)"
  featured?: boolean; // Highlight on the homepage (Airtable "featured" column)
  availability?: boolean; // Available for inquiry (Airtable "availability" column)
}

export type SortOption = 'weight-asc' | 'weight-desc' | 'name-asc' | 'featured';

export interface FilterState {
  metal: string; // 'all' | 'White gold' | 'Yellow gold' | 'Rose gold'
  size: string; // 'all' | size string
  gender: string; // 'all' | 'Women' | 'Unisex'
  searchQuery: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedSize: string;
}
