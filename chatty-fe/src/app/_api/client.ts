import axios from 'axios';
const BASE_URL = 'http://localhost:8080/api';
const client = axios.create({
  baseURL: BASE_URL,
});

export default client;
