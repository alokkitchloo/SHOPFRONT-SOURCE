import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { ProductCard } from "../src/components/ProductCard";
import { CartProvider } from "../src/context/CartContext";
import { Product } from "../src/types";

function makeProduct(overrides: Partial<Product> = {}): Product {
  return {
    id: 1,
    title: "Test Jacket",
    brand: "Northfield & Co.",
    price: 49.99,
    originalPrice: null,
    description: "A jacket.",
    category: "clothing",
    images: ["/jacket.png"],
    rating: { rate: 4.2, count: 10 },
    colors: ["Black"],
    sizes: ["M"],
    variants: [{ color: "Black", size: "M", stock: 5, stockLevel: "in-stock" }],
    ...overrides,
  };
}

function renderCard(product: Product) {
  return render(
    <MemoryRouter>
      <CartProvider>
        <ProductCard product={product} />
      </CartProvider>
    </MemoryRouter>
  );
}

describe("ProductCard quick add", () => {
  it("shows an enabled quick-add button when a variant is in stock", () => {
    renderCard(makeProduct());
    expect(screen.getByRole("button", { name: /quick add/i })).toBeEnabled();
  });

  it("disables the quick-add CTA when every variant is sold out", () => {
    const soldOutProduct = makeProduct({
      variants: [{ color: "Black", size: "M", stock: 0, stockLevel: "sold-out" }],
    });
    renderCard(soldOutProduct);
    const button = screen.getByRole("button", { name: /sold out/i });
    expect(button).toBeDisabled();
  });
});
