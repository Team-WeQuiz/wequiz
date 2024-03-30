'use client';

import { useState, useEffect } from 'react';
import { getQuiz } from '@/app/_api/quiz';

const QuizRoom = ({ params }: { params: { roomId: number } }) => {
  const [quizData, setQuizData] = useState();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getQuiz(params.roomId);
        setQuizData(response);
      } catch (error) {
        console.error('error: ', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <h1>Quiz Room</h1>
      <p>{quizData}</p>
    </div>
  );
};

export default QuizRoom;
