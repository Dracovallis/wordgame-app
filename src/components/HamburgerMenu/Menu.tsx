import React from 'react';
import {useNavigate} from "react-router-dom";
import {createGame} from "../../services/Api";

interface MenuProps {
    isOpen: boolean;
    toggleMenu: () => void;  // Added to close the menu
}

const Menu: React.FC<MenuProps> = ({isOpen, toggleMenu}) => {
    const navigate = useNavigate();

    if (!isOpen) return null;

    const startGame = () => {
        createGame()
            .then(resp => {
                if (resp.data.data.game_id) {
                    navigate(`/game/${resp.data.data.game_id}`);
                    window.location.reload();
                } else {
                    alert('Failed to start a new game. Please try again.');
                }
            })
            .catch(error => {
                console.error('Error starting new game:', error);
                alert('An error occurred. Please try again.');
            });

        toggleMenu();
    };

    return (
        <div className="menu">
            <ul>
                <a href="#" onClick={startGame}>
                    <li>New Game</li>
                </a>
                <a href="/list" onClick={toggleMenu}>
                    <li>List</li>
                </a>
            </ul>
        </div>
    );
};

export default Menu;
