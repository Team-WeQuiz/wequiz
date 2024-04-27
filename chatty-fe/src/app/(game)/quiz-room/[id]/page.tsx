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

type Quiz = {
  id: string;
  questionNumber: number;
  type: '단답형' | '객관식';
  question: string;
  options: string[];
  answer: string;
};

type QuizSet = {
  totalRound: number;
  currentRound: number;
  quiz: Quiz;
};

type SubmitStatus = {
  status: 'ALL_SUBMITTED' | 'MAJORITY_SUBMITTED' | 'PARTIAL_SUBMITTED';
  time: string;
};

const QuizRoom = ({ params }: { params: { id: number } }) => {
  const [quizSet, setQuizSet] = useState<QuizSet>();
  const [isAnswered, setIsAnswered] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>();
  const [userAnswer, setUserAnswer] = useState('');
  const { accessToken } = useAuthStore();
  const { id: userId } = useUserInfoStore();

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
  const subscribeSubmitQuiz = (roomId: number) => {
    stompClient.subscribe(
      `/sub/rooms/${roomId}/submit`,
      (submitStatus) => {
        console.log('ss', submitStatus);
      },
      {
        Authorization: `Bearer ${accessToken}`,
      },
    );
  };

  const submitQuiz = (roomId: number) => {
    stompClient.publish({
      destination: `/pub/rooms/${roomId}/submit`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        quizId: quizSet?.quiz.id,
        quizNum: quizSet?.quiz.questionNumber,
        answer: quizSet?.quiz.answer,
        userAnswer,
        playerId: userId,
      }),
    });
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
        subscribeSubmitQuiz(params.id);
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
                questionNumber={quizSet?.quiz.questionNumber || 0}
                totalQuestions={5}
              />
            </div>

            <div className={styles.QuestionContainer}>
              <QuestionArea contents={quizSet?.quiz.question || ''} />
              <AnswerArea
                type={quizSet?.quiz.type || '단답형'}
                options={quizSet?.quiz.options}
                answer={userAnswer}
                setAnswer={setUserAnswer}
              />
            </div>
          </div>
          <div className={styles.ButtonWrapper}>
            <GradButton
              rounded
              color={'primary'}
              fullWidth
              onClick={() => submitQuiz(params.id)}
            >
              제 출
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
