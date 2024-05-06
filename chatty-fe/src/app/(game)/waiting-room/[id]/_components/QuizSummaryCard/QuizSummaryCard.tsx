import * as styles from './QuizSummaryCard.css';
import { useEffect, useState } from 'react';

const QuizSummaryCard = ({ summary }: { summary: string }) => {
  const [text, setText] = useState<string>('');

  useEffect(() => {
    if (!summary) return;
    let i = 0;
    const interval = setInterval(() => {
      if (summary[i] !== undefined) {
        setText((prev: string) => prev + summary[i]);
        i++;
      }
      if (i === summary.length - 1) {
        clearInterval(interval);
      }
    }, 50);
    return () => clearInterval(interval);
  }, [summary]);

  return (
    <div className={styles.summaryCard}>
      <h2 className={styles.header}>문서 요약</h2>
      <div className={styles.summaryTextContainer}>
        {summary ? (
          <p className={styles.summaryText}>{text}</p>
        ) : (
          <p className={`${styles.blinkingText} ${styles.summaryText}`}>
            문서 요약을 불러오는 중 입니다.
          </p>
        )}
      </div>
    </div>
  );
};

export default QuizSummaryCard;
