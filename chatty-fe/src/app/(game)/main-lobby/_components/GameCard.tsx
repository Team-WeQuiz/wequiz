import * as styles from './GameCard.css';
import Image from 'next/image';

type GameCardProps = {
  title: string;
  description: string;
  participants: number;
};

const GameCard = ({ title, description, participants }: GameCardProps) => {
  return (
    <div className={`${styles.gameCard} ${styles.gameCardHover}`}>
      <div className={styles.gameTitle}>{title}</div>
      <div className={styles.gameInfo}>
        <div className={styles.gameDescription}>{description}</div>
        <div className={styles.gameParticipants}>
          <Image
            src="/images/Participant.svg"
            width={24}
            height={24}
            alt="participant"
          />
          <div className={styles.partNum}>{participants}/8</div>
        </div>
      </div>
      <div className={styles.overlay}>join!</div>
    </div>
  );
};

export default GameCard;
