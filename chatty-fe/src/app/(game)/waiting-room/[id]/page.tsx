'use client';

import { useState, useEffect } from 'react';
import stompClient from './_utils/stomp';
import useUserInfoStore from '@/app/_store/useUserInfoStore';
import * as styles from './page.css';
import UserList from './_components/UserList/UserList';
import ChatInput from './_components/ChatInput/ChatInput';

const WaitingRoom = ({ params }: { params: { id: number } }) => {
  const { id: userId } = useUserInfoStore();
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const subscribeToRoom = (roomId: number) => {
      stompClient.subscribe(`/sub/rooms/${roomId}`, (message) => {
        const chatMessage = JSON.parse(message.body);
        console.log('Received message:', chatMessage);
      });
    };

    stompClient.onConnect = () => {
      console.log('Connected to WebSocket');
      setIsConnected(true);
      subscribeToRoom(params.id);
    };

    stompClient.onDisconnect = () => {
      setIsConnected(false);
      console.log('Disconnected from WebSocket');
    };

    stompClient.activate();

    return () => {
      stompClient.deactivate();
    };
  }, []);

  return (
    <div className={styles.roomContainer}>
      <div className={styles.wideArea}>
        <div className={styles.userList}>
          <UserList />
        </div>
        <div className={styles.chattingArea}>
          <ChatInput
            roomId={params.id}
            userId={userId}
            disabled={!isConnected}
          />
        </div>
      </div>
      <div className={styles.narrowArea}>
        <div className={styles.detailArea}>방 정보</div>
        <div className={styles.buttonArea}>버튼</div>
      </div>
    </div>
  );
};

export default WaitingRoom;
