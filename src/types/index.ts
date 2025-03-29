export interface Question {
  id: string;
  category: string;
  value: 200 | 400 | 600;
  text: string;
  answer: string;
  image?: string;
}

export interface Category {
  id: string;
  name: string;
  nameAr: string;
  icon?: string;
  questions: Question[];
}

export interface Team {
  id: string;
  name: string;
  score: number;
  lifelines: {
    changeQuestion: boolean;
    passTurn: boolean;
    audienceSuggestion: boolean;
  };
}

export interface GameState {
  teams: Team[];
  currentTeamIndex: number;
  categories: Category[];
  answeredQuestions: string[];
  gameOver: boolean;
  questionTimerDuration: number;
}

export interface ContextState extends GameState {
  selectQuestion: (questionId: string) => void;
  answerQuestion: (questionId: string, isCorrect: boolean) => void;
  nextTurn: () => void;
  // Not a React hook, just a function that applies a lifeline
  triggerLifeline: (teamId: string, lifeline: keyof Team['lifelines']) => void;
  resetGame: () => void;
  addTeam: (name: string) => void;
  removeTeam: (id: string) => void;
  // Category selection related props
  availableCategories: Category[];
  selectedCategories: { [teamId: string]: Category[] };
  selectCategoryForTeam: (teamId: string, categoryId: string) => void;
  removeCategoryFromTeam: (teamId: string, categoryId: string) => void;
  areAllCategoriesSelected: () => boolean;
  finalizeCategories: () => void;
  resetCategorySelections: () => void;
  // Timer settings function
  setQuestionTimerDuration: (seconds: number) => void;
} 