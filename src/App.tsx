import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { GameProvider } from './context/GameContext';
import { GlobalStyles } from './styles/GlobalStyles';
import Header from './components/Header';
import ScoreBoard from './components/ScoreBoard';
import GameBoard from './components/GameBoard';
import SetupScreen from './components/SetupScreen';
import GameEndScreen from './components/GameEndScreen';

// Game phases
type GamePhase = 'setup' | 'play' | 'end';

function App() {
  const [gamePhase, setGamePhase] = useState<GamePhase>('setup');
  const [isRtl, setIsRtl] = useState(true);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const handleStartGame = () => {
    setGamePhase('play');
  };

  const handleEndGame = () => {
    setGamePhase('end');
  };

  const handleRestart = () => {
    setGamePhase('setup');
  };

  useEffect(() => {
    document.body.setAttribute('dir', isRtl ? 'rtl' : 'ltr');
    document.body.setAttribute('dir', 'rtl');
  }, []);

  // Track window resize for responsive design
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Set theme variable in CSS for responsive design
  useEffect(() => {
    document.documentElement.style.setProperty('--is-mobile', windowWidth <= 768 ? 'true' : 'false');
  }, [windowWidth]);

  return (
    <GameProvider>
      <GlobalStyles />
      <AppContainer>
        <Header onReset={gamePhase === 'play' ? handleEndGame : undefined} />
        
        <MainContent>
          {gamePhase === 'setup' && <SetupScreen onStartGame={handleStartGame} />}
          
          {gamePhase === 'play' && (
            <GameLayout>
              <ScoreBoard />
              <GameBoard />
            </GameLayout>
          )}
          
          {gamePhase === 'end' && <GameEndScreen onRestart={handleRestart} />}
        </MainContent>
        
        <Footer>
          <p>حول المملكة © {new Date().getFullYear()}</p>
        </Footer>
      </AppContainer>
    </GameProvider>
  );
}

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  max-width: var(--container-max-width);
  margin: 0 auto;
  padding: 0 20px;
  
  @media (max-width: 768px) {
    padding: 0 10px;
  }
`;

const MainContent = styled.main`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  padding: 20px 0;
  
  @media (max-width: 768px) {
    padding: 10px 0;
  }
`;

const GameLayout = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  width: 100%;
`;

const Footer = styled.footer`
  text-align: center;
  padding: 20px 0;
  color: var(--text-color);
  font-size: 14px;
  opacity: 0.8;
`;

export default App;
