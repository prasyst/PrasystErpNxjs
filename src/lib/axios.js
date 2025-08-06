import axios from 'axios';

const token = 'eyJhbGciOiJIUzI1NiJ9.eyJWYWxpZElzc3VlciI6IlByYXN5c3QiLCJWYWxpZEF1ZGllbmNlIjoiUHJhc3lzdCJ9.gMMGQ74cWLoymeDv0D4c3UQKTEJSCzdkXoxlW4qF5QU';

const axiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL, // Use NEXT_PUBLIC_ prefix
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    }
});

export default axiosInstance;