'use client';

import TextInputField from '@/app/_components/TextInputField';
import React from 'react';
import client from './_utils/stomp';
import useUserInfoStore from '@/app/_store/useUserInfoStore';

enum ChatType {
  EMOJI = 'EMOJI',
  TEXT = 'TEXT',
}

interface ChatMessage {
  chatType: ChatType;
  roomId: number;
  userId: number | undefined;
  message: string;
}

const WaitingRoom = ({ params }: { params: { id: number } }) => {
  const [message, setMessage] = React.useState('');
  const { id: userId } = useUserInfoStore();

  React.useEffect(() => {
    const subscribeToRoom = (roomId: number) => {
      client.subscribe(`/sub/rooms/${roomId}`, (message) => {
        const chatMessage = JSON.parse(message.body);
        console.log('Received message:', chatMessage);
      });
    };

    client.onConnect = () => {
      console.log('Connected to WebSocket');
      subscribeToRoom(params.id);
    };

    client.activate();

    return () => {
      client.deactivate();
    };
  }, []);

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
    client.publish({
      destination: `/pub/rooms/${roomId}/chat`,
      body: JSON.stringify(chatMessage),
    });
  };

  return (
    <div>
      <h1>Waiting Room</h1>
      <div>
        <TextInputField
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          endAdornment={
            <button
              onClick={() =>
                sendChatMessage({
                  chatType: ChatType.TEXT,
                  roomId: params.id,
                  userId: userId,
                  message,
                })
              }
            >
              Send
            </button>
          }
        />
      </div>
    </div>
  );
};

export default WaitingRoom;
