import Cookies from 'js-cookie';
import { getGoogleKeys, getKakaoKeys } from './keys';

export const kakaoInit = async () => {
  try {
    const KAKAO_JS_KEY = await getKakaoKeys();
    if (window.Kakao && !window.Kakao.isInitialized()) {
      window.Kakao.init(KAKAO_JS_KEY);
      console.log(window.Kakao.isInitialized());
    }
  } catch (error) {
    console.error('Kakao SDK initialization failed:', error);
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

export const googleLogin = async (redirectUri: string) => {
  try {
    const GOOGLE_CLEINT_ID = await getGoogleKeys();
    window.location.href =
      `https://accounts.google.com/o/oauth2/auth?client_id=${GOOGLE_CLEINT_ID}&` +
      `redirect_uri=${redirectUri}&` +
      'response_type=code&' +
      'scope=email profile';
  } catch (error) {
    console.error('Google SDK initialization failed:', error);
  }
};

export const setAuthTokenCookie = (refreshToken: string) => {
  Cookies.set('refreshToken', refreshToken, { expires: 300 });
};
