import { FakeStoreProduct, Product, StockLevel, Variant } from "../types";
import { seededInt, seededPick } from "../utils/random";
import { ALL_COLORS, ALL_SIZES, BRANDS } from "./constants";

const LOW_STOCK_THRESHOLD = 3;

function stockLevelFor(stock: number): StockLevel {
  if (stock <= 0) return "sold-out";
  if (stock <= LOW_STOCK_THRESHOLD) return "low-stock";
  return "in-stock";
}

export function deriveProduct(raw: FakeStoreProduct): Product {
  const key = `${raw.id}-${raw.title}`;

  const brand = seededPick(`${key}-brand`, BRANDS);

  // ~35% of products are "on sale" — original price is 15-40% higher than
  // the API's price, which becomes the current/sale price.
  const isOnSale = seededInt(`${key}-sale`, 0, 99) < 35;
  const markup = seededInt(`${key}-markup`, 15, 40) / 100;
  const originalPrice = isOnSale ? Math.round(raw.price * (1 + markup) * 100) / 100 : null;

  // 3-4 colors and 3-5 sizes per product, picked deterministically.
  const colorCount = seededInt(`${key}-colorcount`, 3, 4);
  const colors = Array.from(new Set(
    Array.from({ length: colorCount }, (_, i) => seededPick(`${key}-color-${i}`, ALL_COLORS))
  ));
  const sizeCount = seededInt(`${key}-sizecount`, 3, 5);
  const sizes = Array.from(new Set(
    Array.from({ length: sizeCount }, (_, i) => seededPick(`${key}-size-${i}`, ALL_SIZES))
  ));

  const variants: Variant[] = [];
  for (const color of colors) {
    for (const size of sizes) {
      // Weighted so most variants are in stock, some low, a few sold out —
      // gives every product page a realistic mix of states to demo.
      const roll = seededInt(`${key}-${color}-${size}-stock`, 0, 99);
      let stock: number;
      if (roll < 10) stock = 0;
      else if (roll < 25) stock = seededInt(`${key}-${color}-${size}-lowqty`, 1, LOW_STOCK_THRESHOLD);
      else stock = seededInt(`${key}-${color}-${size}-qty`, LOW_STOCK_THRESHOLD + 1, 25);

      variants.push({ color, size, stock, stockLevel: stockLevelFor(stock) });
    }
  }

  return {
    id: raw.id,
    title: raw.title,
    brand,
    price: raw.price,
    originalPrice,
    description: raw.description,
    category: raw.category,
    images: [raw.image, raw.image, raw.image], // API provides one image; see DECISIONS.md
    rating: raw.rating,
    colors,
    sizes,
    variants,
  };
}

export function findVariant(product: Product, color: string, size: string): Variant | undefined {
  return product.variants.find((v) => v.color === color && v.size === size);
}
