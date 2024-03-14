import React from 'react';
import * as styles from './ContentsBox.css';
import Image from 'next/image';
type ContentsBoxProps = {
  imgSrc: string;
  title: string;
};
export default function ContentsBox({ imgSrc, title }: ContentsBoxProps) {
  return (
    <div className={styles.container}>
      <Image src={imgSrc} width={24} height={24} alt="image" />
      <div className={styles.title}>{title}</div>
    </div>
  );
}
