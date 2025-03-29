import { Category } from '../types';
import { v4 as uuidv4 } from 'uuid';
import questionsData from './questions.json';

// Define types for the JSON data structure
interface JSONQuestion {
  category: string;
  value: number;
  text: string;
  answer: string;
  image?: string;
}

interface JSONCategory {
  name: string;
  nameAr: string;
  questions: JSONQuestion[];
}

interface QuestionsJSON {
  categories: JSONCategory[];
}

// Create categories from JSON data with UUIDs added
export const loadCategoriesFromJSON = (): Category[] => {
  try {
    const data = questionsData as QuestionsJSON;
    return data.categories.map(category => ({
      id: uuidv4(),
      name: category.name,
      nameAr: category.nameAr,
      questions: category.questions.map(question => ({
        id: uuidv4(),
        category: question.category,
        value: question.value as 200 | 400 | 600,
        text: question.text,
        answer: question.answer,
        ...(question.image ? { image: question.image } : {})
      }))
    }));
  } catch (error) {
    console.error('Error loading questions from JSON:', error);
    // Fallback to empty array if there's an error
    return [];
  }
};

// Load categories from JSON file
export const sampleCategories: Category[] = loadCategoriesFromJSON();

// Default teams
export const defaultTeams = [
  {
    id: uuidv4(),
    name: 'Team 1',
    score: 0,
    lifelines: {
      changeQuestion: true,
      passTurn: true,
      audienceSuggestion: true,
    },
  },
  {
    id: uuidv4(),
    name: 'Team 2',
    score: 0,
    lifelines: {
      changeQuestion: true,
      passTurn: true,
      audienceSuggestion: true,
    },
  },
]; 