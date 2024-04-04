import { getSecretKeys } from '../_api/auth';

export const getGoogleKeys = async () => {
  const data = await getSecretKeys();
  return data.GOOGLE_CLIENT_ID;
};

export const getKakaoKeys = async () => {
  const data = await getSecretKeys();
  return data.KAKAO_JS_KEY;
};

export const getAWSAccessKeys = async () => {
  const data = await getSecretKeys();
  const accessKey = data.AWS_ACCESS_KEY;
  const secretAccessKey = data.AWS_SECRET_KEY;
  return { accessKey, secretAccessKey };
};
