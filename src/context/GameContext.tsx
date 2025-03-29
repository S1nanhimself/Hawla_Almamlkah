import { createContext, useContext, useState, ReactNode } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { ContextState, GameState, Team, Category } from '../types';
import { sampleCategories, defaultTeams } from '../data/gameData';

// Default time in seconds for answering questions
const DEFAULT_QUESTION_TIME = 30;

const GameContext = createContext<ContextState | undefined>(undefined);

export const useGameContext = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGameContext must be used within a GameProvider');
  }
  return context;
};

interface GameProviderProps {
  children: ReactNode;
}

export const GameProvider = ({ children }: GameProviderProps) => {
  // Adding state for available categories
  const [availableCategories, setAvailableCategories] = useState<Category[]>(sampleCategories);
  // Selected categories tracks categories chosen by each team
  const [selectedCategories, setSelectedCategories] = useState<{
    [teamId: string]: Category[];
  }>({});

  const [gameState, setGameState] = useState<GameState>({
    teams: defaultTeams,
    currentTeamIndex: 0,
    categories: [], // Start with empty categories, will be filled after team selection
    answeredQuestions: [],
    gameOver: false,
    questionTimerDuration: DEFAULT_QUESTION_TIME,
  });

  // Add a category to a team's selection
  const selectCategoryForTeam = (teamId: string, categoryId: string) => {
    const category = availableCategories.find(cat => cat.id === categoryId);
    if (!category) return;

    setSelectedCategories(prev => {
      const teamCategories = prev[teamId] || [];
      // Check if the team already has 3 categories
      if (teamCategories.length >= 3) return prev;
      
      // Check if category is already selected
      if (teamCategories.some(cat => cat.id === categoryId)) return prev;

      return {
        ...prev,
        [teamId]: [...teamCategories, category]
      };
    });

    // Remove from available categories
    setAvailableCategories(prev => prev.filter(cat => cat.id !== categoryId));
  };

  // Remove a category from a team's selection
  const removeCategoryFromTeam = (teamId: string, categoryId: string) => {
    setSelectedCategories(prev => {
      const teamCategories = prev[teamId] || [];
      const updatedTeamCategories = teamCategories.filter(cat => cat.id !== categoryId);
      
      return {
        ...prev,
        [teamId]: updatedTeamCategories
      };
    });

    // Add back to available categories
    const categoryToReturn = sampleCategories.find(cat => cat.id === categoryId);
    if (categoryToReturn) {
      setAvailableCategories(prev => [...prev, categoryToReturn]);
    }
  };

  // Check if all teams have selected their 3 categories
  const areAllCategoriesSelected = () => {
    if (gameState.teams.length === 0) return false;
    
    return gameState.teams.every(team => {
      const teamCategories = selectedCategories[team.id] || [];
      return teamCategories.length === 3;
    });
  };

  // Finalize category selection and start the game
  const finalizeCategories = () => {
    // Combine all selected categories
    const allSelectedCategories = Object.values(selectedCategories).flat();
    
    setGameState(prev => ({
      ...prev,
      categories: allSelectedCategories
    }));
  };

  // Reset category selections
  const resetCategorySelections = () => {
    setAvailableCategories(sampleCategories);
    setSelectedCategories({});
  };

  const selectQuestion = (questionId: string) => {
    // Just mark the question as selected in this step
    // The actual question display is handled by the QuestionModal component
  };

  const answerQuestion = (questionId: string, isCorrect: boolean) => {
    // Find the question to get its value
    const question = gameState.categories
      .flatMap((cat) => cat.questions)
      .find((q) => q.id === questionId);

    if (!question) return;

    setGameState((prev) => {
      // Update the current team's score if correct
      const updatedTeams = [...prev.teams];
      if (isCorrect) {
        updatedTeams[prev.currentTeamIndex].score += question.value;
      }

      // Mark question as answered
      return {
        ...prev,
        teams: updatedTeams,
        answeredQuestions: [...prev.answeredQuestions, questionId],
        // Check if game is over (all questions answered)
        gameOver:
          prev.answeredQuestions.length + 1 ===
          prev.categories.flatMap((cat) => cat.questions).length,
      };
    });
  };

  const nextTurn = () => {
    setGameState((prev) => ({
      ...prev,
      currentTeamIndex: (prev.currentTeamIndex + 1) % prev.teams.length,
    }));
  };

  const applyLifeline = (teamId: string, lifeline: keyof Team['lifelines']) => {
    setGameState((prev) => {
      const updatedTeams = prev.teams.map((team) => {
        if (team.id === teamId) {
          return {
            ...team,
            lifelines: {
              ...team.lifelines,
              [lifeline]: false, // Mark lifeline as used
            },
          };
        }
        return team;
      });

      return {
        ...prev,
        teams: updatedTeams,
      };
    });
  };

  // Add a function to set the timer duration
  const setQuestionTimerDuration = (seconds: number) => {
    // Ensure the timer is at least 10 seconds and at most 120 seconds
    const validSeconds = Math.max(10, Math.min(120, seconds));
    
    setGameState((prev) => ({
      ...prev,
      questionTimerDuration: validSeconds,
    }));
  };

  // Update resetGame to reset timer settings too
  const resetGame = () => {
    resetCategorySelections();
    setGameState({
      teams: defaultTeams.map(team => ({
        ...team,
        score: 0,
        lifelines: {
          changeQuestion: true,
          passTurn: true,
          audienceSuggestion: true,
        }
      })),
      currentTeamIndex: 0,
      categories: [], // Reset to empty, will be filled after team selection
      answeredQuestions: [],
      gameOver: false,
      questionTimerDuration: DEFAULT_QUESTION_TIME, // Reset timer duration
    });
  };

  const addTeam = (name: string) => {
    const newTeam: Team = {
      id: uuidv4(),
      name,
      score: 0,
      lifelines: {
        changeQuestion: true,
        passTurn: true,
        audienceSuggestion: true,
      },
    };

    setGameState((prev) => ({
      ...prev,
      teams: [...prev.teams, newTeam],
    }));
  };

  const removeTeam = (id: string) => {
    // If team had selected categories, return them to available pool
    const teamCategories = selectedCategories[id] || [];
    if (teamCategories.length > 0) {
      setAvailableCategories(prev => [...prev, ...teamCategories]);
      setSelectedCategories(prev => {
        const updated = { ...prev };
        delete updated[id];
        return updated;
      });
    }

    setGameState((prev) => {
      // Don't remove if only 2 teams left
      if (prev.teams.length <= 2) return prev;

      const updatedTeams = prev.teams.filter((team) => team.id !== id);
      return {
        ...prev,
        teams: updatedTeams,
        // Adjust currentTeamIndex if needed
        currentTeamIndex:
          prev.currentTeamIndex >= updatedTeams.length
            ? 0
            : prev.currentTeamIndex,
      };
    });
  };

  const contextValue: ContextState = {
    ...gameState,
    selectQuestion,
    answerQuestion,
    nextTurn,
    triggerLifeline: applyLifeline,
    resetGame,
    addTeam,
    removeTeam,
    // Add new category selection functions to context
    availableCategories,
    selectedCategories,
    selectCategoryForTeam,
    removeCategoryFromTeam,
    areAllCategoriesSelected,
    finalizeCategories,
    resetCategorySelections,
    // Timer settings
    setQuestionTimerDuration,
  };

  return (
    <GameContext.Provider value={contextValue}>
      {children}
    </GameContext.Provider>
  );
}; 