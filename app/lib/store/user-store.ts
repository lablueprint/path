import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type UserStore = {
  id: string | null;
  role: string | null;
  loading: boolean;
  setId: (id: string | null) => void;
  setRole: (role: string | null) => void;
  setLoading: (loading: boolean) => void;
  clearUserStore: () => void;
};

export const useUserStore = create<UserStore>()(
  persist(
    (set, get) => ({
      id: null,
      role: null,
      loading: true,
      setId: (id) => set({ id: id }),
      setRole: (role) => set({ role: role }),
      setLoading: (loading) => set({ loading: loading }),
      clearUserStore: () => set({ id: null, role: null, loading: true }),
    }),
    {
      name: 'user-store',
      partialize: (state) => ({
        role: state.role,
      }),
    },
  ),
);
