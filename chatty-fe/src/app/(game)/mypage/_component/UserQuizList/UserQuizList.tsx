'use client';

import { useState } from 'react';
import * as styles from './UserQuizList.css';
import Link from 'next/link';
import Image from 'next/image';
import Paginator from '@/app/_components/Paginator/Paginator';

const dummyData = [
  {
    id: 1,
    title: '퀴즈 제목',
    description: '퀴즈 설명',
    isMine: true,
  },
  {
    id: 2,
    title: '퀴즈 제목',
    description: '퀴즈 설명',
    isMine: false,
  },
  {
    id: 3,
    title: '퀴즈 제목',
    description: '퀴즈 설명',
    isMine: false,
  },
  {
    id: 4,
    title: '퀴즈 제목',
    description: '퀴즈 설명',
    isMine: false,
  },
  {
    id: 5,
    title: '퀴즈 제목',
    description: '퀴즈 설명',
    isMine: true,
  },
  {
    id: 6,
    title: '퀴즈 제목',
    description: '퀴즈 설명',
    isMine: false,
  },
  {
    id: 7,
    title: '퀴즈 제목',
    description: '퀴즈 설명',
    isMine: true,
  },
  {
    id: 8,
    title: '퀴즈 제목',
    description: '퀴즈 설명',
    isMine: false,
  },
];

const UserQuizList = () => {
  const [pageNum, setPageNum] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const handlePagePrev = () => {
    if (pageNum > 1) {
      setPageNum(pageNum - 1);
    }
  };

  const handlePageNext = () => {
    setPageNum(pageNum + 1);
  };

  return (
    <div className={styles.quizListContainer}>
      <div className={styles.quizListGrid}>
        {dummyData &&
          dummyData.map((quiz, index) => (
            <Link key={index} href="" className={styles.quizCard}>
              <div className={styles.quizTitle}>
                {quiz.isMine && (
                  <Image
                    src={'/images/leader.svg'}
                    alt={'owner'}
                    width={19}
                    height={19}
                  />
                )}
                {quiz.title}
              </div>
              <div className={styles.quizDescription}>{quiz.description}</div>
            </Link>
          ))}
      </div>
      <div className={styles.paginatorWrapper}>
        <Paginator
          currentPage={pageNum}
          totalPages={totalPages}
          handlePagePrev={handlePagePrev}
          handlePageNext={handlePageNext}
          color="blue"
        />
      </div>
    </div>
  );
};

export default UserQuizList;
