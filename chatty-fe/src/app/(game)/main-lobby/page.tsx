import React from 'react';
import * as styles from './page.css';

const MainLobby = () => {
  return (
    <div className={styles.lobbyContainer}>
      <h1>Main Lobby</h1>
      <div className={styles.gameListGrid}>
        <div
          style={{ width: '100%', height: '120px', backgroundColor: 'skyblue' }}
        >
          Game 1
        </div>
        <div
          style={{ width: '100%', height: '120px', backgroundColor: 'skyblue' }}
        >
          Game 2
        </div>
        <div
          style={{ width: '100%', height: '120px', backgroundColor: 'skyblue' }}
        >
          Game 3
        </div>
      </div>
    </div>
  );
};

export default MainLobby;
