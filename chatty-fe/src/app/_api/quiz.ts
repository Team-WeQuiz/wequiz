import client from './client';

export const getQuizInfo = async (id: number) => {
  try {
    const response = await client.get(`rooms/${id}`);
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
