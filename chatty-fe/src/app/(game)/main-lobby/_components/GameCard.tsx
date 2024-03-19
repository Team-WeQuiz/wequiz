import * as styles from './GameCard.css';

const GameCard = ({ title, description, participants }: GameCardProps) => {
  return (
    <div className={styles.gameCard}>
      <div className={styles.gameTitle}>{title}</div>
      <div className={styles.gameInfo}>
        <div className={styles.gameDescription}>{description}</div>
        <div className={styles.gameParticipants}>{participants}명 참여중</div>
      </div>
    </div>
  );
};

export default GameCard;
