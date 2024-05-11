import client from './client';

export const getQuizInfo = async (id: number, accessToken: string) => {
  try {
    const response = await client.get(`rooms/${id}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error: any) {
    if (error.response.data.exceptionCode > 1000) {
      throw new Error(error.response.data.message);
    } else {
      console.error('error: ', error);
      throw new Error(error);
    }
  }
};

export const startQuiz = async (id: number, token: string) => {
  try {
    const response = await client.post(
      `rooms/${id}/start`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return response.data;
  } catch (error: any) {
    console.error('error: ', error);
    throw new Error(error);
  }
};

export const getUsersQuiz = async (pageNum: number, token: string) => {
  try {
    const response = await client.get(
      `users/participated-rooms?page=${pageNum}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return response.data;
  } catch (error) {
    console.error('error: ', error);
    throw new Error('Failed to get user quiz');
  }
};
