
import React, { useState, useEffect } from 'react';
import { QuestionType } from '../types.js';
import { validateSentenceWithAI } from '../services/geminiService.js';
import Button from './common/Button.js';
import Card from './common/Card.js';
import Loader from './common/Loader.js';

const GameScreen = ({ question, onAnswer, onNextQuestion, questionNumber, totalQuestions, score, apiKey }) => {
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [userSentence, setUserSentence] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [answered, setAnswered] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  useEffect(() => {
    setSelectedAnswer(null);
    setUserSentence('');
    setFeedback(null);
    setIsCorrect(null);
    setAnswered(false);
    setIsVerifying(false);
  }, [question]);

  const handleFillInBlankSubmit = (option) => {
    if (answered) return;
    setAnswered(true);
    setSelectedAnswer(option);
    const correct = option === question.correctAnswer;
    setIsCorrect(correct);
    setFeedback(question.explanation);
    onAnswer({ userAnswer: option, isCorrect: correct });
  };

  const handleWriteSentenceSubmit = async () => {
    if (answered || !userSentence.trim()) return;
    
    setIsVerifying(true);
    setAnswered(true);
    const result = await validateSentenceWithAI(apiKey, userSentence, question.correctAnswer);
    setIsVerifying(false);

    setIsCorrect(result.isValid);
    setFeedback(result.feedback);
    onAnswer({ userAnswer: userSentence, isCorrect: result.isValid });
  };

  const renderFillInTheBlank = () => {
    if (!question.sentence) {
        return <div className="text-center text-slate-300">Invalid question format.</div>;
    }
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
     if (!question.prompt) {
        return <div className="text-center text-slate-300">Invalid question format.</div>;
    }
    return (
        <div>
            <div className="bg-slate-700/50 p-6 rounded-lg mb-6 text-center">
                <p className="text-xl text-slate-200 leading-relaxed">{question.prompt}</p>
            </div>
            <textarea
                value={userSentence}
                onChange={(e) => setUserSentence(e.target.value)}
                placeholder={`Write your sentence here...`}
                className="w-full p-3 bg-slate-700 border-2 border-slate-600 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition duration-200 text-lg mb-4 min-h-[100px]"
                aria-label="Sentence input"
                disabled={answered}
            />
            <Button onClick={handleWriteSentenceSubmit} disabled={answered || !userSentence.trim()} className="w-full">
                Check My Sentence
            </Button>
        </div>
    )
  }

  const renderQuestion = () => {
    if (!question) return <Loader message="Loading question..." />;

    switch(question.type) {
        case QuestionType.FILL_IN_THE_BLANK:
            return renderFillInTheBlank();
        case QuestionType.WRITE_SENTENCE:
            return renderWriteSentence();
        default:
            return <div className="text-center text-slate-300">Unsupported question type.</div>;
    }
  }

  return (
    <Card>
      <div className="mb-6 flex justify-between items-center text-slate-300">
        <span className="font-semibold">Question: {questionNumber}/{totalQuestions}</span>
        <span className="font-semibold text-xl text-cyan-400">Score: {score}</span>
      </div>
      
      {renderQuestion()}

      {isVerifying && <Loader message="AI is checking your answer..." />}

      {feedback && !isVerifying && (
        <div className={`mt-6 p-4 rounded-lg text-center transition-opacity duration-500 ${isCorrect ? 'bg-green-900/50 text-green-300' : 'bg-red-900/50 text-red-300'}`}>
          <h3 className="font-bold text-lg mb-1">{isCorrect ? 'Correct!' : 'Needs Improvement!'}</h3>
          <p>{feedback}</p>
        </div>
      )}

      {answered && !isVerifying && (
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