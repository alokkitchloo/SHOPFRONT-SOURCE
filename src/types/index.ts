// Raw shape returned by the Fake Store API.
export interface FakeStoreProduct {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: { rate: number; count: number };
}

export type StockLevel = "in-stock" | "low-stock" | "sold-out";

export interface Variant {
  color: string;
  size: string;
  stock: number;
  stockLevel: StockLevel;
}

// The Fake Store API has no brand, variants, or sale price — this app derives
// all of that deterministically from the product id (see src/data/deriveProduct.ts)
// so the same product always looks the same across reloads, but the catalog
// still exercises every UI state the spec asks for.
export interface Product {
  id: number;
  title: string;
  brand: string;
  price: number;
  originalPrice: number | null; // set when the item is "on sale"
  description: string;
  category: string;
  images: string[]; // main image + thumbnails (Fake Store only gives one image,
  // so thumbnails reuse it — see DECISIONS.md)
  rating: { rate: number; count: number };
  colors: string[];
  sizes: string[];
  variants: Variant[];
}

export interface CartItem {
  productId: number;
  title: string;
  image: string;
  color: string;
  size: string;
  unitPrice: number;
  quantity: number;
  maxStock: number;
}
