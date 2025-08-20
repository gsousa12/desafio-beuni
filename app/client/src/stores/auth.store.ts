import { JwtPayloadType } from "@packages/types";
import { create } from "zustand";

export type AuthStateType = {
  isAuthenticated: boolean;
  user: JwtPayloadType | null;
  setAuthenticated: (value: boolean) => void;
  setUser: (user: JwtPayloadType | null) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthStateType>((set) => ({
  isAuthenticated: false,
  user: null,
  setAuthenticated: (value) => set({ isAuthenticated: value }),
  setUser: (user) => set({ user }),
  logout: () => set({ user: null, isAuthenticated: false }),
}));
