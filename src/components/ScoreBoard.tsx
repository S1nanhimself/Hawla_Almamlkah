import React from 'react';
import styled from 'styled-components';
import { useGameContext } from '../context/GameContext';
import { FaSyncAlt, FaForward, FaUsers } from 'react-icons/fa';

const ScoreBoard: React.FC = () => {
    const { teams, currentTeamIndex, triggerLifeline } = useGameContext();
  
    const handleUseLifeline = (
      teamId: string,
      lifelineName: 'changeQuestion' | 'passTurn' | 'audienceSuggestion',
      isAvailable: boolean
    ) => {
      if (isAvailable) {
        triggerLifeline(teamId, lifelineName);
      }
    };

  const renderLifelineButton = (
    teamId: string,
    lifelineName: 'changeQuestion' | 'passTurn' | 'audienceSuggestion',
    iconType: 'sync' | 'forward' | 'users',
    label: string
  ) => {
    const team = teams.find((t) => t.id === teamId);
    if (!team) return null;

    const isAvailable = team.lifelines[lifelineName];

    // Instead of passing React component, render the icon directly based on type
    const renderIcon = () => {
      switch (iconType) {
        case 'sync':
          return FaSyncAlt({ size: 16 });
        case 'forward':
          return FaForward({ size: 16 });
        case 'users':
          return FaUsers({ size: 16 });
        default:
          return null;
      }
    };

    return (
      <LifelineButton
        onClick={() => handleUseLifeline(teamId, lifelineName, isAvailable)}
        $isAvailable={isAvailable}
        title={label}
      >
        {renderIcon()}
      </LifelineButton>
    );
  };

  return (
    <ScoreBoardContainer>
      <ScoreBoardHeader>النتيجة</ScoreBoardHeader>
      <TeamsContainer>
        {teams.map((team, index) => (
          <TeamScore key={team.id} $isActive={index === currentTeamIndex} $teamIndex={index}>
            <TeamName $isActive={index === currentTeamIndex}>
              {team.name}
              {index === currentTeamIndex && <ActiveIndicator>دور فريق</ActiveIndicator>}
            </TeamName>
            <TeamScoreValue>{team.score}</TeamScoreValue>
            <LifelinesContainer>
              {renderLifelineButton(team.id, 'changeQuestion', 'sync', 'تغيير السؤال')}
              {renderLifelineButton(team.id, 'passTurn', 'forward', 'تمرير الدور')}
              {renderLifelineButton(team.id, 'audienceSuggestion', 'users', 'مساعدة الجمهور')}
            </LifelinesContainer>
          </TeamScore>
        ))}
      </TeamsContainer>
    </ScoreBoardContainer>
  );
};

interface Team {
  id: string;
  name: string;
  score: number;
  lifelines: {
    changeQuestion: boolean;
    passTurn: boolean;
    audienceSuggestion: boolean;
  };
}

const ScoreBoardContainer = styled.div`
  background-color: #fff;
  border-radius: var(--border-radius);
  padding: 20px;
  margin: 20px 0;
  box-shadow: var(--shadow-md);
  width: 100%;
  max-width: var(--container-max-width);
  
  @media (max-width: 768px) {
    padding: 16px;
    margin: 16px 0;
  }
  
  @media (max-width: 480px) {
    padding: 12px;
    margin: 12px 0;
    border-radius: var(--border-radius);
  }
`;

const ScoreBoardHeader = styled.h2`
  text-align: center;
  margin-bottom: 20px;
  color: var(--primary-color);
  font-size: 24px;
  font-weight: 700;
  
  @media (max-width: 768px) {
    font-size: 22px;
    margin-bottom: 16px;
  }
  
  @media (max-width: 480px) {
    font-size: 20px;
    margin-bottom: 12px;
  }
`;

const TeamsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  
  @media (max-width: 480px) {
    gap: 12px;
  }
`;

interface TeamProps {
  $isActive: boolean;
  $teamIndex: number;
}

const TeamScore = styled.div<TeamProps>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  border-radius: var(--border-radius);
  background-color: ${(props) => 
    props.$isActive 
      ? props.$teamIndex === 0 
        ? 'rgba(58, 94, 255, 0.1)' 
        : 'rgba(255, 58, 58, 0.1)'
      : 'var(--tile-bg)'
  };
  border: 1px solid ${(props) => 
    props.$isActive 
      ? props.$teamIndex === 0 
        ? 'var(--team1-color)' 
        : 'var(--team2-color)'
      : 'var(--tile-hover)'
  };
  transition: all var(--transition-medium);
  box-shadow: ${(props) => props.$isActive ? 'var(--shadow-sm)' : 'none'};
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-sm);
  }
  
  @media (max-width: 768px) {
    padding: 14px;
  }
  
  @media (max-width: 480px) {
    padding: 12px;
  }
`;

interface TeamNameProps {
  $isActive: boolean;
}

const TeamName = styled.div<TeamNameProps>`
  font-weight: ${(props) => (props.$isActive ? 'bold' : 'normal')};
  font-size: 18px;
  display: flex;
  flex-direction: column;
  
  @media (max-width: 768px) {
    font-size: 16px;
  }
  
  @media (max-width: 480px) {
    font-size: 15px;
  }
`;

const ActiveIndicator = styled.span`
  font-size: 14px;
  color: var(--primary-color);
  margin-top: 4px;
  font-weight: 500;
  background-color: rgba(197, 170, 106, 0.2);
  padding: 2px 8px;
  border-radius: 12px;
  display: inline-block;
  
  @media (max-width: 480px) {
    font-size: 12px;
    padding: 2px 6px;
  }
`;

const TeamScoreValue = styled.div`
  font-size: 28px;
  font-weight: bold;
  min-width: 60px;
  text-align: center;
  color: var(--primary-color);
  background-color: rgba(255, 255, 255, 0.8);
  border-radius: var(--border-radius);
  padding: 4px 8px;
  box-shadow: var(--shadow-sm);
  
  @media (max-width: 768px) {
    font-size: 24px;
    min-width: 50px;
  }
  
  @media (max-width: 480px) {
    font-size: 22px;
    min-width: 40px;
    padding: 2px 6px;
  }
`;

const LifelinesContainer = styled.div`
  display: flex;
  gap: 10px;
  
  @media (max-width: 480px) {
    gap: 6px;
  }
`;

interface LifelineButtonProps {
  $isAvailable: boolean;
}

const LifelineButton = styled.button<LifelineButtonProps>`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${(props) =>
    props.$isAvailable ? 'var(--lifeline-color)' : 'var(--lifeline-used)'};
  color: ${(props) => (props.$isAvailable ? 'white' : '#aaa')};
  font-size: 16px;
  cursor: ${(props) => (props.$isAvailable ? 'pointer' : 'not-allowed')};
  opacity: ${(props) => (props.$isAvailable ? '1' : '0.5')};
  padding: 0;
  transition: all var(--transition-medium);
  box-shadow: ${(props) => (props.$isAvailable ? 'var(--shadow-sm)' : 'none')};

  &:hover {
    transform: ${(props) => (props.$isAvailable ? 'scale(1.1) translateY(-2px)' : 'none')};
    box-shadow: ${(props) => (props.$isAvailable ? 'var(--shadow-md)' : 'none')};
  }
  
  @media (max-width: 768px) {
    width: 36px;
    height: 36px;
  }
  
  @media (max-width: 480px) {
    width: 32px;
    height: 32px;
  }
`;

export default ScoreBoard; 