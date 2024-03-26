export enum ChatType {
  EMOJI = 'EMOJI',
  TEXT = 'TEXT',
}

export type ChatMessage = {
  chatType: ChatType;
  roomId: number;
  userId: number | undefined;
  message: string;
};
