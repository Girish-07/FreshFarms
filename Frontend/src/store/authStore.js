import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      setSession: ({ user, token }) => set({ user, token }),
      signOut: () => set({ user: null, token: null }),
    }),
    { name: "freshfarm-auth" },
  ),
);
