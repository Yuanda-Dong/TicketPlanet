import axios from 'axios';
// console.log(process.env.REACT_APP_API_MODE);
const url =
  process.env.REACT_APP_API_MODE === 'production'
    ? 'https://comp9900-production.up.railway.app'
    : 'http://127.0.0.1:8000';
const axiosInstance = axios.create({
  baseURL: url,
});

// const axiosProduction = axios.create({
//   baseURL: 'https://comp9900-production.up.railway.app',
// });

export { axiosInstance };
