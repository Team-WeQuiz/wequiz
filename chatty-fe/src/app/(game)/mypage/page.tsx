'use client';

import { useState } from 'react';
import * as styles from './page.css';
import UserInfoForm from './_component/UserInfoForm/UserInfoForm';
import UserQuizList from './_component/UserQuizList/UserQuizList';

const MyPage = () => {
  const [tabIndex, setTabIndex] = useState<number>(0);

  return (
    <div className={styles.mypageContainer}>
      <div className={styles.mobileTab}>
        <h1
          className={`${styles.tabText} ${tabIndex === 0 && styles.tabTextActive}`}
          onClick={() => setTabIndex(0)}
        >
          회원 정보
        </h1>
        <h1
          className={`${styles.tabText} ${tabIndex === 1 && styles.tabTextActive}`}
          onClick={() => setTabIndex(1)}
        >
          나의 퀴즈
        </h1>
        <h1
          className={`${styles.tabText} ${tabIndex === 2 && styles.tabTextActive}`}
          onClick={() => setTabIndex(2)}
        >
          문의
        </h1>
      </div>
      <div
        className={`${styles.contentContainer} ${tabIndex !== 0 && styles.mobileHidden}`}
      >
        <h1 className={styles.headerText}>회원 정보</h1>
        <div className={styles.contentBox}>
          <UserInfoForm />
        </div>
      </div>
      <div
        className={`${styles.contentContainer} ${tabIndex !== 1 && styles.mobileHidden}`}
      >
        <h1 className={styles.headerText}>나의 퀴즈</h1>
        <div className={styles.contentBox}>
          <UserQuizList />
        </div>
      </div>
      <div
        className={`${styles.contentContainer} ${tabIndex !== 2 && styles.mobileHidden}`}
      >
        <h1 className={styles.headerText}>문의</h1>
        <div className={styles.contentBox}></div>
      </div>
    </div>
  );
};

export default MyPage;
