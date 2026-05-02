import { create } from "zustand";
import { persist } from "zustand/middleware";

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,

      register: (email, password, name) => {
        const newUser = { id: Date.now(), email, name };
        set({ user: newUser, isAuthenticated: true });
        return newUser;
      },

      login: (email, password) => {
        if (email && password && password.length >= 6) {
          const user = { id: Date.now(), email, name: email.split("@")[0] };
          set({ user, isAuthenticated: true });
          return true;
        }
        return false;
      },

      logout: () => set({ user: null, isAuthenticated: false }),
    }),
    { name: "auth-storage" }, // ← sin "storage:" custom, Zustand usa localStorage automáticamente
  ),
);

export default useAuthStore;
