import { create } from "zustand";

import type { User } from "../types/auth.types";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isSessionRestored: boolean;

  login: (user: User) => void;
  logout: () => void;
  setUser: (user: User | null) => void;
  setSessionRestored: () => void;
}

const useAuthState = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isSessionRestored: false,

  login: (user) => set({
    user: user,
    isAuthenticated: true
  }),
  logout: () => set({
    user: null,
    isAuthenticated: false
  }),
  setUser: (user) => set({
    user,
    isAuthenticated: !!user
  }),
  setSessionRestored: () => set({ isSessionRestored: true }),
}));

export default useAuthState;
