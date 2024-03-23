import { create } from 'zustand';

type AuthState = {
  accessToken: string;
  refreshToken: string;
};

type AuthActions = {
  setTokens: (accessToken: string, refreshToken: string) => void;
  deleteTokens: () => void;
};

const defaultTokens = { accessToken: '', refreshToken: '' };

const useAuthStore = create<AuthState & AuthActions>((set) => ({
  ...defaultTokens,
  setTokens: (accessToken: string, refreshToken: string) =>
    set({ accessToken, refreshToken }),
  deleteTokens: () => set({ ...defaultTokens }),
}));

export default useAuthStore;
