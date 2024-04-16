'use client';
import QuestionProgess from './_components/QuestionProgress/QuestionProgess';
import QuestionArea from './_components/QuestionArea/QuestionArea';
import AnswerArea from './_components/AnswerArea/AnswerArea';
import * as styles from './page.css';
import GradButton from '@/app/_components/GradButton';
import MyProfile from './_components/MyProfile/MyProfile';
import UserGrid from './_components/UserGrid/UserGrid';
import RoundProgress from './_components/RoundProgress/RoundProgress';
const QuizRoom = () => {
  return (
    <div className={styles.Main}>
      <div className={styles.MainContainer}>
        <RoundProgress round={4} totalRounds={4} />

        <div className={styles.Container}>
          <div className={styles.ContentsWrapper}>
            <div className={styles.Navigation}>
              <div className={styles.RoundWrapper}>Round 2</div>
              <QuestionProgess questionNumber={3} totalQuestions={5} />
            </div>

            <div className={styles.QuestionContainer}>
              <QuestionArea
                contents={
                  '반갑습니다 문제입니다반갑습니다 문제입니다반갑습니다 문제입니다반갑습니다 문제입니다반갑습니다 문제입니다반갑습니다 문제입니다반갑습니다 문제입니다반갑습니다 문제입니다반갑습니다 문제입니다반갑습니다 문제입니다반갑습니다 문제입니다반갑습니다 문제입니다반갑습니다 문제입니다반갑습니다 문제입니다반갑습니다 문제입니다반갑습니다 문제입니다반갑습니다 문제입니다반갑습니다 문제입니다반갑습니다 문제입니다'
                }
              />
              <AnswerArea />
            </div>
          </div>
          <div className={styles.ButtonWrapper}>
            <GradButton rounded color={'primary'} fullWidth>
              제 출
            </GradButton>
          </div>
        </div>
      </div>
      <div className={styles.UserContainer}>
        <MyProfile />
        <UserGrid userCount={6} />
      </div>
    </div>
  );
};

export default QuizRoom;
