export type UserStatus = {
  userId: number;
  isReady: boolean;
  message?: string;
  nickname: string;
  profileImage: string | null;
};

export type ChatMessage = {
  roomId: number;
  userId: number;
  message: string;
};
