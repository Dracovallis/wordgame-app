import React from 'react';
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
    return (
        <header>
            <h1>WordGame App</h1>
            <nav>
                <Link to="/">Home</Link> | <Link to="/game">Game</Link>
            </nav>
        </header>
    );
};

export default Header;
