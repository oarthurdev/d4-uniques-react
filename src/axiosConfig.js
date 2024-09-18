import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NODE_ENV === 'production' 
  ? process.env.BASE_URL_PROD 
  : process.env.BASE_URL
});

export default api;
