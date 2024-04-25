import React from 'react';
import {createGame} from "../../services/Api";
import {useNavigate} from "react-router-dom";
import LetterBox, {LetterBoxSizes} from "../../components/LetterBox";

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
        <div style={{display: 'flex', justifyContent: 'center'}}>
            <div style={{width: '300px', height: '300px', display: 'flex', alignItems: 'center'}}>
                <div style={{display: 'flex', flexDirection: 'column', width: '100%', gap: '20px'}}>
                    <LetterBox letter={'New game'}
                               height={LetterBoxSizes.SMALL}
                               width={LetterBoxSizes.BLOCK}
                               onClick={startGame}/>
                    <a href="./list">
                        <LetterBox letter={'Previous games'}
                                   height={LetterBoxSizes.SMALL}
                                   width={LetterBoxSizes.BLOCK}
                        />
                    </a>
                </div>
            </div>
        </div>
    );
};

export default Home;
