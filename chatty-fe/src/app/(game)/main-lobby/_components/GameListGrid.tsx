import GameCard from './GameCard';
import * as styles from './GameListGrid.css';

const GameList = [
  {
    title: 'Game 1',
    description: 'This is game 1',
    participants: 3,
  },
  {
    title: 'Game 2',
    description: 'This is game 2',
    participants: 5,
  },
  {
    title: 'Game 3',
    description: 'This is game 3',
    participants: 2,
  },
  {
    title: 'Game 4',
    description: 'This is game 4',
    participants: 4,
  },
  {
    title: 'Game 5',
    description: 'This is game 5',
    participants: 1,
  },
  {
    title: 'Game 6',
    description: 'This is game 6',
    participants: 6,
  },
  {
    title: 'Game 7',
    description: 'This is game 7',
    participants: 3,
  },
  {
    title: 'Game 8',
    description: 'This is game 8',
    participants: 5,
  },
  {
    title: 'Game 9',
    description: 'This is game 9',
    participants: 2,
  },
  {
    title: 'Game 10',
    description: 'This is game 10',
    participants: 4,
  },
  {
    title: 'Game 11',
    description: 'This is game 11',
    participants: 1,
  },
  {
    title: 'Game 12',
    description: 'This is game 12',
    participants: 6,
  },
  {
    title: 'Game 13',
    description: 'This is game 13',
    participants: 3,
  },
  {
    title: 'Game 14',
    description: 'This is game 14',
    participants: 5,
  },
  {
    title: 'Game 15',
    description: 'This is game 15',
    participants: 2,
  },
];

const GameListGrid = () => {
  return (
    <div className={styles.gameListContainer}>
      <div className={styles.gameListGrid}>
        {GameList.map((game, index) => (
          <GameCard
            key={index}
            title={game.title}
            description={game.description}
            participants={game.participants}
          />
        ))}
      </div>
    </div>
  );
};

export default GameListGrid;
