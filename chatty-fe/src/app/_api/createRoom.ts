'use client';
import client from './client';
import useAuthStore from '@/app/_store/useAuthStore';

export const postRoom = async (
  name: string,
  description: string,
  numOfQuiz: number,
  playerLimitNum: number,
  code: string,
  files: File[],
) => {
  try {
    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('numOfQuiz', String(numOfQuiz));
    formData.append('playerLimitNum', String(playerLimitNum));
    formData.append('code', code);
    formData.append('description', description);

    // files를 하나씩 FormData에 추가
    files.forEach((file) => {
      formData.append(`files`, file);
    });

    const response = await client.post('/rooms', formData, {
      headers: {
        Authorization: `Bearer ${useAuthStore.getState().accessToken}`,
        'Content-Type': 'multipart/form-data',
      },
    });

    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error('error: ', error);
  }
};
