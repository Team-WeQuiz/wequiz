import useUserInfoStore from '@/app/_store/useUserInfoStore';
import React, { useEffect, useState } from 'react';
import * as styles from './ResultPageModal.css';
import useModal from '@/app/_hooks/useModal';
import Image from 'next/image';
import Modal from '@/app/_components/Modal/Modal';

type PlayerAnswers = {
  playerId: number;
  nickname: string;
  playerAnswer: string;
  marking: boolean;
  profileImage: string | null;
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
  isOpen: boolean;
  results: Results[];
  currentQuizNumber: number;
  closeModal: () => void;
};

export default function ResultPageModal({
  isOpen,
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
    return answer?.playerAnswers.find((answer) => answer.playerId === id)
      ?.marking;
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
    <Modal isOpen={isOpen} onClose={closeModal}>
      <div className={styles.Container}>
        <div className={styles.Title}>
          <h1 className={`${styles.Number} ${styles.TitleText}`}>
            {currentQuizNumber}.
          </h1>
          <span className={styles.TitleText}>
            전체 참여자 중{' '}
            <span
              style={{
                color: `${selectColor(answer?.correctRate || 0)}`,
              }}
              className={styles.TitleText}
            >
              {answer?.correctRate}%
            </span>
            가 맞췄어요!
          </span>
        </div>
        <div className={styles.Wrapper}>
          <div className={`${styles.Card} ${styles.comparingCard}`}>
            <span className={styles.QuestionMark}>Q</span>
            <span>{answer?.quiz}</span>
          </div>
          <div className={`${styles.AnswerContainer} ${styles.comparingCard}`}>
            <div className={styles.AnswerWrapper}>
              <span className={styles.QuestionMark}>A</span>
              <span>{answer?.correct}</span>
            </div>
            <hr className={styles.divider} />
            <div className={styles.MyAnswerWrapper}>
              <div className={styles.Description}>
                <span>내가 쓴 답변</span>
              </div>
              <div
                className={`${
                  checkAnswer()
                    ? styles.CorrectAnswerCard +
                      ' ' +
                      styles.myAnswerCardCorrect
                    : styles.WrongAnswerCard + ' ' + styles.myAnswerCardWrong
                }`}
              >
                <span className={styles.answer}>
                  {findMyAnswer() || '(빈 답안)'}
                </span>
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
                  answer.marking
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
                  <span className={styles.nickname}>{answer.nickname}</span>
                </div>
                <span className={styles.answer}>{answer.playerAnswer}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Modal>
  );
}
