import React from 'react';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Header from './components/Header';
import Home from './views/Home/Home';
import Game from './views/Game/Game';
import ListGames from './views/ListGames/ListGames';
import {UserProvider} from "./context/UserContext";

const App: React.FC = () => {
    return (
        <UserProvider>
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
        </UserProvider>
    );
};

export default App;
