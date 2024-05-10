'use client';
import React, { useEffect, useState } from 'react';
import * as styles from './page.css';
import client from '@/app/_api/client';
import useAuthStore from '@/app/_store/useAuthStore';
import QuestionProgess from '../../quiz-room/[id]/_components/QuestionProgress/QuestionProgess';
import useUserInfoStore from '@/app/_store/useUserInfoStore';
import PercentageCircle from './_components/PercentageCircle/PercentageCircle';
import Image from 'next/image';
import useModal from '@/app/_hooks/useModal';
import ResultPageModal from './_components/ResultPageModal/ResultPageModal';

type PlayerAnswers = {
  playerId: number;
  nickname: string;
  playerAnswer: string;
  marking: boolean;
  correction: false;
};

type Results = {
  quizNumber: number;
  quiz: string;
  options: string[];
  correct: string;
  playerAnswers: PlayerAnswers[];
  correctRate: number;
};

export default function ResultPage({ params }: { params: { id: number } }) {
  const { isOpen, openModal, closeModal } = useModal();
  const [results, setResults] = useState<Results[]>([]);
  const [currentQuizNumber, setCurrentQuizNumber] = useState<number | null>(
    null,
  );
  const { accessToken } = useAuthStore();
  const { id } = useUserInfoStore();

  const fetchResultData = async () => {
    try {
      const result = await client.get(`/rooms/${params.id}/result`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const data: Results[] = result.data.results;
      console.log('results: ', data);
      setResults(data);
    } catch (error) {
      console.error('error', error);
    }
  };

  useEffect(() => {
    fetchResultData();
  }, [accessToken]);

  const handleOpenModal = (quizNumber: number) => {
    setCurrentQuizNumber(quizNumber);
    openModal();
  };

  return (
    <div className={styles.Container}>
      {/* <div className={styles.SideBarWrapper}>
        <div className={styles.SideBar}>
          <QuestionProgess
            questionNumber={results.length}
            totalQuestions={results.length}
            direction="column"
          />
        </div>
      </div> */}
      <div className={styles.ContentsContainer}>
        <div className={styles.ContentsBox}>
          <div className={styles.ContentsWrapper}>
            {results.map((result, index) => (
              <div className={styles.ContentsCard} key={index}>
                <span className={styles.Number}>{result.quizNumber}</span>
                <div className={styles.QuestionCard}>
                  <span className={styles.QuestionMark}>Q</span>
                  {result.quiz}
                </div>
                {result.playerAnswers
                  .filter((answer) => answer.playerId === id)
                  .map((answer) => (
                    <div
                      key={id}
                      className={
                        answer.playerAnswer === result.correct
                          ? styles.CorrectAnswerCard
                          : styles.WrongAnswerCard
                      }
                    >
                      <span
                        className={
                          answer.playerAnswer === result.correct
                            ? styles.CorrectAnswerMark
                            : styles.WrongAnswerMark
                        }
                      >
                        A
                      </span>
                      {answer.playerAnswer}
                    </div>
                  ))}
                <PercentageCircle percentage={result.correctRate} />
                <button
                  className={styles.ModalButton}
                  onClick={() => handleOpenModal(result.quizNumber)}
                >
                  <span>상세보기</span>
                  <Image
                    src="/images/arrow_right.svg"
                    height={48}
                    width={48}
                    alt="arrow"
                  />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
      {isOpen && currentQuizNumber != null ? (
        <ResultPageModal
          results={results}
          currentQuizNumber={currentQuizNumber}
          closeModal={closeModal}
        />
      ) : null}
    </div>
  );
}
