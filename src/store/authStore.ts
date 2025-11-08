import { create } from 'zustand';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'host';
  phone?: string;
}

interface AuthState {
  user: User | null;
  isMenuOpen: boolean;
  setUser: (user: User | null) => void;
  setMenuOpen: (isOpen: boolean) => void;
  toggleMenu: () => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isMenuOpen: false,
  setUser: (user) => set({ user }),
  setMenuOpen: (isOpen) => set({ isMenuOpen: isOpen }),
  toggleMenu: () => set((state) => ({ isMenuOpen: !state.isMenuOpen })),
  logout: () => {
    localStorage.removeItem('bearer_token');
    set({ user: null, isMenuOpen: false });
  },
}));
