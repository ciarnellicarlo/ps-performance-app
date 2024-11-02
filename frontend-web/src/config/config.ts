export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';
console.log('Environment:', process.env.NODE_ENV);
console.log('API URL from env:', process.env.NEXT_PUBLIC_API_BASE_URL);
console.log('Final API URL:', API_BASE_URL);