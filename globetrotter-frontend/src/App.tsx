import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Game from './pages/Game';
import InvitePage from './components/InvitePage';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/game" element={<Game />} />
        <Route path="/invite/:inviteToken/inviteUser/:inviteUserScore" element={<InvitePage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
