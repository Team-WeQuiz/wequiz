'use client';
import QuestionProgess from './_components/QuestionProgress/QuestionProgess';
import QuestionArea from './_components/QuestionArea/QuestionArea';
import AnswerArea from './_components/AnswerArea/AnswerArea';
import * as styles from './page.css';
import GradButton from '@/app/_components/GradButton';
import UserGrid from './_components/UserGrid/UserGrid';
import { useEffect, useRef, useState } from 'react';
import useAuthStore from '@/app/_store/useAuthStore';
import stompClient from '../../_utils/stomp';
import useUserInfoStore from '@/app/_store/useUserInfoStore';
import BarSpinner from '@/app/_components/BarSpinner/BarSpinner';
import useModal from '@/app/_hooks/useModal';
import ResultModal from './_components/ResultModal/ResultModal';
import { useRouter } from 'next/navigation';
import useBgmStore from '@/app/_store/useBgmStore';
import { endQuiz } from '@/app/_api/quiz';

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
  profileImage: string | null;
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
  const { setBgm } = useBgmStore();
  const [lastQuizSet, setLastQuizSet] = useState<QuizSet | null>(null);
  const [quizSet, setQuizSet] = useState<QuizSet | null>(null);
  const [count, setCount] = useState<number | null>(null);
  const [scoreCount, setScoreCount] = useState<number | null>(null);
  const [scores, setScores] = useState<PlayerScore[]>([]);
  const [isAnswered, setIsAnswered] = useState(false);
  const [userAnswer, setUserAnswer] = useState<string | null>(null);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [submitStatuses, setSubmitStatuses] = useState<SubmitStatuses | null>(
    null,
  );
  const [unableSubmit, setUnableSubmit] = useState(false);
  const { accessToken } = useAuthStore();
  const { id: userId } = useUserInfoStore();
  const { openModal, closeModal, isOpen } = useModal();
  const router = useRouter();
  const lastQuizSetRef = useRef(lastQuizSet);
  lastQuizSetRef.current = lastQuizSet;

  const handleOptionChange = (option: string, index: number) => {
    setUserAnswer(option);
    setSelectedOption(index);
  };

  useEffect(() => {
    setBgm('/bgm/quiz.mp3');
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        event.key === 'Enter' &&
        !unableSubmit &&
        (userAnswer || selectedOption)
      ) {
        event.preventDefault();
        submitQuiz(params.id);
      }
    };
    window.addEventListener('keypress', handleKeyDown);
    return () => {
      window.removeEventListener('keypress', handleKeyDown);
    };
  }, [unableSubmit, params.id, userAnswer, selectedOption]);

  useEffect(() => {
    setUnableSubmit(count === 0 || isAnswered);
  }, [count, isAnswered]);

  useEffect(() => {
    if (quizSet?.quizNumber === (quizSet?.totalRound || 0) * 5) {
      const lastQuiz = quizSet;
      setLastQuizSet(lastQuiz);
    }
  }, [quizSet]);

  useEffect(() => {
    if (lastQuizSet) {
      console.log('lastQuizSet: ', lastQuizSet);
    }
  }, [lastQuizSet]);

  useEffect(() => {
    console.log(isAnswered);
  }, [isAnswered]);

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
        statusData.submitStatuses.sort(
          (a: SubmitStatus, b: SubmitStatus) => a.userId - b.userId,
        );
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
      `/sub/rooms/${roomId}/score`,
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
        if (countData.second === -1) {
          getQuiz(params.id);
          setIsAnswered(false);
          setCount(null);
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
        if (!isOpen) {
          openModal();
        }
        if (countData.second === -1) {
          if (lastQuizSetRef.current) {
            console.log('끝났어');
            endQuiz(accessToken, params.id);
            router.push(`/result/${roomId}`);
          } else {
            closeModal();
            setScoreCount(null);
            getQuiz(roomId);
            setCount(null);
            setIsAnswered(false);
          }
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
    if (
      submitStatuses?.submitStatuses.find((status) => status.userId === userId)
        ?.isSolved
    ) {
      setIsAnswered(true);
      setUnableSubmit(true);
    }
  }, [submitStatuses, userId]);

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
  }, [accessToken, params.id, userId]);

  return (
    <div className={styles.Main}>
      <div className={styles.MainContainer}>
        <div className={styles.Container}>
          <div className={styles.ContentsWrapper}>
            <div className={styles.Navigation}>
              <div className={styles.RoundWrapper}>
                Round {quizSet?.currentRound || 0} / {quizSet?.totalRound || 0}
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
                unableSubmit={unableSubmit}
              />
            </div>
          </div>
          <div className={styles.StatusWrapper}>
            {count !== null ? (
              <h1 className={styles.Count}>
                {count <= 0 || count === null ? 0 : count}
              </h1>
            ) : isAnswered ? (
              <BarSpinner />
            ) : (
              ''
            )}
            <div>
              {count !== null
                ? '과반수 이상이 제출하였습니다.'
                : isAnswered
                  ? '다른 플레이어가 문제를 제출할 때 까지 기다려주세용 :)'
                  : ''}
            </div>
          </div>
          <div className={styles.ButtonWrapper}>
            <GradButton
              rounded
              color={'primary'}
              fullWidth
              onClick={() => submitQuiz(params.id)}
              disabled={unableSubmit}
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
          users={scores.length > 0 ? scores : []}
          count={scoreCount === -1 ? 0 : scoreCount}
        />
      ) : null}
    </div>
  );
};

export default QuizRoom;
