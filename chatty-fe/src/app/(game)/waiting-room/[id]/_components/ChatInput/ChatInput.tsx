import { useState } from 'react';
import TextInputField from '@/app/_components/TextInputField';
import stompClient from '../../../../_utils/stomp';
import { ChatType, ChatMessage } from '@/app/_types/ChatType';
import { submitButton } from './ChatInput.css';

const ChatInput = ({
  roomId,
  userId,
  disabled,
}: {
  roomId: number;
  userId: number | undefined;
  disabled: boolean;
}) => {
  const [message, setMessage] = useState('');

  // 채팅 메시지 보내기
  const sendChatMessage = ({
    chatType,
    roomId,
    userId,
    message,
  }: ChatMessage) => {
    const chatMessage = {
      chatType,
      roomId,
      userId,
      message,
    };

    stompClient.publish({
      destination: `/pub/rooms/${roomId}/chat`,
      body: JSON.stringify(chatMessage),
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    
    e.preventDefault();

    if (!message) return;

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
        placeholder={disabled ? '연결 중 입니다...' : '메시지를 입력하세요'}
        isChat
        value={message}
        onChange={(e) => {
          if (e.target.value.length < 100) {
            setMessage(e.target.value);
          }
        }}
        endAdornment={<button type="submit" className={submitButton}></button>}
        disabled={disabled}
      />
    </form>
  );
};

export default ChatInput;
