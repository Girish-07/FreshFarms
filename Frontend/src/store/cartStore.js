import { create } from "zustand";
import { persist } from "zustand/middleware";
import { getPrice, getProductId } from "../utils/market";

export const useCartStore = create(
  persist(
    (set) => ({
      items: [],
      addItem: (product) =>
        set((state) => {
          const id = getProductId(product);
          const existing = state.items.find((item) => item.id === id);
          if (existing) {
            return {
              items: state.items.map((item) =>
                item.id === id
                  ? { ...item, quantity: item.quantity + 1 }
                  : item,
              ),
            };
          }
          return {
            items: [
              ...state.items,
              {
                ...product,
                id,
                unitPrice: getPrice(product.price),
                quantity: 1,
              },
            ],
          };
        }),
      updateQuantity: (id, quantity) =>
        set((state) => ({
          items:
            quantity > 0
              ? state.items.map((item) =>
                  item.id === id ? { ...item, quantity } : item,
                )
              : state.items.filter((item) => item.id !== id),
        })),
      removeItem: (id) =>
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        })),
      clearCart: () => set({ items: [] }),
    }),
    {
      name: "freshfarm-cart",
      version: 2,
      migrate: (persistedState) => ({
        ...persistedState,
        items: (persistedState.items || []).map((item) => ({
          ...item,
          unitPrice: getPrice(item.price),
        })),
      }),
      partialize: (state) => ({ items: state.items }),
    },
  ),
);

export const useCartSummary = () => {
  const items = useCartStore((state) => state.items);
  const subtotal = items.reduce(
    (total, item) => total + item.unitPrice * item.quantity,
    0,
  );
  const delivery = subtotal > 0 && subtotal < 500 ? 40 : 0;
  return {
    itemCount: items.reduce((count, item) => count + item.quantity, 0),
    subtotal,
    delivery,
    total: subtotal + delivery,
  };
};
