import { getAWSKeys } from '../_api/auth';

export const getGoogleKeys = async () => {
  const data = await getAWSKeys();
  return data.GOOGLE_CLIENT_ID;
};

export const getKakaoKeys = async () => {
  const data = await getAWSKeys();
  return data.KAKAO_JS_KEY;
};

export const getAWSAccessKeys = async () => {
  const data = await getAWSKeys();
  const accessKey = data.AWS_ACCESS_KEY;
  const secretAccessKey = data.AWS_SECRET_KEY;
  return { accessKey, secretAccessKey };
};
