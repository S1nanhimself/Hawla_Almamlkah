import React from 'react';
import styled from 'styled-components';
import { useGameContext } from '../context/GameContext';
import { FaTrophy, FaRedoAlt } from 'react-icons/fa';

interface GameEndScreenProps {
  onRestart: () => void;
}

const GameEndScreen: React.FC<GameEndScreenProps> = ({ onRestart }) => {
  const { teams } = useGameContext();

  // Sort teams by score (highest first)
  const sortedTeams = [...teams].sort((a, b) => b.score - a.score);
  const isATie = sortedTeams.length >= 2 && sortedTeams[0].score === sortedTeams[1].score;
  const winner = isATie ? null : sortedTeams[0];

  // Render icon functions
  const renderTrophy = () => {
    const trophy = FaTrophy({ size: 48 });
    return trophy;
  };

  const renderRedoIcon = () => {
    const redoIcon = FaRedoAlt({ size: 18 });
    return redoIcon;
  };

  return (
    <EndScreenContainer>
      <EndScreenCard>
        <EndScreenTitle>انتهت اللعبة!</EndScreenTitle>

        {isATie ? (
          <TieMessage>تعادل! 🎉</TieMessage>
        ) : (
          winner && (
            <WinnerContainer>
              <TrophyIcon>
                {renderTrophy()}
              </TrophyIcon>
              <WinnerName>{winner.name}</WinnerName>
              <WinnerPoints>{winner.score} نقطة</WinnerPoints>
            </WinnerContainer>
          )
        )}

        <ScoresTable>
          <ScoresTableHeader>
            <HeaderCell>الفريق</HeaderCell>
            <HeaderCell>النقاط</HeaderCell>
          </ScoresTableHeader>
          {sortedTeams.map((team) => (
            <ScoreRow key={team.id} $isWinner={!isATie && team.id === winner?.id}>
              <TeamNameCell>{team.name}</TeamNameCell>
              <ScoreCell>{team.score}</ScoreCell>
            </ScoreRow>
          ))}
        </ScoresTable>

        <RestartButton onClick={onRestart}>
          {renderRedoIcon()}
          <span>لعبة جديدة</span>
        </RestartButton>
      </EndScreenCard>
    </EndScreenContainer>
  );
};

const EndScreenContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - var(--header-height));
  padding: 20px;
  background-color: var(--bg-color);
`;

const EndScreenCard = styled.div`
  background-color: white;
  border-radius: var(--border-radius);
  padding: 32px;
  width: 100%;
  max-width: 600px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const EndScreenTitle = styled.h2`
  font-size: 28px;
  color: var(--primary-color);
  text-align: center;
  margin-bottom: 24px;
`;

const TieMessage = styled.div`
  font-size: 32px;
  font-weight: bold;
  text-align: center;
  color: var(--primary-color);
  margin: 24px 0;
`;

const WinnerContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 24px 0;
  gap: 16px;
`;

const TrophyIcon = styled.div`
  font-size: 48px;
  color: gold;
  margin-bottom: 8px;
`;

const WinnerName = styled.div`
  font-size: 32px;
  font-weight: bold;
  color: var(--primary-color);
`;

const WinnerPoints = styled.div`
  font-size: 24px;
  color: #666;
`;

const ScoresTable = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  border: 1px solid #eee;
  border-radius: var(--border-radius);
  overflow: hidden;
  margin: 16px 0;
`;

const ScoresTableHeader = styled.div`
  display: grid;
  grid-template-columns: 1fr auto;
  background-color: #f5f5f5;
  padding: 12px 16px;
  font-weight: bold;
`;

const HeaderCell = styled.div`
  text-align: center;
`;

interface ScoreRowProps {
  $isWinner: boolean;
}

const ScoreRow = styled.div<ScoreRowProps>`
  display: grid;
  grid-template-columns: 1fr auto;
  padding: 12px 16px;
  background-color: ${(props) => (props.$isWinner ? 'rgba(255, 215, 0, 0.1)' : 'white')};
  border-top: 1px solid #eee;
  transition: background-color 0.3s;

  &:hover {
    background-color: ${(props) =>
      props.$isWinner ? 'rgba(255, 215, 0, 0.2)' : '#f9f9f9'};
  }
`;

const TeamNameCell = styled.div`
  font-weight: bold;
`;

const ScoreCell = styled.div`
  font-weight: bold;
  color: var(--primary-color);
  min-width: 60px;
  text-align: center;
`;

const RestartButton = styled.button`
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: var(--border-radius);
  padding: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 18px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s;
  margin-top: 16px;

  &:hover {
    opacity: 0.9;
  }
`;

export default GameEndScreen; 