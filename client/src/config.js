import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://127.0.0.1:8000',
});

const axiosProduction = axios.create({
  baseURL: 'https://comp9900-production.up.railway.app',
});

export { axiosInstance, axiosProduction };
