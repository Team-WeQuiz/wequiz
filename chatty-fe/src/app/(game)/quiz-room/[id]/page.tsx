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
import axios from 'axios';
import useModal from '@/app/_hooks/useModal';
import ResultModal from './_components/ResultModal/ResultModal';
import { useRouter } from 'next/navigation';
import client from '@/app/_api/client';

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

type PlayerScore = {
  playerId: number;
  nickname: string;
  score: number;
};

const QuizRoom = ({ params }: { params: { id: number } }) => {
  const [quizSet, setQuizSet] = useState<QuizSet>();
  const [isAnswered, setIsAnswered] = useState(false); // => 제출 상태 체크
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus | null>(null);
  const [userAnswer, setUserAnswer] = useState<string | null>(null);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [scores, setScores] = useState<PlayerScore[] | null>(null);
  const [count, setCount] = useState(4);
  const [modalCount, setModalCount] = useState(10);
  const { accessToken } = useAuthStore();
  const { id: userId } = useUserInfoStore();
  const { isOpen, openModal, closeModal } = useModal();

  const router = useRouter();

  const handleOptionChange = (option: string, index: number) => {
    setUserAnswer(option);
    setSelectedOption(index);
  };

  const getScore = (roomId: number) => {
    console.log('get Score');
    stompClient.publish({
      destination: `/pub/rooms/${roomId}/score`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  };

  const endRoom = async () => {
    await client.delete(`/rooms/${params.id}/end`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    openModal();
    const interval = setInterval(() => {
      setModalCount((currentCount) => {
        if (currentCount === 0) {
          closeModal();
          clearInterval(interval);
          router.push(`/result/${params.id}`);
        }
        return currentCount - 1;
      });
    }, 1000);
  };

  const endRoundCountDown = () => {
    const interval = setInterval(() => {
      setModalCount((currentCount) => {
        if (currentCount === 0) {
          closeModal();
          clearInterval(interval);
          getQuiz(params.id);
          return 10;
        }
        return currentCount - 1;
      });
    }, 1000);
  };

  const countDown = () => {
    const interval = setInterval(() => {
      setCount((currentCount) => {
        if (currentCount === 1) {
          if (!isAnswered) {
            submitQuiz(params.id);
          }
          clearInterval(interval);
          setIsAnswered(false);
          setSubmitStatus(null);
          if (quizSet?.quizNumber === (quizSet?.totalRound || 0) * 5) {
            endRoom();
          }
          if (quizSet?.quizNumber === 5) {
            getScore(params.id);
            openModal();
            endRoundCountDown();
          }
          getQuiz(params.id);
          return 4;
        }
        return currentCount - 1;
      });
    }, 1000);
  };

  const subscribeQuiz = (roomId: number) => {
    stompClient.subscribe(
      `/user/${userId}/queue/rooms/${roomId}/quiz`,
      (quiz) => {
        const quizData = JSON.parse(quiz.body);
        console.log('quiz: ', quizData);
        setQuizSet(quizData);
      },
      {
        Authorization: `Bearer ${accessToken}`,
      },
    );
  };
  const getQuiz = (roomId: number) => {
    setUserAnswer(null);
    stompClient.publish({
      destination: `/pub/rooms/${roomId}/quiz`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    setSelectedOption(null);
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

  const subscribeScore = (roomId: number) => {
    stompClient.subscribe(
      `/user/${userId}/queue/rooms/${roomId}/score`,
      (scoreStatus) => {
        const scoreData = JSON.parse(scoreStatus.body);
        console.log('score: ', scoreData);
        setScores(scoreData.scores);
      },
      {
        Authorization: `Bearer ${accessToken}`,
      },
    );
  };

  const submitQuiz = (roomId: number) => {
    setIsAnswered(true);
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
        return '과반수의 답안이 제출되어 다음 퀴즈로 넘어갑니다.';
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
        subscribeScore(params.id);
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

  useEffect(() => {
    if (
      submitStatus?.status === 'MAJORITY_SUBMITTED' ||
      submitStatus?.status === 'ALL_SUBMITTED'
    ) {
      countDown();
    }
  }, [submitStatus, isAnswered]);

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
                questionNumber={
                  (quizSet?.quizNumber || 0) % 5 === 0
                    ? quizSet?.quizNumber || 0
                    : (quizSet?.quizNumber || 0) % 5
                }
                totalQuestions={5}
              />
            </div>

            <div className={styles.QuestionContainer}>
              <QuestionArea contents={quizSet?.quiz || ''} />
              <AnswerArea
                type={quizSet?.type || '객관식'}
                options={quizSet?.options}
                answer={userAnswer || null}
                selectedOption={selectedOption}
                setAnswer={setUserAnswer}
                handleOptionChange={handleOptionChange}
              />
            </div>
          </div>
          <div className={styles.StatusWrapper}>
            {(isAnswered && submitStatus?.status === 'MAJORITY_SUBMITTED') ||
            (isAnswered && submitStatus?.status === 'ALL_SUBMITTED') ? (
              <h1 className={styles.Count}>{count - 1}</h1>
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
              {isAnswered ? '완료' : '제출'}
            </GradButton>
          </div>
        </div>
      </div>
      <div className={styles.UserContainer}>
        <MyProfile />
        <UserGrid userCount={6} />
      </div>
      {isOpen ? (
        <ResultModal
          currentRound={quizSet?.currentRound || 0}
          users={scores || []}
          count={modalCount}
        />
      ) : null}
    </div>
  );
};

export default QuizRoom;
