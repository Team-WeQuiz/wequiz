import React from 'react';
import * as styles from './styles/footer.css';
import Image from 'next/image';

export default function Footer() {
  return (
    <div className={styles.container}>
      <div className={styles.contentsWrapper}>
        <Image src="images/chatty.svg" width={132} height={40} alt="logo" />
        <div className={styles.contentsSection}>
          <div className={styles.productWrapper}>
            <h1>product</h1>
            <h2>서비스 소개</h2>
            <h2>공지사항</h2>
            <h2>자주 묻는 질문</h2>
          </div>
          <div className={styles.productWrapper}>
            <h1>contact</h1>
            <h2>help@chatty.com</h2>
            <h2>0100101010</h2>
          </div>
        </div>
      </div>
      <p className={styles.copyright}>
        Copyrights © Chatty. All rights reserved.
      </p>
    </div>
  );
}
