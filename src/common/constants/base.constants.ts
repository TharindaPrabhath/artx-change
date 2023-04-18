export const FRONTEND_BASE_URL =
  process.env.NODE_ENV === 'production' ? 'https://www.artx.com' : 'http://localhost:3000';
export const BACKEND_BASE_URL =
  process.env.NODE_ENV === 'production' ? 'https://be.artx.com/api' : 'http://localhost:8080/api';
