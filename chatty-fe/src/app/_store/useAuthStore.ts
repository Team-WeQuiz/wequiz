import { create } from 'zustand';

const useAuthStore = create((set) => ({
  accessToken: null,
  refreshToken: null,
  setTokens: (accessToken: string, refreshToken: string) =>
    set({ accessToken, refreshToken }),
  clearToken: () => set({ accessToken: null, refreshToken: null }),
}));

export default useAuthStore;
