'use client';

import { useState, useEffect } from 'react';
import stompClient from '../../_utils/stomp';
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
  const [isSubscribed, setIsSubscribed] = useState(false);
  const { accessToken } = useAuthStore();
  const { userStatuses, updateUsers, setMessage } = useWaitingStore();
  // 퀴즈 생성 완료 체크
  const [isQuizReady] = useState(false);

  const disconnect = () => {
    console.log('Disconnecting from WebSocket');
    if (userStatuses.length === 1) {
      stompClient.publish({
        destination: `/pub/rooms/${params.id}/end`,
      });
    } else {
      stompClient.publish({
        destination: `/pub/rooms/${params.id}/leave`,
      });
    }
    stompClient.deactivate();
  };

  useEffect(() => {
    window.addEventListener('popstate', disconnect);
    window.addEventListener('beforeunload', disconnect);
    return () => {
      window.removeEventListener('popstate', disconnect);
      window.removeEventListener('beforeunload', disconnect);
    };
  }, []);

  useEffect(() => {
    console.log('WaitingRoom useEffect');
    const subscribeToStatus = (roomId: number) => {
      stompClient.subscribe(`/sub/rooms/${roomId}/status`, (message) => {
        const chatMessage = JSON.parse(message.body);
        console.log('Received status message:', chatMessage);
        // join 신호
        updateUsers(chatMessage.playerStatuses);
      });
    };

    const subscribeToChat = (roomId: number) => {
      stompClient.subscribe(`/sub/rooms/${roomId}/chat`, (message) => {
        const chatMessage = JSON.parse(message.body);
        console.log('Received chatting message:', chatMessage);
        if (chatMessage.chatType === 'TEXT')
          setMessage(chatMessage.userId, chatMessage.message);
      });
    };

    const subscribeToDescription = (
      userId: number | undefined,
      roomId: number,
    ) => {
      stompClient.subscribe(
        `/user/${userId}/queue/rooms/${roomId}/description`,
        (message) => {
          const description = JSON.parse(message.body);
          console.log('Received description message:', description);
        },
      );
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

    stompClient.onDisconnect = () => {
      stompClient.publish({
        destination: `/pub/rooms/${params.id}/leave`,
      });
    };

    stompClient.onConnect = () => {
      console.log('Connected to WebSocket');
      updateUsers([]);
      setIsConnected(true);
      subscribeToStatus(params.id);
      subscribeToChat(params.id);
      subscribeToDescription(userId, params.id);
      setIsSubscribed(true);
      joinRoom(params.id);
    };
    if (accessToken) stompClient.activate();

    return () => {
      stompClient.deactivate();
    };
  }, [accessToken]);

  return (
    <div className={styles.roomContainer}>
      <div className={styles.wideArea}>
        <div className={styles.userList}>
          <UserList isQuizReady={isQuizReady} />
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
          <QuizInfoCard roomId={params.id} isSubscribed={isSubscribed} />
        </div>
        <div className={styles.buttonWrapper}>
          <ReadyButton
            roomId={params.id}
            userId={userId}
            isQuizReady={isQuizReady}
          />
        </div>
      </div>
    </div>
  );
};

export default WaitingRoom;
