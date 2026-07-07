import { create } from "zustand";

export interface UserData {
  id?: string;
  name?: string;
  email?: string;
  phone?: string;
  role?: string;
  avatar?: string;
  [key: string]: unknown;
}

interface UserStoreState {
  user: UserData | null;
  setUser: (user: UserData) => void;
  clearUser: () => void;
}

export const useUserStore = create<UserStoreState>((set) => ({
  user: null,

  setUser: (user: UserData) => {
    set({ user });
  },

  clearUser: () => {
    set({ user: null });
  },
}));
