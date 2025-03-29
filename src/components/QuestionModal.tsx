import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useGameContext } from '../context/GameContext';
import { FaTimes } from 'react-icons/fa';

interface QuestionModalProps {
  questionId: string;
  onClose: () => void;
}

const QuestionModal: React.FC<QuestionModalProps> = ({ questionId, onClose }) => {
  const { 
    categories, 
    teams, 
    currentTeamIndex, 
    answerQuestion, 
    nextTurn,
    questionTimerDuration 
  } = useGameContext();
  
  const [currentStep, setCurrentStep] = useState<'question' | 'answer' | 'result'>('question');
  const [correctTeamIndex, setCorrectTeamIndex] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState(questionTimerDuration);
  const [timerRunning, setTimerRunning] = useState(true);
  const [imageError, setImageError] = useState(false);
  const [isFullscreenImage, setIsFullscreenImage] = useState(false);

  // Calculate timer progress (for the circular visual timer)
  const timerProgress = (timeLeft / questionTimerDuration) * 100;
  
  // Determine timer color based on time remaining
  const getTimerColor = () => {
    if (timeLeft > 20) return '#4CAF50'; // Green
    if (timeLeft > 10) return '#FFC107'; // Yellow
    return '#F44336'; // Red
  };

  // Render close icon function
  const renderCloseIcon = () => {
    const closeIcon = FaTimes({ size: 20 });
    return closeIcon;
  };

  // Find the question
  const question = categories
    .flatMap((cat) => cat.questions)
    .find((q) => q.id === questionId);

  // Start countdown timer
  useEffect(() => {
    if (currentStep !== 'question' || !question || !timerRunning) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setCurrentStep('answer');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentStep, question, timerRunning]);

  if (!question) {
    return null;
  }

  // Pause timer temporarily
  const handlePauseTimer = () => {
    setTimerRunning(false);
  };

  // Resume timer
  const handleResumeTimer = () => {
    setTimerRunning(true);
  };

  // Go directly to answer screen
  const handleSubmitAnswer = () => {
    setTimerRunning(false);
    setCurrentStep('answer');
  };

  // Handle team select for correct answer
  const handleTeamSelect = (teamIndex: number) => {
    setCorrectTeamIndex(teamIndex);
    const isCorrect = true; // The selected team got it right
    answerQuestion(questionId, isCorrect);
    setCurrentStep('result');
  };

  // Handle when no team got it right
  const handleNoCorrectAnswer = () => {
    setCorrectTeamIndex(null);
    const isCorrect = false;
    answerQuestion(questionId, isCorrect);
    setCurrentStep('result');
  };

  const handleNextTeam = () => {
    nextTurn();
    onClose();
  };

  const handleImageError = () => {
    setImageError(true);
  };

  const toggleImageFullscreen = () => {
    setIsFullscreenImage(!isFullscreenImage);
  };

  const renderQuestionContent = () => {
    return (
      <QuestionContentContainer>
        <QuestionText>{question.text}</QuestionText>
        
        {question.image && !imageError && (
          <QuestionImageContainer onClick={toggleImageFullscreen}>
            <QuestionImage 
              src={question.image} 
              alt="Question visual"
              onError={handleImageError}
            />
            {!isFullscreenImage && <ImageClickHint>اضغط لتكبير الصورة</ImageClickHint>}
          </QuestionImageContainer>
        )}
      </QuestionContentContainer>
    );
  };

  return (
    <ModalOverlay>
      {isFullscreenImage && question.image ? (
        <FullscreenImageContainer onClick={toggleImageFullscreen}>
          <FullscreenImage 
            src={question.image} 
            alt="Question visual fullscreen" 
          />
          <FullscreenCloseButton onClick={(e) => {
            e.stopPropagation();
            setIsFullscreenImage(false);
          }}>
            {renderCloseIcon()}
          </FullscreenCloseButton>
        </FullscreenImageContainer>
      ) : (
        <ModalContent>
          <CloseButton onClick={onClose}>
            {renderCloseIcon()}
          </CloseButton>

          <ModalHeader>
            <CategoryBadge>{question.category}</CategoryBadge>
            <PointValue>{question.value} Points</PointValue>
          </ModalHeader>

          {currentStep === 'question' && (
            <>
              {renderQuestionContent()}
              
              <TimerSection>
                <CircularTimer>
                  <CircularTimerProgress 
                    $progress={timerProgress} 
                    $color={getTimerColor()}
                  />
                  <TimerValue>{timeLeft}</TimerValue>
                </CircularTimer>
                
                <TimerTextControls>
                  <TimerText>
                    {timerRunning ? 'Time Remaining' : 'Timer Paused'}
                  </TimerText>
                  
                  <TimerControls>
                    {timerRunning ? (
                      <TimerButton onClick={handlePauseTimer}>إيقاف مؤقت</TimerButton>
                    ) : (
                      <TimerButton onClick={handleResumeTimer}>استمرار</TimerButton>
                    )}
                  </TimerControls>
                </TimerTextControls>
              </TimerSection>

              <TeamInfo>
                <span>دور فريق {teams[currentTeamIndex].name}</span>
              </TeamInfo>

              <ButtonGroup>
                <Button onClick={handleSubmitAnswer}>عرض الإجابة</Button>
              </ButtonGroup>
            </>
          )}

          {currentStep === 'answer' && (
            <>
              {renderQuestionContent()}
              
              <AnswerSection>
                <AnswerDisplay>
                  <p>الإجابة الصحيحة: <strong>{question.answer}</strong></p>
                </AnswerDisplay>

                <TeamSelectionPrompt>من الفريق الذي أجاب إجابة صحيحة؟</TeamSelectionPrompt>
                
                <TeamSelectionGrid>
                  {teams.map((team, index) => (
                    <TeamSelectionButton 
                      key={team.id}
                      onClick={() => handleTeamSelect(index)}
                      $isCurrentTeam={index === currentTeamIndex}
                    >
                      {team.name}
                    </TeamSelectionButton>
                  ))}
                  <NoCorrectTeamButton onClick={handleNoCorrectAnswer}>
                    لا أحد أجاب بشكل صحيح
                  </NoCorrectTeamButton>
                </TeamSelectionGrid>
              </AnswerSection>
            </>
          )}

          {currentStep === 'result' && (
            <>
              {renderQuestionContent()}
              
              <ResultSection>
                <AnswerDisplay>
                  <p>الإجابة الصحيحة: <strong>{question.answer}</strong></p>
                </AnswerDisplay>
                
                <ResultMessage $isCorrect={correctTeamIndex !== null}>
                  {correctTeamIndex !== null
                    ? `${teams[correctTeamIndex].name} أجاب بشكل صحيح! +${question.value} نقطة`
                    : `لم يجب أي فريق بشكل صحيح.`}
                </ResultMessage>

                <NextButton onClick={handleNextTeam}>الانتقال إلى دور الفريق التالي</NextButton>
              </ResultSection>
            </>
          )}
        </ModalContent>
      )}
    </ModalOverlay>
  );
};

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: var(--modal-bg);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background-color: var(--modal-content-bg);
  border-radius: var(--border-radius);
  width: 95%;
  height: 90vh;
  max-width: 1000px;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  display: flex;
  flex-direction: column;
  
  @media (max-width: 768px) {
    width: 100%;
    height: 100%;
    max-height: 100vh;
    border-radius: 0;
  }
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  border-bottom: 1px solid var(--secondary-color);
  
  @media (max-width: 768px) {
    padding: 12px 16px;
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 16px;
  right: 16px;
  background: none;
  color: var(--text-color);
  font-size: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  padding: 0;
  border-radius: 50%;
  z-index: 10;

  &:hover {
    background-color: rgba(0, 0, 0, 0.1);
    transform: none;
  }
`;

const CategoryBadge = styled.div`
  font-size: 18px;
  font-weight: bold;
  color: var(--primary-color);
  padding: 6px 12px;
  background-color: rgba(89, 61, 41, 0.1);
  border-radius: 20px;
  
  @media (max-width: 768px) {
    font-size: 16px;
    padding: 4px 8px;
  }
`;

const PointValue = styled.div`
  font-size: 22px;
  font-weight: bold;
  color: var(--primary-color);
  
  @media (max-width: 768px) {
    font-size: 18px;
  }
`;

const QuestionContentContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 24px;
  min-height: 40vh;
  
  @media (max-width: 768px) {
    padding: 16px;
    min-height: 30vh;
  }
`;

const QuestionText = styled.div`
  font-size: 32px;
  text-align: center;
  margin-bottom: 24px;
  line-height: 1.4;
  
  @media (max-width: 768px) {
    font-size: 24px;
    margin-bottom: 16px;
  }
`;

const QuestionImageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
  width: 100%;
  max-width: 500px;
  cursor: pointer;
  position: relative;
`;

const ImageClickHint = styled.div`
  position: absolute;
  bottom: 10px;
  left: 50%;
  transform: translateX(-50%);
  background-color: rgba(0, 0, 0, 0.6);
  color: white;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 14px;
  opacity: 0;
  transition: opacity 0.3s;

  ${QuestionImageContainer}:hover & {
    opacity: 1;
  }
`;

const QuestionImage = styled.img`
  max-width: 100%;
  max-height: 300px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s;
  
  &:hover {
    transform: scale(1.02);
  }
`;

const FullscreenImageContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1100;
  cursor: pointer;
`;

const FullscreenImage = styled.img`
  max-width: 90%;
  max-height: 90vh;
  object-fit: contain;
`;

const FullscreenCloseButton = styled(CloseButton)`
  top: 20px;
  right: 20px;
  background-color: rgba(255, 255, 255, 0.2);
  color: white;
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.3);
  }
`;

const TimerSection = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 24px;
  padding: 16px 24px;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 16px;
    padding: 12px 16px;
  }
`;

const TimerTextControls = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

interface CircularTimerProgressProps {
  $progress: number;
  $color: string;
}

const CircularTimer = styled.div`
  position: relative;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background-color: #e0e0e0;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const CircularTimerProgress = styled.div<CircularTimerProgressProps>`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: conic-gradient(
    ${props => props.$color} ${props => props.$progress}%, 
    transparent ${props => props.$progress}%
  );
`;

const TimerValue = styled.div`
  position: relative;
  z-index: 1;
  font-size: 24px;
  font-weight: bold;
  color: var(--primary-color);
`;

const TimerText = styled.div`
  font-size: 16px;
  color: var(--text-color);
  text-align: center;
`;

const TimerControls = styled.div`
  display: flex;
  justify-content: center;
  gap: 8px;
`;

const TimerButton = styled.button`
  background-color: var(--secondary-color);
  color: white;
  border: none;
  border-radius: var(--border-radius);
  padding: 6px 12px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    opacity: 0.9;
  }
`;

const TeamInfo = styled.div`
  text-align: center;
  font-size: 18px;
  font-weight: bold;
  background-color: var(--secondary-color);
  color: white;
  padding: 8px 16px;
  border-radius: var(--border-radius);
  margin: 0 24px 16px;
  
  @media (max-width: 768px) {
    margin: 0 16px 16px;
    font-size: 16px;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 16px;
  justify-content: center;
  margin: 16px 24px 24px;
  
  @media (max-width: 768px) {
    margin: 12px 16px 16px;
  }
`;

interface ButtonProps {
  $success?: boolean;
  $danger?: boolean;
}

const Button = styled.button<ButtonProps>`
  padding: 12px 24px;
  font-size: 18px;
  background-color: ${(props) => {
    if (props.$success) return '#4caf50';
    if (props.$danger) return '#f44336';
    return 'var(--primary-color)';
  }};
  color: white;
  border-radius: var(--border-radius);
  border: none;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    opacity: 0.9;
    transform: translateY(-2px);
  }
  
  @media (max-width: 768px) {
    padding: 10px 16px;
    font-size: 16px;
  }
`;

const AnswerSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 16px 24px 24px;
  
  @media (max-width: 768px) {
    padding: 12px 16px 16px;
  }
`;

const ResultSection = styled(AnswerSection)``;

const AnswerDisplay = styled.div`
  text-align: center;
  font-size: 22px;
  margin: 0;
  padding: 16px;
  background-color: rgba(89, 61, 41, 0.1);
  border-radius: var(--border-radius);
  
  @media (max-width: 768px) {
    font-size: 18px;
    padding: 12px;
  }
`;

const TeamSelectionPrompt = styled.div`
  text-align: center;
  font-size: 20px;
  font-weight: bold;
  margin: 8px 0;
  color: var(--primary-color);
  
  @media (max-width: 768px) {
    font-size: 18px;
  }
`;

const TeamSelectionGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 12px;
  margin-top: 8px;
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  }
`;

interface TeamSelectionButtonProps {
  $isCurrentTeam: boolean;
}

const TeamSelectionButton = styled.button<TeamSelectionButtonProps>`
  padding: 12px;
  font-size: 16px;
  font-weight: ${props => props.$isCurrentTeam ? 'bold' : 'normal'};
  background-color: ${props => props.$isCurrentTeam ? 'rgba(89, 61, 41, 0.2)' : 'var(--tile-bg)'};
  color: var(--primary-color);
  border: 2px solid ${props => props.$isCurrentTeam ? 'var(--primary-color)' : 'var(--secondary-color)'};
  border-radius: var(--border-radius);
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background-color: rgba(89, 61, 41, 0.2);
    transform: translateY(-2px);
  }
`;

const NoCorrectTeamButton = styled.button`
  grid-column: 1 / -1;
  padding: 12px;
  font-size: 16px;
  background-color: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
  border-radius: var(--border-radius);
  cursor: pointer;
  transition: all 0.2s;
  margin-top: 8px;

  &:hover {
    background-color: #f1c1c5;
    transform: translateY(-2px);
  }
`;

interface ResultMessageProps {
  $isCorrect: boolean;
}

const ResultMessage = styled.div<ResultMessageProps>`
  text-align: center;
  font-size: 24px;
  font-weight: bold;
  color: ${(props) => (props.$isCorrect ? '#4caf50' : '#f44336')};
  margin: 16px 0;
  
  @media (max-width: 768px) {
    font-size: 20px;
  }
`;

const NextButton = styled(Button)`
  width: 100%;
  margin-top: 8px;
`;

export default QuestionModal; 