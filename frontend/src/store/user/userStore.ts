import { create } from 'zustand';

interface User {
  id: string;
  email: string;
  fullname: string;
  joinDate: Date;
  totalWriteUps: number;
  isActive: boolean;
  role: string;
}

interface UserSlice {
  user: User;
  isLoggedIn: boolean;
  setUser: (user: User, isActive: boolean, role: string) => void;
  setIsLoggedIn: (isLoggedIn: boolean) => void;
  login: (user: User) => void;
  logout: () => void;
  setIsActive: (isActive: boolean) => void;
  setRole: (role: string) => void;
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
    role: '',
  };
};

export const useUserStore = create<UserSlice>((set) => ({
  user: getInitialUser(),
  isLoggedIn: localStorage.getItem('isLoggedIn') === 'true',
  setUser: (user: User, isActive: boolean, role: string) => {
    set({ user: { ...user, isActive, role } });
    localStorage.setItem('user', JSON.stringify({ ...user, isActive, role }));
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
        role: '',
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
  setRole: (role: string) => {
    set((state) => ({ user: { ...state.user, role } }));
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      localStorage.setItem('user', JSON.stringify({ ...user, role }));
    }
  },
}));
