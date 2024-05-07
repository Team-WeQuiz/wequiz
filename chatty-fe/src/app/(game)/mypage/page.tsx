'use client';

import * as styles from './page.css';
import UserInfoForm from './_component/UserInfoForm/UserInfoForm';
import UserQuizList from './_component/UserQuizList/UserQuizList';

const MyPage = () => {
  return (
    <div className={styles.mypageContainer}>
      <div className={styles.contentContainer}>
        <h1 className={styles.headerText}>회원 정보</h1>
        <div className={styles.contentBox}>
          <UserInfoForm />
        </div>
      </div>
      <div className={styles.contentContainer}>
        <h1 className={styles.headerText}>나의 퀴즈</h1>
        <div className={styles.contentBox}>
          <UserQuizList />
        </div>
      </div>
      <div className={styles.contentContainer}>
        <h1 className={styles.headerText}>문의</h1>
        <div className={styles.contentBox}></div>
      </div>
    </div>
  );
};

export default MyPage;
