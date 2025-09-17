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

export enum QuestionType {
    FILL_IN_THE_BLANK = 'fill-in-the-blank',
    WRITE_SENTENCE = 'write-sentence',
}

export interface Question {
  type: QuestionType;
  sentence: string; // For fill-in-the-blank, contains '___'
  prompt?: string; // For write-sentence, e.g., "Write a sentence using 'who'..."
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