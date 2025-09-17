import React, { useState, useEffect } from 'react';
import { Question, QuestionType } from '../types';
import Button from './common/Button';
import Card from './common/Card';
import Loader from './common/Loader';

interface GameScreenProps {
  question: Question;
  onAnswer: (details: { userAnswer: string; isCorrect: boolean }) => void;
  onNextQuestion: () => void;
  questionNumber: number;
  totalQuestions: number;
  score: number;
  validateSentence: (sentence: string, targetWord: 'who' | 'which' | 'that') => Promise<{ isValid: boolean; feedback: string }>;
}

const GameScreen: React.FC<GameScreenProps> = ({ question, onAnswer, onNextQuestion, questionNumber, totalQuestions, score, validateSentence }) => {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userSentence, setUserSentence] = useState('');
  const [answered, setAnswered] = useState(false);

  useEffect(() => {
    setSelectedAnswer(null);
    setFeedback(null);
    setIsCorrect(null);
    setIsSubmitting(false);
    setUserSentence('');
    setAnswered(false);
  }, [question]);

  const handleFillInBlankSubmit = (option: string) => {
    if (answered) return;
    setAnswered(true);
    setSelectedAnswer(option);
    const correct = option === question.correctAnswer;
    setIsCorrect(correct);
    setFeedback(question.explanation);
    onAnswer({ userAnswer: option, isCorrect: correct });
  };

  const handleWriteSentenceSubmit = async () => {
    if (answered || userSentence.trim().length < 5) return;
    setIsSubmitting(true);
    const result = await validateSentence(userSentence, question.correctAnswer);
    setIsCorrect(result.isValid);
    setFeedback(result.feedback);
    onAnswer({ userAnswer: userSentence, isCorrect: result.isValid });
    setAnswered(true);
    setIsSubmitting(false);
  };

  const renderFillInTheBlank = () => {
    const parts = question.sentence.split('___');
    return (
      <div>
        <div className="bg-slate-700/50 p-6 rounded-lg mb-6 text-center">
            <p className="text-2xl text-slate-200 leading-relaxed">
                {parts[0]}
                <span className={`inline-block mx-2 px-4 py-1 rounded min-w-[100px] text-center border-2 ${
                    isCorrect === null ? 'border-dashed border-slate-500 text-slate-400' 
                    : isCorrect ? 'border-green-500 bg-green-900/50 text-white' 
                    : 'border-red-500 bg-red-900/50 text-white'
                }`}>
                    {selectedAnswer || '...'}
                </span>
                {parts[1]}
            </p>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {question.options.map(option => (
            <Button
              key={option}
              onClick={() => handleFillInBlankSubmit(option)}
              disabled={answered}
              className={`capitalize transition-transform duration-200 ${selectedAnswer === option ? 'transform scale-105' : ''}
                ${answered && option === question.correctAnswer ? 'bg-green-600 hover:bg-green-600 ring-2 ring-white' : ''}
                ${answered && selectedAnswer === option && !isCorrect ? 'bg-red-600 hover:bg-red-600' : ''}`}
            >
              {option}
            </Button>
          ))}
        </div>
      </div>
    );
  };

  const renderWriteSentence = () => {
    return (
        <div>
            <p className="text-2xl text-slate-200 leading-relaxed text-center p-6 bg-slate-700/50 rounded-lg mb-6">
                {question.prompt || `Write a sentence using the word "${question.correctAnswer}".`}
            </p>
            <div className="flex flex-col gap-4">
                 <textarea
                    value={userSentence}
                    onChange={(e) => setUserSentence(e.target.value)}
                    placeholder="Type your sentence here..."
                    disabled={answered}
                    className="w-full p-3 bg-slate-700 border-2 border-slate-600 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition duration-200 text-lg"
                    rows={3}
                />
                <Button onClick={handleWriteSentenceSubmit} disabled={answered || userSentence.trim().length < 5 || isSubmitting}>
                    {isSubmitting ? 'Checking...' : 'Check My Sentence'}
                </Button>
            </div>
        </div>
    );
  };

  return (
    <Card>
      <div className="mb-6 flex justify-between items-center text-slate-300">
        <span className="font-semibold">Question: {questionNumber}/{totalQuestions}</span>
        <span className="font-semibold text-xl text-cyan-400">Score: {score}</span>
      </div>
      
      {!question ? <Loader message="Loading question..." /> : (
          question.type === QuestionType.WRITE_SENTENCE ? renderWriteSentence() : renderFillInTheBlank()
      )}

      {feedback && (
        <div className={`mt-6 p-4 rounded-lg text-center transition-opacity duration-500 ${isCorrect ? 'bg-green-900/50 text-green-300' : 'bg-red-900/50 text-red-300'}`}>
          <h3 className="font-bold text-lg mb-1">{isCorrect ? 'Correct!' : 'Not Quite!'}</h3>
          <p>{feedback}</p>
        </div>
      )}

      {answered && (
        <div className="mt-6 text-center">
            <Button onClick={onNextQuestion} variant="primary">
                {questionNumber === totalQuestions ? 'Finish Round' : 'Next Question'}
            </Button>
        </div>
      )}
    </Card>
  );
};

export default GameScreen;