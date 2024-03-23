import client from './client';

export const postKakaoLogin = async (code: string) => {
  try {
    const response = await client.post('oauth/kakao/signIn', {
      code: code,
    });
    console.log(response);
    return response.data;
  } catch (error) {
    console.error('error: ', error);
    throw new Error('Login failed');
  }
};

export const postGoogleLogin = async (code: string) => {
  const decoded = decodeURI(code);
  try {
    const response = await client.post('oauth/google/signIn', {
      code: decoded,
    });
    console.log(response);
    return response.data;
  } catch (error) {
    console.error('error: ', error);
    throw new Error('Login failed');
  }
};

export const postSignUp = async (data: object) => {
  try {
    const response = await client.post('auth/signUp', data);
    console.log(response);
    return response.data;
  } catch (error) {
    console.error('error: ', error);
    throw new Error('Signup failed');
  }
};

export const postSignIn = async (data: object) => {
  try {
    const response = await client.post('auth/signIn', data);
    console.log(response);
    return response.data;
  } catch (error) {
    console.error('error: ', error);
    throw new Error('Signin failed');
  }
};
