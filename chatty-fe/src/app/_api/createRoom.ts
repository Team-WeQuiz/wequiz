'use client';
import client from './client';
import useAuthStore from '@/app/_store/useAuthStore';

export const postRoom = async (
  name: string,
  description: string,
  numOfQuiz: number,
  playerLimitNum: number,
  files?: File[] | null,
  existDocId?: string | null,
) => {
  try {
    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('numOfQuiz', String(numOfQuiz));
    formData.append('playerLimitNum', String(playerLimitNum));
    if (files) formData.append('files', files[0], files[0].name);
    if (existDocId) formData.append('existQuizDocId', existDocId);

    const response = await client.post('/rooms', formData, {
      headers: {
        Authorization: `Bearer ${useAuthStore.getState().accessToken}`,
        'Content-Type': 'multipart/form-data',
      },
    });

    if (!response || !response.data) {
      throw new Error('응답이 유효하지 않습니다.');
    }

    console.log(response.data);
    return response.data;
  } catch (error: any) {
    console.error('API 호출 중 오류 발생:', error);
    if (
      error.response &&
      error.response.data &&
      error.response.data.exceptionCode > 1000
    ) {
      throw new Error(error.response.data.message);
    } else {
      throw new Error('오류가 발생했습니다.');
    }
  }
};

export const getExistQuiz = async () => {
  try {
    const response = await client.get('/rooms/existQuiz', {
      headers: {
        Authorization: `Bearer ${useAuthStore.getState().accessToken} `,
      },
    });
    console.log(response);
    console.log(response.data);
    return response.data;
  } catch (error: any) {
    if (error.response.data.exceptionCode > 1000)
      throw new Error(error.response.data.message);
    else throw new Error('오류가 발생했습니다.');
  }
};
