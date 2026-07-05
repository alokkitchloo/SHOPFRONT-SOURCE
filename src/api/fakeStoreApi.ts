import { FakeStoreProduct } from "../types";

const BASE_URL = "https://fakestoreapi.com";

export class ApiError extends Error {
  constructor(message: string, public status?: number) {
    super(message);
    this.name = "ApiError";
  }
}

export async function fetchProducts(): Promise<FakeStoreProduct[]> {
  const res = await fetch(`${BASE_URL}/products`);
  if (!res.ok) {
    throw new ApiError(`Failed to load products (${res.status})`, res.status);
  }
  return res.json();
}

export async function fetchProductById(id: string | number): Promise<FakeStoreProduct> {
  const res = await fetch(`${BASE_URL}/products/${id}`);
  if (!res.ok) {
    throw new ApiError(`Failed to load product ${id} (${res.status})`, res.status);
  }
  return res.json();
}
