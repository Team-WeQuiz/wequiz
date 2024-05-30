'use client';
import React, { useEffect, useRef, useState } from 'react';
import * as styles from './page.css';
import client from '@/app/_api/client';
import useAuthStore from '@/app/_store/useAuthStore';
import useUserInfoStore from '@/app/_store/useUserInfoStore';
import PercentageCircle from './_components/PercentageCircle/PercentageCircle';
import Image from 'next/image';
import useModal from '@/app/_hooks/useModal';
import ResultPageModal from './_components/ResultPageModal/ResultPageModal';
import Footer from '@/app/_components/Footer/Footer';

type PlayerAnswers = {
  playerId: number;
  nickname: string;
  playerAnswer: string;
  marking: boolean;
  profileImage: string;
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
  const contentsWrapperRef = useRef<HTMLDivElement>(null);
  const { accessToken } = useAuthStore();
  const { id } = useUserInfoStore();

  const selectColor = (percentage: number) => {
    if (percentage <= 30) {
      return '#FF0C0C';
    } else if (percentage <= 60) {
      return '#77F359';
    } else {
      return '#51A8FF';
    }
  };

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
    if (accessToken) fetchResultData();
  }, [accessToken]);

  const handleOpenModal = (quizNumber: number) => {
    setCurrentQuizNumber(quizNumber);
    openModal();
  };

  return (
    <div className={styles.Container}>
      <div className={styles.Wrapper}>
        <div className={styles.ContentsBox}>
          <div className={styles.ContentsWrapper}>
            {results.map((result, index) => (
              <div className={styles.ContentsCard} key={index}>
                <div className={styles.CardHeader}>
                  <span className={styles.Number}>{result.quizNumber}</span>
                  <div className={styles.MobileStatsArea}>
                    <span
                      className={styles.MobileRateText}
                      style={{ color: `${selectColor(result.correctRate)}` }}
                    >
                      정답률 {result.correctRate}%
                    </span>
                    <button
                      onClick={() => handleOpenModal(result.quizNumber)}
                      className={styles.MobileModalButton}
                    >
                      <span>상세보기</span>
                      <Image
                        src="/images/arrow_right.svg"
                        height={20}
                        width={20}
                        alt="arrow"
                      />
                    </button>
                  </div>
                </div>
                <div className={styles.CardsWrapper}>
                  <div className={styles.QuestionCard}>
                    <span className={styles.QuestionMark}>Q</span>
                    <span className={styles.SpanText}>{result.quiz}</span>
                  </div>
                  {result.playerAnswers
                    .filter((answer) => answer.playerId === id)
                    .map((answer) => (
                      <div
                        key={id}
                        className={
                          answer.marking
                            ? styles.CorrectAnswerCard
                            : styles.WrongAnswerCard
                        }
                      >
                        <span
                          className={
                            answer.marking
                              ? styles.CorrectAnswerMark
                              : styles.WrongAnswerMark
                          }
                        >
                          A
                        </span>
                        <span className={styles.SpanText}>
                          {answer.playerAnswer}
                        </span>
                      </div>
                    ))}
                </div>
                <div className={styles.StatsArea}>
                  <PercentageCircle
                    color={selectColor(result.correctRate)}
                    percentage={result.correctRate}
                  />
                  <button
                    className={styles.ModalButton}
                    onClick={() => handleOpenModal(result.quizNumber)}
                  >
                    <span style={{ whiteSpace: 'nowrap' }}>상세보기</span>
                    <Image
                      src="/images/arrow_right.svg"
                      height={48}
                      width={48}
                      alt="arrow"
                    />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {currentQuizNumber != null ? (
        <ResultPageModal
          isOpen={isOpen}
          results={results}
          currentQuizNumber={currentQuizNumber}
          closeModal={closeModal}
        />
      ) : null}
      <Footer />
    </div>
  );
}
