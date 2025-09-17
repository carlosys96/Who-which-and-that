import React, { useState } from 'react';
import { Difficulty, Score, AnswerRecord, QuestionType } from '../types';
import { GAME_TITLE } from '../constants';
import Button from './common/Button';
import Card from './common/Card';

interface StartScreenProps {
  onStartGame: (difficulty: Difficulty) => void;
  onShowScores: () => void;
  error: string | null;
  scores: Score[];
  roundHistory: AnswerRecord[];
}

const REVIEW_PASSWORD = "270219";

const PasswordPrompt: React.FC<{onCorrect: () => void; onCancel: () => void}> = ({ onCorrect, onCancel }) => {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (password === REVIEW_PASSWORD) {
            onCorrect();
        } else {
            setError('Incorrect password.');
            setPassword('');
        }
    };

    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-sm" onClick={(e) => e.stopPropagation()}>
                <form onSubmit={handleSubmit}>
                    <h2 className="text-2xl font-bold text-center text-cyan-400 mb-4">Enter Password</h2>
                    <p className="text-slate-400 text-center mb-6">Enter the password to review your answers.</p>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                        aria-label="Enter password"
                        className="w-full p-3 bg-slate-700 border-2 border-slate-600 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition duration-200 text-lg mb-4"
                    />
                    {error && <p className="text-red-400 text-center mb-4">{error}</p>}
                    <div className="flex gap-4">
                        <Button type="button" onClick={onCancel} variant="secondary" className="w-full">Cancel</Button>
                        <Button type="submit" className="w-full">Submit</Button>
                    </div>
                </form>
            </Card>
        </div>
    );
};

const ReviewModal: React.FC<{history: AnswerRecord[]; onClose: () => void}> = ({ history, onClose }) => {
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
                                {record.question.type === QuestionType.FILL_IN_THE_BLANK 
                                    ? record.question.sentence.replace('___', `[${record.question.correctAnswer}]`)
                                    : record.question.prompt
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

const StartScreen: React.FC<StartScreenProps> = ({ onStartGame, onShowScores, error, scores, roundHistory }) => {
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>(Difficulty.MEDIUM);
  const [showPasswordPrompt, setShowPasswordPrompt] = useState(false);
  const [showReview, setShowReview] = useState(false);

  const difficultyOptions: { value: Difficulty; label: string; description: string }[] = [
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
          
          <div className="mb-8">
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

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button onClick={() => onStartGame(selectedDifficulty)} variant="primary" className="w-full sm:w-auto">
              Start Game
            </Button>
            <Button onClick={onShowScores} variant="secondary" className="w-full sm:w-auto">
              View All Scores
            </Button>
            {roundHistory && roundHistory.length > 0 && (
                <Button onClick={() => setShowPasswordPrompt(true)} variant="secondary" className="w-full sm:w-auto">
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
      
      {showPasswordPrompt && (
        <PasswordPrompt 
            onCorrect={() => {
                setShowPasswordPrompt(false);
                setShowReview(true);
            }}
            onCancel={() => setShowPasswordPrompt(false)}
        />
      )}

      {showReview && (
          <ReviewModal history={roundHistory} onClose={() => setShowReview(false)} />
      )}
    </>
  );
};

export default StartScreen;