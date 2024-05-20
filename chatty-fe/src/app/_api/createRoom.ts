'use client';
import client from './client';
import useAuthStore from '@/app/_store/useAuthStore';

export const postRoom = async (
  name: string,
  description: string,
  numOfQuiz: number,
  playerLimitNum: number,
  files: File[],
) => {
  try {
    const formData: any = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('numOfQuiz', String(numOfQuiz));
    formData.append('playerLimitNum', String(playerLimitNum));
    formData.append('files', files[0], files[0].name);

    const response = await client.post('/rooms', formData, {
      headers: {
        Authorization: `Bearer ${useAuthStore.getState().accessToken}`,
        'Content-Type': 'multipart/form-data',
      },
    });

    console.log(response.data);
    return response.data;
  } catch (error: any) {
    if (error.response.data.exceptionCode > 1000)
      throw new Error(error.response.data.message);
    else throw new Error('오류가 발생했습니다.');
  }
};

export const getExistQuiz = async () => {
  try {
    const response = await client.get('/rooms/existQuiz');
    console.log(response.data);
    return response.data;
  } catch (error: any) {
    if (error.response.data.exceptionCode > 1000)
      throw new Error(error.response.data.message);
    else throw new Error('오류가 발생했습니다.');
  }
};
