import { create } from 'zustand';

type BgmState = {
  bgm: string;
  isPlaying: boolean;
};

type BgmAction = {
  setIsPlaying: (isPlaying: boolean) => void;
  setBgm: (bgm: string) => void;
};

const useBgmStore = create<BgmState & BgmAction>((set) => ({
  bgm: '/bgm/main.mp3',
  isPlaying: false,
  setIsPlaying: (isPlaying) => set({ isPlaying }),
  setBgm: (bgm) => set({ bgm }),
}));

export default useBgmStore;
