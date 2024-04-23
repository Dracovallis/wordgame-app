import axios from 'axios';
import {getUserId} from "../utilities/UUID";

const api = axios.create({
    baseURL: process.env.REACT_APP_API_BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

const userId = getUserId();

export const createGame = () => api.post('game/createGame');
export const getGame = (hash: string) => api.get(`game/getGame/${hash}/${userId}`);
export const checkWord = (hash: string, word: string) => {
    return api.post('game/checkWord', {
        hash,
        word,
        userId
    });
};

export const getWordMeaning = (word: string) => api.get(`game/getWordMeaning/${word}`);
