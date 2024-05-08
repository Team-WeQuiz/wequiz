import axios from 'axios';
import client from './client';
import Cookies from 'js-cookie';

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

export const postRefreshToken = async (refreshToken: string) => {
  try {
    const response = await client.post('auth/refresh', {
      refreshToken,
    });
    //console.log(response);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      // 토큰이 변형되었을 경우
      if (
        error.response?.data.exceptionCode === 1005 ||
        error.response?.data.exceptionCode === 1001
      ) {
        Cookies.remove('refreshToken');
        alert('토큰에 문제 발생. 다시 로그인');
        location.reload();
      }
    } else {
      console.error(error);
    }
  }
};

export const getUserInfo = async (accessToken: string) => {
  try {
    const response = await client.get('/user', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('error: ', error);
    throw new Error('Get user info failed');
  }
};

export const getSecretKeys = async () => {
  try {
    const response = await axios.get('https://wequiz/api/s3-keys/getSecrets');
    return response.data;
  } catch (error) {
    console.error('error: ', error);
    throw new Error('Get AWS keys failed');
  }
};
