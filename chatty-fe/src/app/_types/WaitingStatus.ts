export type UserStatus = {
  userId: number;
  isReady: boolean;
  message?: string;
  nickname: string;
  profileImage: string | null;
};

enum ChatType {
  TEXT = 'TEXT',
  Emoji = 'Emoji',
}

export type ChatMessage = {
  chatType: ChatType;
  roomId: number;
  userId: number;
  message: string;
};
