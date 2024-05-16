import { create } from 'zustand';

type BgmState = {
  bgm: string;
  isPlaying: boolean;
};

type BgmAction = {
  setIsPlaying: () => void;
};

const useBgmStore = create<BgmState & BgmAction>((set) => ({
  bgm: '/bgm/main.mp3',
  isPlaying: true,
  setIsPlaying: () => set((state) => ({ isPlaying: !state.isPlaying })),
}));

export default useBgmStore;
