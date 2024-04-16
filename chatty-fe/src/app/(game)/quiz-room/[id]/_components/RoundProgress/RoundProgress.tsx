import React from 'react';
import * as styles from './RoundProgress.css';
import Image from 'next/image';

type RoundProgressProps = {
  round: number;
  totalRounds: number;
};

export default function RoundProgress({
  round,
  totalRounds,
}: RoundProgressProps) {
  return (
    <div className={styles.Container}>
      {Array.from({ length: totalRounds }, (_, index) =>
        index === 0 ? (
          <div className={styles.ImageWrapper} key={index}>
            <Image
              src={'/images/progress-arrow-fill-start.svg'}
              alt="progress-arrow"
              width={0}
              height={0}
              style={{ width: '100%', height: '100%' }}
            />
          </div>
        ) : index === totalRounds - 1 && round === totalRounds ? (
          <div className={styles.ImageWrapper} key={index}>
            <Image
              src={'/images/progress-arrow-fill-last.svg'}
              alt="progress-arrow"
              width={0}
              height={0}
              style={{ width: '100%', height: '100%' }}
            />
          </div>
        ) : index === totalRounds - 1 && round !== totalRounds ? (
          <div className={styles.ImageWrapper} key={index}>
            <Image
              src={'/images/progress-arrow-blank-last.svg'}
              alt="progress-arrow"
              width={0}
              height={0}
              style={{ width: '100%', height: '100%' }}
            />
          </div>
        ) : index + 1 <= round ? (
          <div className={styles.ImageWrapper} key={index}>
            <Image
              src={'/images/progress-arrow-fill.svg'}
              alt="progress-arrow"
              width={0}
              height={0}
              style={{ width: '100%', height: '100%' }}
            />
          </div>
        ) : (
          <div className={styles.ImageWrapper} key={index}>
            <Image
              src={'/images/progress-arrow-blank.svg'}
              alt="progress-arrow"
              width={0}
              height={0}
              style={{ width: '100%', height: '100%' }}
            />
          </div>
        ),
      )}
    </div>
  );
}
