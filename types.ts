export enum GameState {
  START = 'START',
  PLAYING = 'PLAYING',
  GAME_OVER = 'GAME_OVER',
  HIGH_SCORES = 'HIGH_SCORES',
}

export enum Difficulty {
  EASY = 'easy',
  MEDIUM = 'medium',
  HARD = 'hard',
}

// FIX: Add WRITE_SENTENCE to support more question types from the Gemini API.
export enum QuestionType {
    FILL_IN_THE_BLANK = 'fill-in-the-blank',
    WRITE_SENTENCE = 'write-sentence',
}

// FIX: Update Question interface to be more flexible for different question types.
export interface Question {
  type: QuestionType;
  sentence?: string; // Contains '___', now optional for other question types.
  prompt?: string; // Add prompt for WRITE_SENTENCE questions.
  correctAnswer: 'who' | 'which' | 'that';
  options: ('who' | 'which' | 'that')[];
  explanation: string;
}

export interface Score {
  name: string;
  score: number;
  date: string;
  difficulty: Difficulty;
}

export interface AnswerRecord {
  question: Question;
  userAnswer: string;
  isCorrect: boolean;
}
