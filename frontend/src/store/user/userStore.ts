import { create } from 'zustand';

interface User {
  id: string;
  email: string;
  fullname: string;
  joinDate: Date;
  totalWriteUps: number;
  isActive: boolean;
}

interface UserSlice {
  user: User;
  isLoggedIn: boolean;
  setUser: (user: User, isActive: boolean) => void;
  setIsLoggedIn: (isLoggedIn: boolean) => void;
  login: (user: User) => void;
  logout: () => void;
  setIsActive: (isActive: boolean) => void;
}

const getInitialUser = (): User => {
  const storedUser = localStorage.getItem('user');
  if (storedUser) {
    const parsedUser = JSON.parse(storedUser);
    return {
      ...parsedUser,
      joinDate: new Date(parsedUser.joinDate),
    };
  }
  return {
    id: '',
    fullname: '',
    email: '',
    joinDate: new Date(),
    totalWriteUps: 0,
    isActive: false,
  };
};

export const useUserStore = create<UserSlice>((set) => ({
  user: getInitialUser(),
  isLoggedIn: localStorage.getItem('isLoggedIn') === 'true',
  setUser: (user: User, isActive: boolean) => {
    set({ user: { ...user, isActive } });
    localStorage.setItem('user', JSON.stringify({ ...user, isActive }));
  },
  setIsLoggedIn: (isLoggedIn: boolean) => {
    set({ isLoggedIn });
    localStorage.setItem('isLoggedIn', isLoggedIn ? 'true' : 'false');
  },
  login: (user: User) => {
    set({ user, isLoggedIn: true });
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('isLoggedIn', 'true');
  },
  logout: () => {
    set({
      user: {
        id: '',
        email: '',
        fullname: '',
        joinDate: new Date(),
        totalWriteUps: 0,
        isActive: false,
      },
      isLoggedIn: false,
    });
    localStorage.removeItem('user');
    localStorage.removeItem('isLoggedIn');
  },
  setIsActive: (isActive: boolean) => {
    set((state) => ({ user: { ...state.user, isActive } }));
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      localStorage.setItem('user', JSON.stringify({ ...user, isActive }));
    }
  },
}));
