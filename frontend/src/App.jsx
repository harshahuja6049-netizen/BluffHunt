import { BrowserRouter, Routes, Route } from 'react-router-dom';
import JoinScreen from './pages/JoinScreen';
import LobbyScreen from './pages/LobbyScreen';
import GameScreen from './pages/GameScreen';
import PodiumScreen from './pages/PodiumScreen';
import InstallPrompt from './components/InstallPrompt';

function App() {
  return (
    <BrowserRouter>
      <InstallPrompt />
      <Routes>
        <Route path="/" element={<JoinScreen />} />
        <Route path="/lobby" element={<LobbyScreen />} />
        <Route path="/game" element={<GameScreen />} />
        <Route path="/podium" element={<PodiumScreen />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
