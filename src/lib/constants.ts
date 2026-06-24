export const IS_DEV = process.env.NODE_ENV === 'development';
export const BASE_URL = IS_DEV ? "http://localhost:3000" : "https://www.indiaipo.in";
export const API_URL = IS_DEV ? "http://localhost:5000" : "https://api.indiaipo.in";
