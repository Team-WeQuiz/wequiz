'use client';

import { useState, useEffect } from 'react';
import stompClient from './_utils/stomp';
import useUserInfoStore from '@/app/_store/useUserInfoStore';
import * as styles from './page.css';
import UserList from './_components/UserList/UserList';
import ChatInput from './_components/ChatInput/ChatInput';
import QuizInfoCard from './_components/QuizInfoCard/QuizInfoCard';
import useAuthStore from '@/app/_store/useAuthStore';
import useWaitingStore from '@/app/_store/useWaitingStore';
import ReadyButton from './_components/ReadyButton/ReadyButton';

const WaitingRoom = ({ params }: { params: { id: number } }) => {
  const { id: userId } = useUserInfoStore();
  const [isConnected, setIsConnected] = useState(false);
  const accessToken = useAuthStore.getState().accessToken;
  const { updateUsers, setMessage } = useWaitingStore();

  useEffect(() => {
    console.log('WaitingRoom mounted');
    const subscribeToStatus = (roomId: number) => {
      stompClient.subscribe(`/sub/rooms/${roomId}/status`, (message) => {
        const chatMessage = JSON.parse(message.body);
        console.log('Received status message:', chatMessage);
        // join 신호
        if (chatMessage.roomUserStatuses) {
          updateUsers(chatMessage.roomUserStatuses);
        }
      });
    };

    const subscribeToChat = (roomId: number) => {
      stompClient.subscribe(`/sub/rooms/${roomId}/chat`, (message) => {
        const chatMessage = JSON.parse(message.body);
        console.log('Received chatting message:', chatMessage);
        setMessage(chatMessage.userId, chatMessage.message);
      });
    };

    const joinRoom = (roomId: number) => {
      stompClient.publish({
        destination: `/pub/rooms/${roomId}/join`,
      });
    };

    stompClient.beforeConnect = () => {
      console.log('Connecting to WebSocket token: ', accessToken);
      stompClient.configure({
        connectHeaders: { Authorization: `Bearer ${accessToken}` },
      });
    };

    stompClient.onConnect = () => {
      console.log('Connected to WebSocket');
      setIsConnected(true);
      subscribeToStatus(params.id);
      subscribeToChat(params.id);
      joinRoom(params.id);
    };

    stompClient.onDisconnect = () => {
      setIsConnected(false);
      console.log('Disconnected from WebSocket');
    };

    stompClient.activate();

    return () => {
      stompClient.deactivate();
    };
  }, [accessToken]);

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
        <div className={styles.detailArea}>
          <QuizInfoCard roomId={params.id} />
        </div>
        <div className={styles.buttonWrapper}>
          <ReadyButton roomId={params.id} userId={userId} />
        </div>
      </div>
    </div>
  );
};

export default WaitingRoom;
