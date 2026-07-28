import { create } from "zustand";

import type { User } from "../types/auth";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;

  login: (user: User) => void;
  logout: () => void;
  setUser: (user: User | null) => void;
}

const useAuthState = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,

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
}));

export default useAuthState;
