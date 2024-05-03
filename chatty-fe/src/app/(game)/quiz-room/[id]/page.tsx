'use client';
import QuestionProgess from './_components/QuestionProgress/QuestionProgess';
import QuestionArea from './_components/QuestionArea/QuestionArea';
import AnswerArea from './_components/AnswerArea/AnswerArea';
import * as styles from './page.css';
import GradButton from '@/app/_components/GradButton';
import MyProfile from './_components/MyProfile/MyProfile';
import UserGrid from './_components/UserGrid/UserGrid';
import RoundProgress from './_components/RoundProgress/RoundProgress';
import { useEffect, useState } from 'react';
import useAuthStore from '@/app/_store/useAuthStore';
import stompClient from '../../_utils/stomp';
import useUserInfoStore from '@/app/_store/useUserInfoStore';
import BarSpinner from '@/app/_components/BarSpinner/BarSpinner';

type QuizSet = {
  totalRound: number;
  currentRound: number;
  quizNumber: number;
  type: '객관식' | '단답형';
  quiz: string;
  options: string[];
};

type SubmitStatus = {
  status: 'ALL_SUBMITTED' | 'MAJORITY_SUBMITTED' | 'PARTIAL_SUBMITTED';
  time: string;
};
// 제출 -> answered 트루 -> 버튼비활성화 -> PARTIAL일 경우 무한대기 -> 그외의 경우 3초 카운트 -> 3초 후에 ANSWERED FALSE, 문제 바뀌기, SETSUBMIT NULL
const QuizRoom = ({ params }: { params: { id: number } }) => {
  const [quizSet, setQuizSet] = useState<QuizSet>();
  const [isAnswered, setIsAnswered] = useState(false); // => 제출 상태 체크
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus | null>(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [count, setCount] = useState(4);
  const { accessToken } = useAuthStore();
  const { id: userId } = useUserInfoStore();

  const countDown = () => {
    const interval = setInterval(() => {
      setCount(count - 1);
    }, 1000);
    if (count === 0) {
      clearInterval(interval);
      setIsAnswered(false);
      setSubmitStatus(null);
      setCount(4);
    }
  };

  const subscribeQuiz = (roomId: number) => {
    stompClient.subscribe(
      `/user/${userId}/queue/rooms/${roomId}/quiz`,
      (quiz) => {
        const quizData = JSON.parse(quiz.body);
        console.log('quiz:s ', quizData);
        setQuizSet(quizData);
      },
      {
        Authorization: `Bearer ${accessToken}`,
      },
    );
  };
  const getQuiz = (roomId: number) => {
    if (!isAnswered) {
      stompClient.publish({
        destination: `/pub/rooms/${roomId}/quiz`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
    }
  };
  const subscribeSubmitStatus = (roomId: number) => {
    stompClient.subscribe(
      `/sub/rooms/${roomId}/submit`,
      (submitStatus) => {
        const statusData = JSON.parse(submitStatus.body);
        console.log('ss', statusData);
        setSubmitStatus(statusData);
      },
      {
        Authorization: `Bearer ${accessToken}`,
      },
    );
  };

  const submitQuiz = (roomId: number) => {
    setIsAnswered(true);
    // if (isAnswered) {
    //   countDown();
    // }
    stompClient.publish({
      destination: `/pub/rooms/${roomId}/submit`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        quizNum: quizSet?.quizNumber,
        playerAnswer: userAnswer,
      }),
    });
  };

  const getSubmitMessage = () => {
    if (!isAnswered) return '';
    switch (submitStatus?.status) {
      case 'PARTIAL_SUBMITTED':
        return '다른 참여자가 답변을 제출할 때 까지 기다려주세요 :)';
      case 'MAJORITY_SUBMITTED':
      case 'ALL_SUBMITTED':
        return '과반수의 답안이 제출되어 다음 라운드로 넘어갑니다.';
      default:
        return '';
    }
  };

  useEffect(() => {
    if (accessToken && userId) {
      stompClient.beforeConnect = () => {
        console.log('Connecting to WebSocket with token: ', accessToken);
        stompClient.configure({
          connectHeaders: { Authorization: `Bearer ${accessToken}` },
        });
      };
      stompClient.onStompError = (frame) => {
        console.log('WebSocket error', frame.body);
      };
      stompClient.onConnect = () => {
        console.log('connected');
        subscribeQuiz(params.id);
        getQuiz(params.id);
        subscribeSubmitStatus(params.id);
      };
      stompClient.activate();
    }
  }, [accessToken, userId, params.id]);

  useEffect(() => {
    console.log(quizSet);
  }, [quizSet]);

  useEffect(() => {
    console.log(params.id);
  }, [params.id]);

  useEffect(() => {}, [submitStatus, isAnswered]);

  return (
    <div className={styles.Main}>
      <div className={styles.MainContainer}>
        <RoundProgress
          round={quizSet?.currentRound || 0}
          totalRounds={quizSet?.totalRound || 0}
        />

        <div className={styles.Container}>
          <div className={styles.ContentsWrapper}>
            <div className={styles.Navigation}>
              <div className={styles.RoundWrapper}>
                Round {quizSet?.currentRound || 0}
              </div>
              <QuestionProgess
                questionNumber={quizSet?.quizNumber || 0}
                totalQuestions={quizSet?.totalRound || 0}
              />
            </div>

            <div className={styles.QuestionContainer}>
              <QuestionArea contents={quizSet?.quiz || ''} />
              <AnswerArea
                type={quizSet?.type || '객관식'}
                options={quizSet?.options}
                answer={userAnswer}
                setAnswer={setUserAnswer}
              />
            </div>
          </div>
          <div className={styles.StatusWrapper}>
            {(isAnswered && submitStatus?.status === 'MAJORITY_SUBMITTED') ||
            (isAnswered && submitStatus?.status === 'ALL_SUBMITTED') ? (
              <div>{count - 1}</div>
            ) : isAnswered && submitStatus?.status === 'PARTIAL_SUBMITTED' ? (
              <BarSpinner />
            ) : (
              ''
            )}
            <div>{getSubmitMessage()}</div>
          </div>
          <div className={styles.ButtonWrapper}>
            <GradButton
              rounded
              color={'primary'}
              fullWidth
              onClick={() => submitQuiz(params.id)}
              disabled={isAnswered}
            >
              {isAnswered ? '기다리쇼' : '제출'}
            </GradButton>
          </div>
        </div>
      </div>
      <div className={styles.UserContainer}>
        <MyProfile />
        <UserGrid userCount={6} />
      </div>
    </div>
  );
};

export default QuizRoom;
