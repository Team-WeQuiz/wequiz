import Cookies from 'js-cookie';

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

export const setAuthTokenCookie = (refreshToken: string) => {
  Cookies.set('refreshToken', refreshToken, { expires: 300 });
};
