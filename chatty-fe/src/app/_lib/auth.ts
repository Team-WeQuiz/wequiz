import axios from 'axios';

export const kakaoInit = () => {
  if (window.Kakao && !window.Kakao.isInitialized()) {
    window.Kakao.init(process.env.NEXT_PUBLIC_KAKAO_JS_KEY);
    console.log(window.Kakao.isInitialized());
  }
};

export const kakaoLogin = (redirectUri: string) => {
  if (window.Kakao && window.Kakao.isInitialized()) {
    window.Kakao.Auth.authorize({
      redirectUri: redirectUri,
    });
  } else {
    console.error("Kakao SDK hasn't been initialized.");
  }
};

export const googleLogin = (redirectUri: string) => {
  window.location.href =
    `https://accounts.google.com/o/oauth2/auth?client_id=${process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}&` +
    `redirect_uri=${redirectUri}&` +
    'response_type=code&' +
    'scope=email profile';
};

export const authHandler = async (data: object, url: string) => {
  try {
    const response = await axios.post(url, data);
    const { accessToken, refreshToken } = response.data;
    if (accessToken && refreshToken) {
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
    }
    console.log(response);
    window.location.href = 'http://localhost:3000/main-lobby';
  } catch (error) {
    console.error(error);
  }
};
