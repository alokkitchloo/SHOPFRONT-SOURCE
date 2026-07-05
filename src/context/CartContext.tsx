import { createContext, ReactNode, useContext, useEffect, useMemo, useReducer } from "react";
import { CartItem } from "../types";

const STORAGE_KEY = "shopfront:cart:v1";

interface CartState {
  items: CartItem[];
  isDrawerOpen: boolean;
}

type CartAction =
  | { type: "HYDRATE"; items: CartItem[] }
  | { type: "ADD_ITEM"; item: CartItem }
  | { type: "REMOVE_ITEM"; productId: number; color: string; size: string }
  | { type: "SET_QUANTITY"; productId: number; color: string; size: string; quantity: number }
  | { type: "OPEN_DRAWER" }
  | { type: "CLOSE_DRAWER" };

function lineKey(productId: number, color: string, size: string) {
  return `${productId}-${color}-${size}`;
}

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "HYDRATE":
      return { ...state, items: action.items };

    case "ADD_ITEM": {
      const existing = state.items.find(
        (i) => lineKey(i.productId, i.color, i.size) === lineKey(action.item.productId, action.item.color, action.item.size)
      );
      if (existing) {
        const nextQty = Math.min(existing.quantity + action.item.quantity, existing.maxStock);
        return {
          ...state,
          items: state.items.map((i) =>
            i === existing ? { ...i, quantity: nextQty } : i
          ),
          isDrawerOpen: true,
        };
      }
      return { ...state, items: [...state.items, action.item], isDrawerOpen: true };
    }

    case "REMOVE_ITEM":
      return {
        ...state,
        items: state.items.filter(
          (i) => lineKey(i.productId, i.color, i.size) !== lineKey(action.productId, action.color, action.size)
        ),
      };

    case "SET_QUANTITY":
      return {
        ...state,
        items: state.items.map((i) =>
          lineKey(i.productId, i.color, i.size) === lineKey(action.productId, action.color, action.size)
            ? { ...i, quantity: Math.max(1, Math.min(action.quantity, i.maxStock)) }
            : i
        ),
      };

    case "OPEN_DRAWER":
      return { ...state, isDrawerOpen: true };

    case "CLOSE_DRAWER":
      return { ...state, isDrawerOpen: false };

    default:
      return state;
  }
}

interface CartContextValue {
  items: CartItem[];
  isDrawerOpen: boolean;
  itemCount: number;
  subtotal: number;
  addItem: (item: CartItem) => void;
  removeItem: (productId: number, color: string, size: string) => void;
  setQuantity: (productId: number, color: string, size: string, quantity: number) => void;
  openDrawer: () => void;
  closeDrawer: () => void;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [], isDrawerOpen: false });

  // Hydrate from localStorage once on mount.
  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored) dispatch({ type: "HYDRATE", items: JSON.parse(stored) });
    } catch {
      // corrupt/blocked storage — start with an empty cart rather than crash
    }
  }, []);

  // Persist on every change.
  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state.items));
    } catch {
      // ignore quota/private-mode errors — cart still works for the session
    }
  }, [state.items]);

  const itemCount = useMemo(() => state.items.reduce((sum, i) => sum + i.quantity, 0), [state.items]);
  const subtotal = useMemo(
    () => state.items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0),
    [state.items]
  );

  const value: CartContextValue = {
    items: state.items,
    isDrawerOpen: state.isDrawerOpen,
    itemCount,
    subtotal,
    addItem: (item) => dispatch({ type: "ADD_ITEM", item }),
    removeItem: (productId, color, size) => dispatch({ type: "REMOVE_ITEM", productId, color, size }),
    setQuantity: (productId, color, size, quantity) =>
      dispatch({ type: "SET_QUANTITY", productId, color, size, quantity }),
    openDrawer: () => dispatch({ type: "OPEN_DRAWER" }),
    closeDrawer: () => dispatch({ type: "CLOSE_DRAWER" }),
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}
