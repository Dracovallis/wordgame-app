import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './views/Home/Home';
import Game from './views/Game/Game';

const App: React.FC = () => {
  return (
      <Router>
        <div>
          <Header />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/game/:hash" element={<Game />} />
          </Routes>
        </div>
      </Router>
  );
};

export default App;
