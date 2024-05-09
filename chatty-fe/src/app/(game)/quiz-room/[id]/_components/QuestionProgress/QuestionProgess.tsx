import Image from 'next/image';
import React from 'react';
import * as styles from './QuestionProgress.css';

type QuestionProgressProps = {
  questionNumber: number;
  totalQuestions: number;
  direction?: string;
};

export default function QuestionProgess({
  questionNumber,
  totalQuestions,
  direction,
}: QuestionProgressProps) {
  return (
    <div
      className={direction === 'column' ? styles.WrapperColumn : styles.Wrapper}
    >
      {Array.from({ length: totalQuestions }, (_, index) => (
        <div className={styles.Container} key={index}>
          {index + 1 <= questionNumber ? (
            <>
              <Image
                key={index}
                src="/images/progress_round_blue.svg"
                alt="progress_round_grey"
                width={52}
                height={52}
              />
              <span className={styles.TextBlue}>{index + 1}</span>
            </>
          ) : (
            <>
              <Image
                key={index}
                src="/images/progress_round_grey.svg"
                alt="progress_round_grey"
                width={52}
                height={52}
              />
              <span className={styles.TextGrey}>{index + 1}</span>
            </>
          )}
        </div>
      ))}
    </div>
  );
}
