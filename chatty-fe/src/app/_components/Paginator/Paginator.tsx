import * as styles from './Paginator.css';

const Paginator = ({
  currentPage,
  totalPages,
  handlePagePrev,
  handlePageNext,
  color,
}: {
  currentPage: number;
  totalPages: number;
  handlePagePrev: () => void;
  handlePageNext: () => void;
  color?: string;
}) => {
  return (
    <div className={styles.paginator}>
      <div className={styles.previousButton}>
        {currentPage > 1 ? (
          <div
            className={`${styles.triangularButton} ${color === 'blue' && styles.blueButton}`}
            onClick={handlePagePrev}
          ></div>
        ) : (
          <div className={styles.emptySpace}></div>
        )}
      </div>
      <div
        className={`${styles.pageStatus} ${color === 'blue' && styles.blueText}`}
      >
        {currentPage} / {totalPages}
      </div>
      <div className={styles.nextButton}>
        {currentPage < totalPages ? (
          <div
            className={`${styles.triangularButton} ${color === 'blue' && styles.blueButton}`}
            onClick={handlePageNext}
          ></div>
        ) : (
          <div className={styles.emptySpace}></div>
        )}
      </div>
    </div>
  );
};

export default Paginator;
