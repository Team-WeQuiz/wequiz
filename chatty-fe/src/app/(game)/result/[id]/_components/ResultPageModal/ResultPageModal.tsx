import useUserInfoStore from '@/app/_store/useUserInfoStore';
import React, { useEffect, useState } from 'react';
import * as styles from './ResultPageModal.css';
import useModal from '@/app/_hooks/useModal';
import Image from 'next/image';

type PlayerAnswers = {
  playerId: number;
  nickname: string;
  playerAnswer: string;
  marking: boolean;
  correction: boolean;
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

type ResultPageModalProps = {
  results: Results[];
  currentQuizNumber: number;
  closeModal: () => void;
};

export default function ResultPageModal({
  results,
  currentQuizNumber,
  closeModal,
}: ResultPageModalProps) {
  const { id } = useUserInfoStore();
  const [answer, setAnswer] = useState<Results>();
  const getQuiz = (quizNum: number) => {
    return results.find((answer) => answer.quizNumber === quizNum);
  };
  const findMyAnswer = () => {
    return answer?.playerAnswers.find((answer) => answer.playerId === id)
      ?.playerAnswer;
  };

  const checkAnswer = () => {
    return answer?.correct === findMyAnswer();
  };

  const selectColor = (percentage: number) => {
    if (percentage <= 30) {
      return '#FF0C0C';
    } else if (percentage <= 60) {
      return '#77F359';
    } else {
      return '#51A8FF';
    }
  };

  useEffect(() => {
    const data = getQuiz(currentQuizNumber);
    if (data) {
      // 각 playerAnswer에 대해 정답 여부를 확인하고 correction 속성을 추가
      const updatedPlayerAnswers = data.playerAnswers.map((playerAnswer) => ({
        ...playerAnswer,
        correction: playerAnswer.playerAnswer === data.correct,
      }));
      // answer 상태를 업데이트
      setAnswer({ ...data, playerAnswers: updatedPlayerAnswers });
    }
    console.log(answer);
  }, [currentQuizNumber, results]);

  return (
    <div className={styles.ModalBackground} onClick={closeModal}>
      <div className={styles.Modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.Container}>
          <div className={styles.Title}>
            <h1 className={styles.Number}>{currentQuizNumber}.</h1>
            <span style={{ fontSize: 36 }}>
              전체 참여자 중{' '}
              <span
                style={{
                  fontSize: 36,
                  color: `${selectColor(answer?.correctRate || 0)}`,
                }}
              >
                {answer?.correctRate}%
              </span>
              가 맞췄어요!
            </span>
          </div>
          <div className={styles.Wrapper}>
            <div className={styles.Card}>
              <span className={styles.QuestionMark}>Q</span>
              <span>{answer?.quiz}</span>
            </div>
            <div className={styles.AnswerContainer}>
              <div className={styles.AnswerWrapper}>
                <span className={styles.QuestionMark}>A</span>
                <span>{answer?.correct}</span>
              </div>
              <div className={styles.MyAnswerWrapper}>
                <div className={styles.Description}>
                  <span>내가 쓴 답변</span>
                </div>
                <div
                  className={
                    checkAnswer()
                      ? styles.CorrectAnswerCard
                      : styles.WrongAnswerCard
                  }
                >
                  <span
                    className={
                      checkAnswer()
                        ? styles.CorrectAnswerMark
                        : styles.WrongAnswerMark
                    }
                  >
                    A
                  </span>
                  <span>{findMyAnswer()}</span>
                </div>
              </div>
            </div>
          </div>
          <div className={styles.Wrapper}>
            <div className={styles.UserWrapper}>
              <div className={styles.Description}>
                <span>전체 참여자 답변</span>
              </div>
              {answer?.playerAnswers.map((answer, index) => (
                <div
                  key={index}
                  className={
                    answer.correction
                      ? styles.CorrectAnswerCard
                      : styles.WrongAnswerCard
                  }
                >
                  <div className={styles.ProfileWrapper}>
                    <div className={styles.ImageWrapper}>
                      <Image
                        src={answer.profileImage || '/images/logo.svg'}
                        alt="profile"
                        width={40}
                        height={40}
                      />
                    </div>
                    <span>{answer.nickname}</span>
                  </div>

                  <span>{answer.playerAnswer}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
