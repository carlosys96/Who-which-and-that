import { Difficulty, Question, QuestionType } from '../types';
import { QUESTIONS_PER_ROUND } from '../constants';

const shuffleArray = <T,>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

const allQuestions: Record<Difficulty, Question[]> = {
  [Difficulty.EASY]: [
    {
      type: QuestionType.FILL_IN_THE_BLANK,
      sentence: "The dog ___ chased the ball is very fast.",
      correctAnswer: 'that',
      options: ['who', 'which', 'that'],
      explanation: "Use 'that' for animals and things in simple, defining sentences."
    },
    {
      type: QuestionType.FILL_IN_THE_BLANK,
      sentence: "She is the girl ___ won the race.",
      correctAnswer: 'who',
      options: ['who', 'which', 'that'],
      explanation: "Use 'who' when referring to a person."
    },
    {
      type: QuestionType.FILL_IN_THE_BLANK,
      sentence: "I read the book ___ you recommended.",
      correctAnswer: 'that',
      options: ['who', 'which', 'that'],
      explanation: "Use 'that' for things."
    },
    {
      type: QuestionType.FILL_IN_THE_BLANK,
      sentence: "The man ___ lives next door is a doctor.",
      correctAnswer: 'who',
      options: ['who', 'which', 'that'],
      explanation: "Use 'who' to refer to people."
    },
    {
      type: QuestionType.FILL_IN_THE_BLANK,
      sentence: "This is the cake ___ I baked this morning.",
      correctAnswer: 'that',
      options: ['who', 'which', 'that'],
      explanation: "Use 'that' to refer to a thing (the cake)."
    },
    {
      type: QuestionType.FILL_IN_THE_BLANK,
      sentence: "He is the artist ___ painted this picture.",
      correctAnswer: 'who',
      options: ['who', 'which', 'that'],
      explanation: "'who' is used for people."
    },
    {
      type: QuestionType.FILL_IN_THE_BLANK,
      sentence: "I lost the map ___ you gave me.",
      correctAnswer: 'that',
      options: ['who', 'which', 'that'],
      explanation: "Use 'that' for objects."
    },
    {
      type: QuestionType.FILL_IN_THE_BLANK,
      sentence: "The student ___ answered the question was clever.",
      correctAnswer: 'who',
      options: ['who', 'which', 'that'],
      explanation: "Use 'who' for a person (the student)."
    },
     {
      type: QuestionType.FILL_IN_THE_BLANK,
      sentence: "Let's watch the movie ___ everyone is talking about.",
      correctAnswer: 'that',
      options: ['who', 'which', 'that'],
      explanation: "'that' is used to refer to a thing (the movie)."
    },
    {
      type: QuestionType.FILL_IN_THE_BLANK,
      sentence: "The chef ___ made this meal is very talented.",
      correctAnswer: 'who',
      options: ['who', 'which', 'that'],
      explanation: "Use 'who' because the chef is a person."
    }
  ],
  [Difficulty.MEDIUM]: [
    {
      type: QuestionType.FILL_IN_THE_BLANK,
      sentence: "My car, ___ is quite old, still runs well.",
      correctAnswer: 'which',
      options: ['who', 'which', 'that'],
      explanation: "Use 'which' with a comma for non-essential information about a thing."
    },
    {
      type: QuestionType.FILL_IN_THE_BLANK,
      sentence: "The manager, ___ was very busy, still made time for me.",
      correctAnswer: 'who',
      options: ['who', 'which', 'that'],
      explanation: "Use 'who' for people, even in clauses with commas."
    },
    {
      type: QuestionType.FILL_IN_THE_BLANK,
      sentence: "I'm looking for a person ___ can speak fluent Spanish.",
      correctAnswer: 'who',
      options: ['who', 'which', 'that'],
      explanation: "Use 'who' for people in a clause that defines the person."
    },
    {
      type: QuestionType.FILL_IN_THE_BLANK,
      sentence: "The Eiffel Tower, ___ is in Paris, is famous.",
      correctAnswer: 'which',
      options: ['who', 'which', 'that'],
      explanation: "The clause adds extra info about the Eiffel Tower (a thing), so we use 'which'."
    },
    {
      type: QuestionType.FILL_IN_THE_BLANK,
      sentence: "He finally visited the town ___ his grandfather was from.",
      correctAnswer: 'that',
      options: ['who', 'which', 'that'],
      explanation: "Use 'that' to provide essential information about a place or thing."
    },
    {
      type: QuestionType.FILL_IN_THE_BLANK,
      sentence: "The scientist, ___ discovered a new planet, became famous.",
      correctAnswer: 'who',
      options: ['who', 'which', 'that'],
      explanation: "Use 'who' to give extra information about a person."
    },
    {
      type: QuestionType.FILL_IN_THE_BLANK,
      sentence: "He showed me the photo, ___ was a bit blurry.",
      correctAnswer: 'which',
      options: ['who', 'which', 'that'],
      explanation: "'which' is used for non-essential clauses about things."
    },
    {
      type: QuestionType.FILL_IN_THE_BLANK,
      sentence: "The only thing ___ matters is that you are safe.",
      correctAnswer: 'that',
      options: ['who', 'which', 'that'],
      explanation: "After words like 'only', 'all', or 'everything', 'that' is strongly preferred."
    },
    {
      type: QuestionType.FILL_IN_THE_BLANK,
      sentence: "My sister, ___ is a lawyer, lives in New York.",
      correctAnswer: 'who',
      options: ['who', 'which', 'that'],
      explanation: "Use 'who' to provide extra, non-essential information about a person."
    },
    {
      type: QuestionType.FILL_IN_THE_BLANK,
      sentence: "The presentation, ___ lasted an hour, was very informative.",
      correctAnswer: 'which',
      options: ['who', 'which', 'that'],
      explanation: "Use 'which' with commas to give additional information about an event or thing."
    }
  ],
  [Difficulty.HARD]: [
    {
      type: QuestionType.FILL_IN_THE_BLANK,
      sentence: "She is the person for ___ I have the most respect.",
      correctAnswer: 'who',
      options: ['who', 'which', 'that'],
      explanation: "While 'whom' is technically correct after a preposition, 'who' is very common in modern English. 'that' and 'which' are incorrect for a person."
    },
    {
      type: QuestionType.FILL_IN_THE_BLANK,
      sentence: "The project, the success of ___ depends on teamwork, is our top priority.",
      correctAnswer: 'which',
      options: ['who', 'which', 'that'],
      explanation: "Use 'which' in the phrase 'of which' to refer to a thing (the project)."
    },
    {
      type: QuestionType.FILL_IN_THE_BLANK,
      sentence: "This is the best film ___ I have ever seen.",
      correctAnswer: 'that',
      options: ['who', 'which', 'that'],
      explanation: "After a superlative (like 'best' or 'worst'), 'that' is used to define the noun."
    },
    {
      type: QuestionType.FILL_IN_THE_BLANK,
      sentence: "The company hired a consultant ___ they believed could solve the problem.",
      correctAnswer: 'who',
      options: ['who', 'which', 'that'],
      explanation: "Use 'who' to refer to the consultant (a person), even in a complex sentence."
    },
    {
      type: QuestionType.FILL_IN_THE_BLANK,
      sentence: "He talked about the planets and stars, ___ are subjects I know little about.",
      correctAnswer: 'which',
      options: ['who', 'which', 'that'],
      explanation: "Use 'which' to refer to the entire idea or list of things mentioned before."
    },
    {
      type: QuestionType.FILL_IN_THE_BLANK,
      sentence: "It was a type of decision ___ required careful thought.",
      correctAnswer: 'that',
      options: ['who', 'which', 'that'],
      explanation: "'that' is preferred over 'which' in defining clauses, especially in formal writing."
    },
    {
      type: QuestionType.FILL_IN_THE_BLANK,
      sentence: "All the contestants ___ finished the race received a medal.",
      correctAnswer: 'who',
      options: ['who', 'which', 'that'],
      explanation: "You can use 'who' or 'that' for people in defining clauses, but 'who' is often preferred."
    },
    {
      type: QuestionType.FILL_IN_THE_BLANK,
      sentence: "The reason ___ he was late is not important.",
      correctAnswer: 'that',
      options: ['who', 'which', 'that'],
      explanation: "In the phrase 'the reason that', 'that' is the correct choice. ('why' is also common but not an option here)."
    },
    {
      type: QuestionType.FILL_IN_THE_BLANK,
      sentence: "The team, half of ___ were new recruits, performed surprisingly well.",
      correctAnswer: 'who',
      options: ['who', 'which', 'that'],
      explanation: "Although 'whom' is technically correct here ('of whom'), 'who' is widely accepted. 'which' would refer to a team of things, not people."
    },
    {
      type: QuestionType.FILL_IN_THE_BLANK,
      sentence: "The painting ___ was sold for a million dollars was a forgery.",
      correctAnswer: 'that',
      options: ['who', 'which', 'that'],
      explanation: "The clause 'that was sold...' is essential to identify which painting we're discussing, so 'that' is the best fit."
    }
  ]
};

export const getStaticQuestions = (difficulty: Difficulty): Question[] => {
  const questions = allQuestions[difficulty];
  return shuffleArray(questions).slice(0, QUESTIONS_PER_ROUND);
};
