import { useEffect, useState } from "react";
import { fetchProductById } from "../api/fakeStoreApi";
import { deriveProduct } from "../data/deriveProduct";
import { Product } from "../types";

interface UseProductResult {
  product: Product | null;
  status: "loading" | "success" | "error" | "not-found";
  error: string | null;
}

export function useProduct(id: string | undefined): UseProductResult {
  const [product, setProduct] = useState<Product | null>(null);
  const [status, setStatus] = useState<UseProductResult["status"]>("loading");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setStatus("not-found");
      return;
    }
    let cancelled = false;
    setStatus("loading");
    fetchProductById(id)
      .then((raw) => {
        if (cancelled) return;
        if (!raw || !raw.id) {
          setStatus("not-found");
          return;
        }
        setProduct(deriveProduct(raw));
        setStatus("success");
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : "Something went wrong loading this product.");
        setStatus("error");
      });
    return () => {
      cancelled = true;
    };
  }, [id]);

  return { product, status, error };
}
