'use client';
import client from './client';
import useAuthStore from '@/app/_store/useAuthStore';

export const postRoom = async (
  name: string,
  numOfQuiz: number,
  timeLimit: number,
  playerLimitNum: number,
  code: string,
  type: string,
  files: Array<string>,
) => {
  try {
    const response = await client.post(
      '/rooms',
      {
        name,
        numOfQuiz,
        timeLimit,
        playerLimitNum,
        code,
        type,
        files,
      },
      {
        headers: {
          Authorization: `Bearer ${useAuthStore.getState().accessToken}`,
        },
      },
    );
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error('error: ', error);
  }
};
