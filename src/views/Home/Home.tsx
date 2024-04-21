import React from 'react';
import {createGame} from "../../services/Api";
import {useNavigate} from "react-router-dom";

const Home: React.FC = () => {
    const navigate = useNavigate();
    const startGame = () => {
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

    return (
        <div>
            <button onClick={startGame}>Start Game</button>
        </div>
    );
};

export default Home;
