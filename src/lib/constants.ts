export const IS_DEV = process.env.NODE_ENV === 'development';
export const BASE_URL = IS_DEV ? "http://localhost:3000" : "https://www.indiaipo.in";
export const API_URL = IS_DEV ? "http://localhost:5000" : "https://api.indiaipo.in";
export const WHATSAPP_NUMBER = "917428337280";
export const DEFAULT_MESSAGE = "Hi! I'm interested in IPO advisory services. Can you help?";
export const CHAT_URL = "https://indiaipo.ai/";
export const REPORT_SLUGS = [
  "ipo-calendar",
  "upcoming-ipo-calendar",
  "mainline-ipo-report",
  "sme-ipo-report",
  "sme-ipos-by-sector",
  "mainboard-ipos-by-sector",
];