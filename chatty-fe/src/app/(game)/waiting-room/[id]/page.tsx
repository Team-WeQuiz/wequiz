'use client';

import { useState, useEffect } from 'react';
import stompClient from './_utils/stomp';
import useUserInfoStore from '@/app/_store/useUserInfoStore';
import * as styles from './page.css';
import UserList from './_components/UserList/UserList';
import ChatInput from './_components/ChatInput/ChatInput';
import QuizInfoCard from './_components/QuizInfoCard/QuizInfoCard';
import useAuthStore from '@/app/_store/useAuthStore';
import { UserStatus } from '@/app/_types/UserStatus';

const WaitingRoom = ({ params }: { params: { id: number } }) => {
  const { id: userId } = useUserInfoStore();
  const [isConnected, setIsConnected] = useState(false);
  const accessToken = useAuthStore.getState().accessToken;
  const [userStatuses, setUserStatuses] = useState<UserStatus[]>([]);

  useEffect(() => {
    const subscribeToRoom = (roomId: number) => {
      stompClient.subscribe(`/sub/rooms/${roomId}`, (message) => {
        const chatMessage = JSON.parse(message.body);
        console.log('Received message:', chatMessage);
        // join 신호
        if (chatMessage.roomUserStatuses) {
          let updatedUserStatuses = [...userStatuses];
          chatMessage.roomUserStatuses.forEach((userStatus: UserStatus) => {
            if (userStatus.userId === null) return;
            const userIndex = updatedUserStatuses.findIndex(
              (user) => user.userId === userStatus.userId,
            );
            if (userIndex === -1) {
              updatedUserStatuses = [...updatedUserStatuses, userStatus];
            } else if (
              userStatus.isReady !== updatedUserStatuses[userIndex].isReady
            ) {
              updatedUserStatuses[userIndex].isReady = userStatus.isReady;
            } else return;
          });
          console.log('Updated userStatuses after join:', updatedUserStatuses);
          setUserStatuses(updatedUserStatuses);
        }
        // 채팅 메시지
        else if (chatMessage.chatType && chatMessage.chatType === 'TEXT') {
          const updatedUserStatuses = [...userStatuses];
          console.log('userStatuses before chat:', updatedUserStatuses);
          const userIndex = updatedUserStatuses.findIndex(
            (user) => user.userId === chatMessage.userId,
          );
          if (userIndex !== -1) {
            updatedUserStatuses[userIndex].message = chatMessage.message;
          }
          console.log('Updated userStatuses after chat:', updatedUserStatuses);
          setUserStatuses(updatedUserStatuses);
        }
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
      subscribeToRoom(params.id);
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
          <UserList userList={userStatuses} />
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
        <div className={styles.buttonArea}>버튼</div>
      </div>
    </div>
  );
};

export default WaitingRoom;
