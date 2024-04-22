import axios from 'axios';

const api = axios.create({
    baseURL: process.env.REACT_APP_API_BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

export const drawLetters = () => api.get('game/drawLetters');
export const createGame = () => api.post('game/createGame');
export const getGame = (hash: string) => api.get(`game/getGame/${hash}`);
export const checkWord = (hash: string, word: string) => api.post('game/checkWord', {
    hash,
    word
});

export const insertWord = (hash: string, word: string, meaning: string) => api.post('game/insertWord', {
    word,
    meaning,
    hash,
});

export const fetchWordMeaningChitanka = (word: string) => api.get(`https://rechnik.chitanka.info/w/${encodeURIComponent(word)}`);
