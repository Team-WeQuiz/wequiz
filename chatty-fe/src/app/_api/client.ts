import axios from 'axios';
const BASE_URL = 'https://api.wequiz.kr';
const client = axios.create({
  baseURL: BASE_URL,
});

export default client;
