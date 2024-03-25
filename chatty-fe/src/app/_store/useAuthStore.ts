import { create } from 'zustand';

type AuthState = {
  accessToken: string;
};

type AuthActions = {
  setAuth: (accessToken: string) => void;
  deleteTokens: () => void;
};

const useAuthStore = create<AuthState & AuthActions>((set) => ({
  accessToken: '',
  setAuth: (accessToken) => set({ accessToken }),
  deleteTokens: () => set({ accessToken: '' }),
}));

export default useAuthStore;
