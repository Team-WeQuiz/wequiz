import React from 'react';
import TextInputField from '@/app/_components/TextInputField';
import stompClient from '../../_utils/stomp';
import { ChatType, ChatMessage } from '@/app/_types/ChatType';
import { submitButton } from './ChatInput.css';

const ChatInput = ({
  roomId,
  userId,
}: {
  roomId: number;
  userId: number | undefined;
}) => {
  const [message, setMessage] = React.useState('');

  // 채팅 메시지 보내기
  const sendChatMessage = ({
    chatType,
    roomId,
    userId,
    message,
  }: ChatMessage) => {
    console.log('user id: ', userId);
    const chatMessage = {
      chatType,
      roomId,
      userId,
      message,
    };
    // WebSocket 연결이 되어있지 않을 때
    if (stompClient.webSocket?.readyState !== 1) {
      console.error('WebSocket is not connected');
      return;
    }
    stompClient.publish({
      destination: `/pub/rooms/${roomId}/chat`,
      body: JSON.stringify(chatMessage),
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    sendChatMessage({
      chatType: ChatType.TEXT,
      roomId,
      userId,
      message,
    });
    setMessage('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <TextInputField
        placeholder="채팅을 입력하세요"
        isChat
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        endAdornment={<button type="submit" className={submitButton}></button>}
      />
    </form>
  );
};

export default ChatInput;
