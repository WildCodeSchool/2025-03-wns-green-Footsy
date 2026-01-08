import axios from "axios";

const BASE_URL = process.env.ADEME_API_URL || 'https://impactco2.fr/api/v1';
const API_KEY = process.env.ADEME_API_KEY;
if (!API_KEY) throw new Error('Mission API_KEY in env');

const apiAdeme = axios.create({
    baseURL: BASE_URL,
    headers: {
        Authorization: `Bearer ${API_KEY}`
    },
    timeout: 10000, // 10s, trop long ?
});

export default apiAdeme;