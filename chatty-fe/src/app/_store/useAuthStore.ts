import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type AuthState = {
  accessToken: string;
  refreshToken: string;
  isLogin: boolean;
};

type AuthActions = {
  setAuth: (accessToken: string, refreshToken: string) => void;
  deleteTokens: () => void;
};

const useAuthStore = create(
  persist<AuthState & AuthActions>(
    (set) => ({
      accessToken: '',
      refreshToken: '',
      isLogin: false,
      setAuth: (accessToken, refreshToken) =>
        set({ accessToken, refreshToken, isLogin: true }),
      deleteTokens: () =>
        set({ accessToken: '', refreshToken: '', isLogin: false }),
    }),
    { name: 'auth-store' },
  ),
);

// const useAuthStore = create<AuthState & AuthActions>((set) => ({
//   accessToken: '',
//   refreshToken: '',

//   setAuth: (accessToken, refreshToken) => set({ accessToken, refreshToken }),
//   deleteTokens: () => set({ accessToken: '', refreshToken: '' }),
// }));

export default useAuthStore;
