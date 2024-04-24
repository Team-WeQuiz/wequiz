import * as styles from './GameCard.css';
import Image from 'next/image';
import { RoomInfo } from '../GameListGrid/GameListGrid';
import { useRouter } from 'next/navigation';

const GameCard = ({
  roomId,
  name,
  description,
  currentPlayers,
  maxPlayers,
}: RoomInfo) => {
  const router = useRouter();
  return (
    <div
      className={`${styles.gameCard} ${styles.gameCardHover}`}
      onClick={() => router.push(`/waiting-room/${roomId}`)}
    >
      <div className={styles.gameTitle}>{name}</div>
      <div className={styles.gameInfo}>
        <div className={styles.gameDescription}>{description}</div>
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
    </div>
  );
};

export default GameCard;
