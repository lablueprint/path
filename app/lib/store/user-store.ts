import { create } from 'zustand';

type UserStore = {
  id: string | null;
  role: string | null;
  isLoading: boolean;
  setId: (id: string | null) => void;
  setRole: (role: string | null) => void;
  setIsLoading: (isLoading: boolean) => void;
  clearUserStore: () => void;
};

export const useUserStore = create<UserStore>()((set) => ({
  id: null,
  role: null,
  isLoading: true,
  setId: (id) => set({ id: id }),
  setRole: (role) => set({ role: role }),
  setIsLoading: (isLoading) => set({ isLoading: isLoading }),
  clearUserStore: () => set({ id: null, role: null, isLoading: true }),
}));
