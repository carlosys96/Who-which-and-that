import React, { useState, useCallback } from 'react';
import { GameState, Difficulty, Question, Score, AnswerRecord } from './types';
import { getStaticQuestions } from './data/staticQuestions';
import StartScreen from './components/StartScreen';
import GameScreen from './components/GameScreen';
import GameOverScreen from './components/GameOverScreen';
import HighScoresScreen from './components/HighScoresScreen';
import Loader from './components/common/Loader';
import { QUESTIONS_PER_ROUND } from './constants';
import useLocalStorage from './hooks/useLocalStorage';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(GameState.START);
  const [difficulty, setDifficulty] = useState<Difficulty>(Difficulty.MEDIUM);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [highScores, setHighScores] = useLocalStorage<Score[]>('grammar-guardians-scores', []);
  const [lastRoundHistory, setLastRoundHistory] = useState<AnswerRecord[]>([]);

  const startGame = useCallback((selectedDifficulty: Difficulty) => {
    setIsLoading(true);
    setError(null);
    setDifficulty(selectedDifficulty);

    // Simulate a short delay for a smoother loading experience
    setTimeout(() => {
      try {
        const fetchedQuestions = getStaticQuestions(selectedDifficulty);
        if (fetchedQuestions.length < QUESTIONS_PER_ROUND) {
            throw new Error("Not enough questions available for this difficulty.");
        }
        setQuestions(fetchedQuestions);
        setCurrentQuestionIndex(0);
        setScore(0);
        setLastRoundHistory([]);
        setGameState(GameState.PLAYING);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to start the game.');
        setGameState(GameState.START);
      } finally {
        setIsLoading(false);
      }
    }, 500);
  }, []);

  const handleAnswer = (details: { userAnswer: string; isCorrect: boolean }) => {
    if (details.isCorrect) {
      setScore(prev => prev + 1);
    }
    const currentQuestion = questions[currentQuestionIndex];
    const record: AnswerRecord = {
      question: currentQuestion,
      userAnswer: details.userAnswer,
      isCorrect: details.isCorrect,
    };
    setLastRoundHistory(prev => [...prev, record]);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < QUESTIONS_PER_ROUND - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      setGameState(GameState.GAME_OVER);
    }
  };

  const saveHighScore = useCallback((finalScore: number, name: string) => {
    const newScore: Score = { name, score: finalScore, date: new Date().toISOString().split('T')[0], difficulty };
    const newHighScores = [...highScores, newScore]
      .sort((a, b) => b.score - a.score || a.date.localeCompare(b.date))
      .slice(0, 10);
    setHighScores(newHighScores);
  }, [highScores, difficulty, setHighScores]);
  

  const restartGame = () => {
    setGameState(GameState.START);
  };

  const viewHighScores = () => {
    setGameState(GameState.HIGH_SCORES);
  };

  const renderContent = () => {
    if (isLoading) {
      return <Loader message="Preparing your grammar challenge..." />;
    }

    switch (gameState) {
      case GameState.PLAYING:
        return (
          <GameScreen
            question={questions[currentQuestionIndex]}
            onAnswer={handleAnswer}
            onNextQuestion={handleNextQuestion}
            questionNumber={currentQuestionIndex + 1}
            totalQuestions={QUESTIONS_PER_ROUND}
            score={score}
          />
        );
      case GameState.GAME_OVER:
        return <GameOverScreen 
                    score={score} 
                    totalQuestions={QUESTIONS_PER_ROUND} 
                    onRestart={restartGame} 
                    onSaveScore={saveHighScore}
                />;
      case GameState.HIGH_SCORES:
        return <HighScoresScreen scores={highScores} onBack={restartGame} />;
      case GameState.START:
      default:
        return <StartScreen 
                  onStartGame={startGame} 
                  onShowScores={viewHighScores}
                  error={error} 
                  scores={highScores}
                  roundHistory={lastRoundHistory}
               />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-2xl mx-auto">
        {renderContent()}
      </div>
    </div>
  );
};

export default App;