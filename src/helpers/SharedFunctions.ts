import {createGame} from "../services/Api";
import {NavigateFunction} from "react-router/dist/lib/hooks";

export const startGame = (navigate: NavigateFunction) => {
    createGame()
        .then(resp => {
            if (resp.data.data.game_id) {
                navigate(`/game/${resp.data.data.game_id}`);
            } else {
                alert('Failed to start a new game. Please try again.');
            }
        })
        .catch(error => {
            console.error('Error starting new game:', error);
            alert('An error occurred. Please try again.');
        });
};