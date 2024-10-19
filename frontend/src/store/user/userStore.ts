import { create } from 'zustand';

interface User {
  name: string;
  email: string;
  joinDate: Date;
  totalWriteUps: number;
}

interface UserSlice {
  user: User;
  isLoggedIn: boolean;
  setUser: (user: User) => void;
  setIsLoggedIn: (isLoggedIn: boolean) => void;
}

export const useUserStore = create<UserSlice>((set) => ({
  user: {
    name: '',
    email: '',
    joinDate: new Date(),
    totalWriteUps: 0,
  },
  isLoggedIn: false,
  setUser: (user: User) => set({ user }),
  setIsLoggedIn: (isLoggedIn: boolean) => set({ isLoggedIn }),
}));
