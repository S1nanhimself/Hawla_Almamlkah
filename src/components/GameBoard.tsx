import React, { useState } from 'react';
import styled from 'styled-components';
import { useGameContext } from '../context/GameContext';
import QuestionModal from './QuestionModal';

const GameBoard: React.FC = () => {
  const { categories, answeredQuestions, selectQuestion } = useGameContext();
  const [selectedQuestion, setSelectedQuestion] = useState<string | null>(null);

  // Updated point values with duplicates as requested: 200, 200, 400, 400, 600, 600
  const pointValues = [200, 200, 400, 400, 600, 600];

  const handleQuestionClick = (questionId: string) => {
    setSelectedQuestion(questionId);
    selectQuestion(questionId);
  };

  const handleCloseModal = () => {
    setSelectedQuestion(null);
  };

  return (
    <BoardContainer>
      <CategoriesRow>
        {categories.map((category) => (
          <CategoryHeader key={category.id}>
            {category.nameAr}
          </CategoryHeader>
        ))}
      </CategoriesRow>

      {pointValues.map((value, index) => (
        <QuestionRow key={`${value}-${index}`}>
          {categories.map((category) => {
            // Find questions of this value
            const questionsOfValue = category.questions.filter(q => q.value === value);
            // Get the specific question based on index (first or second occurrence)
            const questionIndex = pointValues.slice(0, index).filter(v => v === value).length;
            const question = questionsOfValue[questionIndex];
            
            const isAnswered = question ? answeredQuestions.includes(question.id) : true;

            return (
              <QuestionTile 
                key={`${category.id}-${value}-${index}`}
                onClick={() => question && !isAnswered && handleQuestionClick(question.id)}
                $isAnswered={isAnswered}
                $value={value}
              >
                {isAnswered ? '' : value}
              </QuestionTile>
            );
          })}
        </QuestionRow>
      ))}

      {selectedQuestion && (
        <QuestionModal 
          questionId={selectedQuestion} 
          onClose={handleCloseModal} 
        />
      )}
    </BoardContainer>
  );
};

const BoardContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 8px;
  padding: 20px;
  background-color: var(--bg-color);
  max-width: var(--container-max-width);
  margin: 0 auto;
  
  @media (max-width: 768px) {
    padding: 16px;
    gap: 6px;
  }
  
  @media (max-width: 480px) {
    padding: 12px;
    gap: 4px;
  }
`;

const CategoriesRow = styled.div`
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 8px;
  width: 100%;
  
  @media (max-width: 768px) {
    gap: 6px;
  }
  
  @media (max-width: 480px) {
    gap: 4px;
  }
`;

const CategoryHeader = styled.div`
  background-color: var(--primary-color);
  color: white;
  padding: 16px 8px;
  border-radius: var(--border-radius);
  text-align: center;
  font-weight: bold;
  min-height: 70px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: var(--shadow-sm);
  user-select: none;
  font-size: 16px;
  line-height: 1.3;
  transition: all var(--transition-medium);
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-md);
  }
  
  @media (max-width: 768px) {
    padding: 10px 6px;
    min-height: 50px;
    font-size: 0.9rem;
  }
  
  @media (max-width: 480px) {
    padding: 8px 4px;
    min-height: 40px;
    font-size: 0.8rem;
  }
`;

const QuestionRow = styled.div`
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 8px;
  width: 100%;
  
  @media (max-width: 768px) {
    gap: 6px;
  }
  
  @media (max-width: 480px) {
    gap: 4px;
  }
`;

interface QuestionTileProps {
  $isAnswered: boolean;
  $value: number;
}

const QuestionTile = styled.div<QuestionTileProps>`
  background-color: ${(props) => {
    if (props.$isAnswered) return 'transparent';
    
    // Updated colors based on point values with gold tones
    const value = props.$value;
    if (value === 200) return '#C5AA6A';
    if (value === 400) return '#B59B5C';
    if (value === 600) return '#A58C4E';
    return 'var(--primary-color)';
  }};
  
  color: ${(props) => props.$isAnswered ? 'transparent' : 'white'};
  padding: 16px;
  border-radius: var(--border-radius);
  text-align: center;
  font-weight: bold;
  min-height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  cursor: ${(props) => (props.$isAnswered ? 'default' : 'pointer')};
  transition: all var(--transition-medium);
  box-shadow: ${(props) => props.$isAnswered ? 'none' : 'var(--shadow-sm)'};
  user-select: none;
  border: ${(props) => props.$isAnswered ? '1px dashed #ccc' : 'none'};

  &:hover {
    transform: ${(props) => (props.$isAnswered ? 'none' : 'translateY(-3px)')};
    box-shadow: ${(props) => props.$isAnswered ? 'none' : 'var(--shadow-md)'};
  }
  
  &:active {
    transform: ${(props) => (props.$isAnswered ? 'none' : 'translateY(-1px)')};
    box-shadow: ${(props) => props.$isAnswered ? 'none' : 'var(--shadow-sm)'};
  }
  
  @media (max-width: 768px) {
    padding: 10px;
    min-height: 50px;
    font-size: 18px;
  }
  
  @media (max-width: 480px) {
    padding: 8px;
    min-height: 40px;
    font-size: 16px;
  }
`;

export default GameBoard; 