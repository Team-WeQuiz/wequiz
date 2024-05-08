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
    throw new Error('퀴즈 정보를 가져오는데 실패했습니다.');
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
  } catch (error) {
    console.error('error: ', error);
    throw new Error('Failed to start quiz');
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
