import { useEffect, useState } from 'react';
import { Product } from '../types';
import { PRODUCTS } from '../data/products';
import { fetchCatalogProducts } from '../services/airtable';

export interface UseProductsResult {
  products: Product[];
  isLoading: boolean;
  error: string | null;
}

export function useProducts(): UseProductsResult {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    fetchCatalogProducts()
      .then((items) => {
        if (cancelled) return;
        setProducts(items.length > 0 ? items : import.meta.env.DEV ? PRODUCTS : []);
        setError(null);
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        if (import.meta.env.DEV) setProducts(PRODUCTS);
        setError(err instanceof Error ? err.message : 'Failed to load catalog');
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return { products, isLoading, error };
}
