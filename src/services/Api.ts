import axios from 'axios';

const api = axios.create({
    baseURL: process.env.REACT_APP_API_BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});


export const createGame = () => api.post('game/createGame');
export const getGame = (hash: string, userId: string) => api.get(`game/getGame/${hash}/${userId}`);
export const getUserData = (userId: string) => api.get(`user/getUserData/${userId}`);
export const setUserData = (userId: string, nickname: string) => {
    return api.post(`user/setUserData`, {
        userId,
        nickname
    });
}
export const getListGames = (userId: string) => api.get(`game/getListGames/${userId}`);
export const checkWord = (hash: string, userId: string, word: string) => {
    return api.post('game/checkWord', {
        hash,
        word,
        userId
    });
};

export const getWordMeaning = (word: string) => api.get(`game/getWordMeaning/${word}`);
