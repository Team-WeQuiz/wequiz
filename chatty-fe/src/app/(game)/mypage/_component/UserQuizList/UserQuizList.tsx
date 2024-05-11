'use client';

import { useEffect, useState } from 'react';
import * as styles from './UserQuizList.css';
import Link from 'next/link';
import Image from 'next/image';
import Paginator from '@/app/_components/Paginator/Paginator';
import useAuthStore from '@/app/_store/useAuthStore';
import { getUsersQuiz } from '@/app/_api/quiz';

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

type MyQuiz = {
  roomId: number;
  name: string;
  description: string;
};

const UserQuizList = () => {
  const [pageNum, setPageNum] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [quizList, setQuizList] = useState<MyQuiz[]>([]);
  const { accessToken } = useAuthStore();
  const [stateMessage, setStateMessage] =
    useState('데이터를 불러오는 중 입니다');

  useEffect(() => {
    console.log('accessToken: ', accessToken);
    const fetchData = async () => {
      try {
        const response = await getUsersQuiz(pageNum, accessToken);
        setTotalPages(response.totalPages);
        if (response.rooms.length === 0) {
          setStateMessage('아직 참여한 퀴즈가 없습니다.');
        }
        setQuizList(response.rooms);
      } catch (error) {
        console.error('error: ', error);
        setStateMessage('데이터를 불러오지 못했습니다.');
      }
    };
    if (accessToken) fetchData();
  }, [pageNum, accessToken]);

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
      {quizList.length !== 0 ? (
        <>
          <div className={styles.quizListGrid}>
            {quizList.map((quiz, index) => (
              <Link
                key={index}
                href={`/result/${quiz.roomId}`}
                className={styles.quizCard}
              >
                <div className={styles.quizTitle}>{quiz.name}</div>
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
        </>
      ) : (
        <p>{stateMessage}</p>
      )}
    </div>
  );
};

export default UserQuizList;
