
import React, { useState } from 'react';
import { Difficulty, QuestionType } from '../types';
import { GAME_TITLE } from '../constants';
import Button from './common/Button';
import Card from './common/Card';

const ReviewModal = ({ history, onClose }) => {
    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-40 p-4">
            <Card className="w-full max-w-3xl h-[90vh] flex flex-col">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-3xl font-bold text-cyan-400">Answer Review</h2>
                    <Button onClick={onClose} variant="secondary">Close</Button>
                </div>
                <div className="overflow-y-auto flex-grow pr-2 space-y-4">
                    {history.map((record, index) => (
                        <div key={index} className="bg-slate-900/70 p-4 rounded-lg border border-slate-700">
                            <p className="font-semibold text-slate-300 mb-2">Question {index + 1}</p>
                            <p className="text-lg text-white mb-3 bg-slate-700/50 p-3 rounded">
                                {record.question.type === QuestionType.FILL_IN_THE_BLANK && record.question.sentence
                                    ? record.question.sentence.replace('___', `[${record.question.correctAnswer}]`)
                                    : (record.question.prompt || 'Unsupported question format.')
                                }
                            </p>
                            <p className={`font-semibold mb-1 p-2 rounded ${record.isCorrect ? 'bg-green-900/50 text-green-300' : 'bg-red-900/50 text-red-300'}`}>
                                Your Answer: <span className="font-normal">{record.userAnswer}</span>
                            </p>
                            {!record.isCorrect && (
                                 <p className="font-semibold mb-2 p-2 rounded bg-slate-700 text-slate-200">
                                     Correct Answer: <span className="font-normal">{record.question.correctAnswer}</span>
                                 </p>
                            )}
                             <p className="text-slate-400"><span className="font-semibold">Explanation:</span> {record.question.explanation}</p>
                        </div>
                    ))}
                </div>
            </Card>
        </div>
    );
};

const StartScreen = ({ onStartGame, onShowScores, error, scores, roundHistory }) => {
  const [selectedDifficulty, setSelectedDifficulty] = useState(Difficulty.MEDIUM);
  const [isDynamicMode, setIsDynamicMode] = useState(true);
  const [showReview, setShowReview] = useState(false);

  const difficultyOptions = [
    { value: Difficulty.EASY, label: 'Easy', description: 'Simple sentences, clear choices.' },
    { value: Difficulty.MEDIUM, label: 'Medium', description: 'More complex sentences.' },
    { value: Difficulty.HARD, label: 'Hard', description: 'Subtle grammar rules.' },
  ];

  return (
    <>
      <Card>
        <div className="text-center">
          <h1 className="text-5xl font-bold text-cyan-400 mb-2">{GAME_TITLE}</h1>
          <p className="text-slate-300 mb-8 text-lg">Master the use of 'who', 'which', and 'that'!</p>
          
          {error && <p className="bg-red-900/50 text-red-300 p-3 rounded-md mb-6">{error}</p>}
          
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-slate-200 mb-4">Choose your difficulty:</h2>
            <div className="grid grid-cols-3 gap-4">
              {difficultyOptions.map(({ value, label, description }) => (
                <button
                  key={value}
                  onClick={() => setSelectedDifficulty(value)}
                  className={`p-4 border-2 rounded-lg transition-all duration-200 ${
                    selectedDifficulty === value
                      ? 'border-cyan-400 bg-cyan-900/50 shadow-lg shadow-cyan-500/20'
                      : 'border-slate-600 bg-slate-700/50 hover:border-cyan-500 hover:bg-slate-700'
                  }`}
                >
                  <span className="block text-xl font-bold capitalize">{label}</span>
                  <span className="block text-xs text-slate-400">{description}</span>
                </button>
              ))}
            </div>
          </div>
          
           <div className="mb-8 flex items-center justify-center gap-4 bg-slate-700/50 p-4 rounded-lg">
                <span className={`font-semibold transition-colors ${!isDynamicMode ? 'text-cyan-400' : 'text-slate-400'}`}>Classic Mode</span>
                <label htmlFor="game-mode-toggle" className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" id="game-mode-toggle" className="sr-only peer" checked={isDynamicMode} onChange={() => setIsDynamicMode(!isDynamicMode)} />
                    <div className="w-14 h-8 bg-slate-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-1 after:left-1 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-cyan-600"></div>
                </label>
                <span className={`font-semibold transition-colors ${isDynamicMode ? 'text-cyan-400' : 'text-slate-400'}`}>Dynamic AI Mode</span>
            </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button onClick={() => onStartGame(selectedDifficulty, isDynamicMode)} variant="primary" className="w-full sm:w-auto">
              Start Game
            </Button>
            <Button onClick={onShowScores} variant="secondary" className="w-full sm:w-auto">
              View All Scores
            </Button>
            {roundHistory && roundHistory.length > 0 && (
                <Button onClick={() => setShowReview(true)} variant="secondary" className="w-full sm:w-auto">
                    Review Last Round
                </Button>
            )}
          </div>

          {scores && scores.length > 0 && (
            <div className="mt-10 pt-6 border-t border-slate-700">
              <h3 className="text-xl font-semibold text-slate-300 mb-4 text-center">Top Guardians</h3>
              <ul className="space-y-2 max-w-md mx-auto">
                {scores.slice(0, 3).map((score, index) => (
                  <li key={index} className="flex justify-between items-center bg-slate-700/50 p-3 rounded-md text-left">
                    <div className="flex items-center">
                      <span className="text-lg font-bold text-cyan-400 w-6">{index + 1}.</span>
                      <span className="font-bold text-white truncate">{score.name}</span>
                    </div>
                    <span className="font-semibold text-cyan-400">{score.score} pts</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </Card>
      
      {showReview && (
          <ReviewModal history={roundHistory} onClose={() => setShowReview(false)} />
      )}
    </>
  );
};

export default StartScreen;