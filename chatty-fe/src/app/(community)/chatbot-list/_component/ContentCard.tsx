import React from 'react';
import * as styles from './style/contentcard.css';

type CardProps = {
  children: React.ReactNode;
  styleClassName?: string;
};

const ContentCard = ({ children, styleClassName }: CardProps) => {
  return <div className={`${styles.card} ${styleClassName}`}>{children}</div>;
};

export default ContentCard;
