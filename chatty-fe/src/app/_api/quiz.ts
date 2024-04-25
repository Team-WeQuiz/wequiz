import client from './client';

export const getQuizInfo = async (id: number, accessToken: string) => {
  try {
    const response = await client.get(`rooms/${id}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('error: ', error);
    throw new Error('Failed to get quiz info');
  }
};

export const getQuiz = async (id: number) => {
  try {
    const response = await client.get(`rooms/${id}/quiz`);
    return response.data;
  } catch (error) {
    console.error('error: ', error);
    throw new Error('Failed to get quiz data');
  }
};
