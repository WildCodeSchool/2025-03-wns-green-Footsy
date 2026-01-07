import axios, { AxiosInstance } from "axios";

const BASE_URL = process.env.ADEME_API_URL || 'https://impactco2.fr/api/v1';
const API_KEY = process.env.ADEME_API_KEY || '';

const HEADER_NAME = 'Authorization';

const apiClient: AxiosInstance = axios.create({
    baseURL: BASE_URL,
    headers: {
        [HEADER_NAME]: API_KEY ? `Bearer ${API_KEY}` : undefined,
        'Content-Type': 'application/json',
    },
    timeout: 10000, // 10s, trop long ?
});

const ApiAdeme = {
    get: async (path: string) => {
        const p = path.startsWith('/') ? path : `/${path}`;
        const res = await apiClient.get(p);
        return res.data;
    },
}

export default ApiAdeme;