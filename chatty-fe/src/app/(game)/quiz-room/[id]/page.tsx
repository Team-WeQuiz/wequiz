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
import useModal from '@/app/_hooks/useModal';
import ResultModal from './_components/ResultModal/ResultModal';
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
  userId: number;
  nickname: string;
  profileImage: string;
  isSolved: boolean;
};

type SubmitStatuses = {
  isMajority: boolean;
  submitStatuses: SubmitStatus[];
  time: string;
};

type PlayerScore = {
  playerId: number;
  nickname: string;
  score: number;
};

const QuizRoom = ({ params }: { params: { id: number } }) => {
  const [quizSet, setQuizSet] = useState<QuizSet | null>(null);
  const [count, setCount] = useState(3);
  const [scoreCount, setScoreCount] = useState(0);
  const [scores, setScores] = useState<PlayerScore[]>([]);
  const [isAnswered, setIsAnswered] = useState(false);
  const [userAnswer, setUserAnswer] = useState<string | null>(null);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [submitStatuses, setSubmitStatuses] = useState<SubmitStatuses | null>(
    null,
  );
  const { accessToken } = useAuthStore();
  const { id: userId } = useUserInfoStore();
  const { openModal, closeModal, isOpen } = useModal();

  const handleOptionChange = (option: string, index: number) => {
    setUserAnswer(option);
    setSelectedOption(index);
  };

  // 퀴즈 구독
  const subscribeQuiz = (roomId: number) => {
    stompClient.subscribe(
      `/user/${userId}/queue/rooms/${roomId}/quiz`,
      (quiz) => {
        const quizData = JSON.parse(quiz.body);
        console.log('퀴즈: ', quizData);
        setQuizSet(quizData);
      },
      {
        Authorization: `Bearer ${accessToken}`,
      },
    );
  };

  // 제출 상태 구독
  const subscribeSubmitStatus = (roomId: number) => {
    stompClient.subscribe(
      `/sub/rooms/${roomId}/submit`,
      (submitStatus) => {
        const statusData = JSON.parse(submitStatus.body);
        console.log('제출현황: ', statusData);
        setSubmitStatuses(statusData);
      },
      {
        Authorization: `Bearer ${accessToken}`,
      },
    );
  };

  // 중간 점수 구독
  const subscribeScore = (roomId: number) => {
    stompClient.subscribe(
      `/user/${userId}/queue/rooms/${roomId}/score`,
      (scoreStatus) => {
        const scoreData = JSON.parse(scoreStatus.body);
        console.log('점수: ', scoreData);
        setScores(scoreData.scores);
      },
      {
        Authorization: `Bearer ${accessToken}`,
      },
    );
  };

  // 카운트다운 구독
  const subscribeCount = (roomId: number) => {
    stompClient.subscribe(
      `/sub/rooms/${roomId}/quizCount`,
      (count) => {
        const countData = JSON.parse(count.body);
        setCount(countData.second);
        console.log('카운트: ', countData);
        if (countData.second === 0) {
          if (!isAnswered) {
            submitQuiz(params.id);
          }
        }
        if (countData.second === -1) {
          getQuiz(params.id);
          setCount(3);
        }
      },
      {
        Authorization: `Bearer ${accessToken}`,
      },
    );
  };

  // 모달 카운트 구독
  const subscribeScoreCount = (roomId: number) => {
    stompClient.subscribe(
      `/sub/rooms/${roomId}/scoreCount`,
      (count) => {
        const countData = JSON.parse(count.body);
        setScoreCount(countData.second);
        console.log('모달카운트: ', countData);
        if (!isOpen) {
          openModal();
        }
        setCount(countData.second);
        if (countData.second === 0) {
          if (quizSet?.totalRound === quizSet?.currentRound) {
            deleteRoom();
          }
          closeModal();
        }
      },
      {
        Authorization: `Bearer ${accessToken}`,
      },
    );
  };

  // 페이즈 구독
  const getPhase = (roomId: number) => {
    stompClient.publish({
      destination: `/pub/rooms/${roomId}/phase`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  };

  // 퀴즈 가져오기
  const getQuiz = (roomId: number) => {
    setUserAnswer(null);
    console.log('퀴즈 가져오기 신호보냄');
    stompClient.publish({
      destination: `/pub/rooms/${roomId}/quiz`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    setSelectedOption(null);
  };

  // 퀴즈 끝내기 요청
  const deleteRoom = async () => {
    const response = await client.delete(`/rooms/${params.id}/end`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  };

  // 퀴즈 제출
  const submitQuiz = (roomId: number) => {
    setIsAnswered(true);
    stompClient.publish({
      destination: `/pub/rooms/${roomId}/submit`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        quizNum: quizSet?.quizNumber,
        playerAnswer: userAnswer === null ? '' : userAnswer,
      }),
    });
    console.log('퀴즈 보냈음.:', quizSet?.quizNumber);
    console.log('퀴즈 답: ', userAnswer);
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
        subscribeSubmitStatus(params.id);
        subscribeScore(params.id);
        subscribeCount(params.id);
        subscribeScoreCount(params.id);
        getPhase(params.id);
      };
      stompClient.activate();
    }
  }, [accessToken, userId, params.id]);

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
            {isAnswered && submitStatuses?.isMajority ? (
              <h1 className={styles.Count}>{count <= 0 ? 0 : count}</h1>
            ) : isAnswered && !submitStatuses?.isMajority ? (
              <BarSpinner />
            ) : (
              ''
            )}
            <div>
              {isAnswered && submitStatuses?.isMajority
                ? '과반수 이상이 제출하였습니다.'
                : '다른 플레이어가 문제를 제출할 때 까지 기다려주세용 :)'}
            </div>
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
      <UserGrid submitStatus={submitStatuses?.submitStatuses || []} />
      {isOpen ? (
        <ResultModal
          currentRound={quizSet?.currentRound || 0}
          users={scores || []}
          count={scoreCount}
        />
      ) : null}
    </div>
  );
};

export default QuizRoom;
