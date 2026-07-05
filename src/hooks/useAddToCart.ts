import { useState } from "react";
import { useCart } from "../context/CartContext";
import { CartItem } from "../types";

// Bonus requirement: wire Add to Cart to a mock async function with a loading
// state and a simulated random failure, rather than adding to the cart
// synchronously. Mimics a real "reserve stock" network call.
function mockAddToCartRequest(item: CartItem): Promise<void> {
  return new Promise((resolve, reject) => {
    const delay = 400 + Math.random() * 400;
    setTimeout(() => {
      if (Math.random() < 0.12) {
        reject(new Error("Couldn't reserve this item — please try again."));
      } else {
        resolve();
      }
    }, delay);
  });
}

export function useAddToCart() {
  const { addItem } = useCart();
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function addToCart(item: CartItem) {
    setStatus("loading");
    setErrorMessage(null);
    try {
      await mockAddToCartRequest(item);
      addItem(item);
      setStatus("idle");
    } catch (err) {
      setStatus("error");
      setErrorMessage(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  return { addToCart, status, errorMessage };
}
