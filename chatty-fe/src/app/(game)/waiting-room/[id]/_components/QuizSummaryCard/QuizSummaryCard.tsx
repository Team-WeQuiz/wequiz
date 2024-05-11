import * as styles from './QuizSummaryCard.css';
import { useEffect, useState } from 'react';

const QuizSummaryCard = ({ summary }: { summary: string }) => {
  const [text, setText] = useState<string>('');
  const [count, setCount] = useState<number>(0);

  useEffect(() => {
    if (!summary) return;
    let i = 0;
    const interval = setInterval(() => {
      setText((prevText) => {
        let newText = '';
        newText = prevText + summary[i];
        i++;
        return newText;
      });
      if (i === summary.length - 1) {
        clearInterval(interval);
      }
    }, 70);
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
