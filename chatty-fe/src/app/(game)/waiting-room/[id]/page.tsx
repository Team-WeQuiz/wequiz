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
import QuizSummaryCard from './_components/QuizSummaryCard/QuizSummaryCard';
import { usePathname, useSearchParams } from 'next/navigation';
import useModal from '@/app/_hooks/useModal';

const WaitingRoom = ({ params }: { params: { id: number } }) => {
  const { id: userId } = useUserInfoStore();
  const searchParams = useSearchParams();
  const nickname = searchParams.get('nickname');
  const { isOpen } = useModal();

  const [isConnected, setIsConnected] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const { accessToken } = useAuthStore();
  const { userStatuses, updateUsers, setMessage, allUsersReady } =
    useWaitingStore();
  // 퀴즈 요약
  const [quizSummary, setQuizSummary] = useState<string>('');
  // 퀴즈 생성 완료 체크
  const [isQuizReady, setIsQuizReady] = useState(false);

  // quiz 생성 확인
  const getQuiz = (roomId: number, accessToken: string) => {
    if (isConnected) {
      stompClient.publish({
        destination: `/pub/rooms/${roomId}/quiz`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
    }
  };

  // polling
  const startQuizPolling = (roomId: number, accessToken: string) => {
    return setInterval(() => {
      getQuiz(roomId, accessToken);
    }, 3000);
  };

  useEffect(() => {
    console.log('allUsersReady:', allUsersReady);
    if (!accessToken) return;
    let interval: NodeJS.Timeout | null = null;
    if (allUsersReady && !isQuizReady) {
      interval = startQuizPolling(params.id, accessToken);
    } else {
      if (interval) clearInterval(interval);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [allUsersReady, accessToken, isQuizReady]);

  // 연결 해제
  const disconnect = () => {
    if (isConnected) {
      console.log('Disconnecting from WebSocket!!!!!');
      stompClient.publish({
        destination: `/pub/rooms/${params.id}/leave`,
      });
      if (userStatuses.length === 1) {
        alert('방이 종료됩니다.');
        stompClient.publish({
          destination: `/pub/rooms/${params.id}/end`,
        });
      }
      stompClient.deactivate();
    }
  };

  const pathname = usePathname();
  useEffect(() => {
    if (!pathname.includes(`waiting-room/${params.id}`)) {
      console.log('is detecting?');
      disconnect();
    }
  }, [pathname]);

  useEffect(() => {
    window.addEventListener('popstate', disconnect);
    window.addEventListener('beforeunload', disconnect);
    return () => {
      window.removeEventListener('popstate', disconnect);
      window.removeEventListener('beforeunload', disconnect);
    };
  }, []);

  useEffect(() => {
    const subscribeToStatus = (roomId: number) => {
      stompClient.subscribe(`/sub/rooms/${roomId}/status`, (message) => {
        const chatMessage = JSON.parse(message.body);
        console.log('Received status message:', chatMessage);
        // join 신호
        updateUsers(chatMessage.playerStatuses);
      });
    };

    // 채팅 구독
    const subscribeToChat = (roomId: number) => {
      stompClient.subscribe(`/sub/rooms/${roomId}/chat`, (message) => {
        const chatMessage = JSON.parse(message.body);
        console.log('Received chatting message:', chatMessage);
        if (chatMessage.chatType === 'TEXT')
          setMessage(chatMessage.userId, chatMessage.message);
      });
    };

    // 요약 정보 구독
    const subscribeToDescription = (
      userId: number | undefined,
      roomId: number,
    ) => {
      stompClient.subscribe(
        `/user/${userId}/queue/rooms/${roomId}/description`,
        (message) => {
          const data = JSON.parse(message.body);
          console.log('Received description message:', data);
          setQuizSummary(data.description);
        },
      );
    };

    const subscribeQuiz = (roomId: number) => {
      stompClient.subscribe(
        `/user/${userId}/queue/rooms/${roomId}/quiz`,
        (quiz) => {
          const quizData = JSON.parse(quiz.body);
          if (quizData.currentRound === 1) {
            setIsQuizReady(true);
          }
        },
      );
    };

    // 방 참가
    const joinRoom = (roomId: number) => {
      stompClient.publish({
        destination: `/pub/rooms/${roomId}/join`,
        body: JSON.stringify({ nickname: nickname }),
      });
    };

    stompClient.beforeConnect = () => {
      console.log('Connecting to WebSocket token: ', accessToken);
      stompClient.configure({
        connectHeaders: { Authorization: `Bearer ${accessToken}` },
      });
    };

    stompClient.onDisconnect = () => {
      console.log('Disconnected from WebSocket');
      disconnect();
    };

    stompClient.onConnect = () => {
      console.log('Connected to WebSocket');
      updateUsers([]);
      setIsConnected(true);
      subscribeToStatus(params.id);
      subscribeToChat(params.id);
      joinRoom(params.id);
      subscribeToDescription(userId, params.id);
      setIsSubscribed(true);
      subscribeQuiz(params.id);
    };

    if (accessToken && userId) stompClient.activate();

    return () => {
      stompClient.deactivate();
    };
  }, [accessToken, userId, nickname]);

  return (
    <>
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
            <QuizSummaryCard summary={quizSummary} />
          </div>
          <div className={styles.buttonWrapper}>
            <ReadyButton
              roomId={params.id}
              userId={userId}
              isQuizReady={isQuizReady}
              accessToken={accessToken}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default WaitingRoom;
