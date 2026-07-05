import { useEffect, useState } from "react";
import { fetchProducts } from "../api/fakeStoreApi";
import { deriveProduct } from "../data/deriveProduct";
import { Product } from "../types";

interface UseProductsResult {
  products: Product[];
  status: "loading" | "success" | "error";
  error: string | null;
}

export function useProducts(): UseProductsResult {
  const [products, setProducts] = useState<Product[]>([]);
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setStatus("loading");
    fetchProducts()
      .then((raw) => {
        if (cancelled) return;
        setProducts(raw.map(deriveProduct));
        setStatus("success");
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : "Something went wrong loading products.");
        setStatus("error");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return { products, status, error };
}
