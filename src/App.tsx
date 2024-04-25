import React from 'react';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Header from './components/Header';
import Home from './views/Home/Home';
import Game from './views/Game/Game';
import ListGames from './views/ListGames/ListGames';

const App: React.FC = () => {
    return (
        <Router>
            <div>
                <Header/>
                <Routes>
                    <Route path="/" element={<Home/>}/>
                    <Route path="/game/:hash" element={<Game/>}/>
                    <Route path="/list" element={<ListGames/>}/>
                </Routes>
            </div>
        </Router>
    );
};

export default App;
