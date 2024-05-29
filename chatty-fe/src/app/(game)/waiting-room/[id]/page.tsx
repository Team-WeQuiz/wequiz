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
import { UserStatus } from '@/app/_types/WaitingStatus';
import { startQuiz } from '@/app/_api/quiz';
import { useRouter } from 'next/navigation';

const WaitingRoom = ({ params }: { params: { id: number } }) => {
  const { id: userId } = useUserInfoStore();
  const searchParams = useSearchParams();
  const nickname = searchParams.get('nickname');

  const [isConnected, setIsConnected] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const { accessToken } = useAuthStore();
  const { userStatuses, updateUsers, setMessage, allUsersReady } =
    useWaitingStore();
  // 퀴즈 요약
  const [quizSummary, setQuizSummary] = useState<string>('');
  // 퀴즈 생성 완료 체크
  const [isQuizReady, setIsQuizReady] = useState(false);

  const [isReady, setIsReady] = useState<boolean>(false);
  const [countdown, setCountdown] = useState<number>(3);
  const router = useRouter();
  const [toggleBlock, setToggleBlock] = useState<boolean>(false);
  const [roomCode, setRoomCode] = useState<string>('');

  useEffect(() => {
    setIsReady(
      userStatuses.find((user: UserStatus) => user.userId === userId)
        ?.isReady || false,
    );
  }, [userStatuses]);

  useEffect(() => {
    setCountdown(3);
    let timer: NodeJS.Timeout | null = null;
    if (isQuizReady && allUsersReady) {
      timer = setInterval(() => {
        setCountdown((prevCount) => {
          const nextCount = prevCount - 1;
          if (nextCount === 1) {
            setToggleBlock(true);
          }
          if (nextCount === 0) {
            // userStatuses에서 내 userId가 min값이면 퀴즈 시작
            const minUserId = userStatuses.reduce((prev, curr) =>
              prev.userId < curr.userId ? prev : curr,
            ).userId;
            if (minUserId === userId) {
              startQuiz(params.id, accessToken);
            }
          }
          if (nextCount === -1) {
            clearInterval(timer!);
            router.push(`/quiz-room/${params.id}`);
          }
          return nextCount;
        });
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isQuizReady, allUsersReady]);

  useEffect(() => {
    const subscribeToStatus = (roomId: number) => {
      stompClient.subscribe(`/sub/rooms/${roomId}/status`, (message) => {
        const chatMessage = JSON.parse(message.body);
        console.log('Received status message:', chatMessage);
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

    // 방 참가
    const joinRoom = (roomId: number) => {
      stompClient.publish({
        destination: `/pub/rooms/${roomId}/join`,
        body: JSON.stringify({ nickname: nickname }),
      });
    };

    // quiz 생성 확인
    const subscribeQuizReady = (userId: number | undefined, roomId: number) => {
      stompClient.subscribe(
        `/user/${userId}/queue/rooms/${roomId}/quizReady`,
        (message) => {
          const quizReady = JSON.parse(message.body);
          if (quizReady.isReady) {
            setIsQuizReady(true);
          }
        },
      );
    };

    stompClient.beforeConnect = () => {
      console.log('Connecting to WebSocket token: ', accessToken);
      stompClient.configure({
        connectHeaders: { Authorization: `Bearer ${accessToken}` },
      });
    };

    stompClient.onDisconnect = () => {
      console.log('Disconnected from WebSocket');
    };

    stompClient.onConnect = () => {
      console.log('Connected to WebSocket');
      updateUsers([]);
      setIsConnected(true);
      subscribeToStatus(params.id);
      subscribeToChat(params.id);
      subscribeToDescription(userId, params.id);
      subscribeQuizReady(userId, params.id);
      setIsSubscribed(true);
      joinRoom(params.id);
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
            <QuizInfoCard
              roomId={params.id}
              isSubscribed={isSubscribed}
              setRoomCode={setRoomCode}
            />
            <QuizSummaryCard summary={quizSummary} />
          </div>
          <div className={styles.buttonWrapper}>
            <ReadyButton
              roomId={params.id}
              userId={userId}
              isConnected={isConnected}
              toggleBlock={toggleBlock}
              code={roomCode}
            />
          </div>
        </div>
        {isReady && (
          <div className={styles.readyStatus}>
            {isQuizReady && allUsersReady ? (
              <span className={styles.readyStatusText}>
                {countdown > 0 ? countdown : '퀴즈 시작 !'}
              </span>
            ) : (
              <span className={`${styles.readyStatusText} ${styles.blinking}`}>
                waiting
              </span>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default WaitingRoom;
