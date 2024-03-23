import client from './client';

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
    const response = await client.post('/rooms', {
      name,
      numOfQuiz,
      timeLimit,
      playerLimitNum,
      code,
      type,
      files,
    });
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error('error: ', error);
  }
};
