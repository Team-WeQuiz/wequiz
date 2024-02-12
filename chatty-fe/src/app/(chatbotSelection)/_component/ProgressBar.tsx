import React from 'react';
import * as styles from './styles/progressBar.css';
import Circle from '@/assets/icons/circle.svg';
import { globals } from '@/app/globals.css';

type ProgressBarProps = {
  progress: number;
};

export default function ProgressBar({ progress }: ProgressBarProps) {
  return (
    <div className={styles.wrapper}>
      <Circle
        color={progress >= 1 ? globals.color.main_2 : globals.color.main_6}
      />
      <div
        className={progress >= 2 ? styles.progressActive : styles.progress}
      />
      <Circle
        color={progress >= 2 ? globals.color.main_2 : globals.color.main_6}
      />
      <div
        className={progress >= 3 ? styles.progressActive : styles.progress}
      />
      <Circle
        color={progress >= 3 ? globals.color.main_2 : globals.color.main_6}
      />
    </div>
  );
}
