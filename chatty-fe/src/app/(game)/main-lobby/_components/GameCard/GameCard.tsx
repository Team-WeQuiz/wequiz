import * as styles from './GameCard.css';
import Image from 'next/image';
import { RoomInfo } from '../GameListGrid/GameListGrid';
import Link from 'next/link';

const GameCard = ({
  roomId,
  name,
  description,
  currentPlayers,
  maxPlayers,
}: RoomInfo) => {
  return (
    <Link
      href={`localhost:3000/enter-room/${roomId}`}
      className={`${styles.gameCard} ${styles.gameCardHover}`}
    >
      <div className={`${styles.gameTitle} ${styles.textEllipsis}`}>{name}</div>
      <div className={styles.gameInfo}>
        <div className={`${styles.gameDescription} ${styles.textEllipsis}`}>
          {description}
        </div>
        <div className={styles.gameParticipants}>
          <Image
            src="/images/Participant.svg"
            width={24}
            height={24}
            alt="participant"
          />
          <div className={styles.partNum}>
            {currentPlayers} / {maxPlayers}
          </div>
        </div>
      </div>
      <div className={styles.overlay}>join!</div>
    </Link>
  );
};

export default GameCard;
