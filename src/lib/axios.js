// 'use client'
// import axios from 'axios';

// const token = 'eyJhbGciOiJIUzI1NiJ9.eyJWYWxpZElzc3VlciI6IlByYXN5c3QiLCJWYWxpZEF1ZGllbmNlIjoiUHJhc3lzdCJ9.gMMGQ74cWLoymeDv0D4c3UQKTEJSCzdkXoxlW4qF5QU';

// const axiosInstance = axios.create({
//     baseURL: process.env.NEXT_PUBLIC_API_URL, // Use NEXT_PUBLIC_ prefix
//     headers: {
//       'Content-Type': 'application/json',
//       Authorization: `Bearer ${token}`
//     }
// });

// export default axiosInstance;   





'use client'
import axios from 'axios';

const token = 'eyJhbGciOiJIUzI1NiJ9.eyJWYWxpZElzc3VlciI6IlByYXN5c3QiLCJWYWxpZEF1ZGllbmNlIjoiUHJhc3lzdCJ9.gMMGQ74cWLoymeDv0D4c3UQKTEJSCzdkXoxlW4qF5QU';

const DOMAIN_API_MAP = {
  'pgsol.prasyst.com': 'https://pgsol.prasyst.com/WebApi/api/',
  '192.168.1.21': 'http://192.168.1.21/WebApi/api/',
};

const getBaseURL = () => {
  if (typeof window !== 'undefined') {
    const host = window.location.hostname;
    return DOMAIN_API_MAP[host] || DOMAIN_API_MAP['pgsol.prasyst.com'];
  }
  return DOMAIN_API_MAP['pgsol.prasyst.com']; 
};

const axiosInstance = axios.create({
  baseURL: getBaseURL(),
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`
  }
});

export default axiosInstance;   