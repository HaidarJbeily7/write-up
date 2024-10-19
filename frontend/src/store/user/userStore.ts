import { create } from 'zustand';

interface User {
  name: string;
  email: string;
  joinDate: Date;
  totalWriteUps: number;
}

interface UserSlice {
  user: User;
  setUser: (user: User) => void;
}

export const useUserStore = create<UserSlice>((set) => ({
  user: {
    name: '',
    email: '',
    joinDate: new Date(),
    totalWriteUps: 0,
  },
  setUser: (user: User) => set({ user }),
}));
