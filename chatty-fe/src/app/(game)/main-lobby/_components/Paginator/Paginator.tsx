import * as styles from './Paginator.css';

const Paginator = ({
  currentPage,
  totalPages,
  handlePagePrev,
  handlePageNext,
}: {
  currentPage: number;
  totalPages: number;
  handlePagePrev: () => void;
  handlePageNext: () => void;
}) => {
  return (
    <div className={styles.paginator}>
      <div className={styles.previousButton}>
        {currentPage > 1 ? (
          <div
            className={styles.triangularButton}
            onClick={handlePagePrev}
          ></div>
        ) : (
          <div className={styles.emptySpace}></div>
        )}
      </div>
      <div className={styles.pageStatus}>
        {currentPage} / {totalPages}
      </div>
      <div className={styles.nextButton}>
        {currentPage < totalPages ? (
          <div
            className={styles.triangularButton}
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
