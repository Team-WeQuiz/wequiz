import * as styles from './QuizSummaryCard.css';

const QuizSummaryCard = ({ summary }: { summary: string }) => {
  return (
    <div className={styles.summaryCard}>
      <div className={styles.summaryTextContainer}>
        <p>{summary}</p>
      </div>
    </div>
  );
};

export default QuizSummaryCard;
