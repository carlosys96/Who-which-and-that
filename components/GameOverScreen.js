
import React, { useState } from 'react';
import Button from './common/Button.js';
import Card from './common/Card.js';

const getPerformanceMessage = (score, total) => {
    const percentage = (score / total) * 100;
    if (percentage === 100) return "Perfect Score! You're a Grammar Guardian!";
    if (percentage >= 80) return "Excellent work! You've nearly mastered it!";
    if (percentage >= 50) return "Good job! A little more practice and you'll be an expert.";
    return "Nice try! Keep practicing to improve your skills.";
}

const GameOverScreen = ({ score, totalQuestions, onRestart, onSaveScore }) => {
    const [name, setName] = useState('');
    const [isSaved, setIsSaved] = useState(false);

    const handleSave = () => {
        if (name.trim()) {
            onSaveScore(score, name.trim());
            setIsSaved(true);
        }
    }

  return (
      <Card>
        <div className="text-center">
          <h1 className="text-4xl font-bold text-cyan-400 mb-4">Round Complete!</h1>
          <p className="text-slate-300 text-lg mb-6">
            {getPerformanceMessage(score, totalQuestions)}
          </p>
          <div className="bg-slate-700/50 inline-block p-6 rounded-lg mb-8">
              <p className="text-slate-200 text-xl">Your Score</p>
              <p className="text-6xl font-bold text-white">{score} <span className="text-3xl text-slate-400">/ {totalQuestions}</span></p>
          </div>
          
          {!isSaved ? (
               <div className="max-w-sm mx-auto flex flex-col sm:flex-row gap-2 mb-8">
                  <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter your name"
                      aria-label="Enter your name for the high score list"
                      className="flex-grow p-3 bg-slate-700 border-2 border-slate-600 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition duration-200 text-lg"
                  />
                  <Button onClick={handleSave} disabled={!name.trim()}>
                      Save Score
                  </Button>
              </div>
          ) : (
              <p className="text-green-400 font-semibold mb-8">Your score has been saved!</p>
          )}

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button onClick={onRestart} variant="primary">Play Again</Button>
            <Button onClick={onRestart} variant="secondary">Back to Menu</Button>
          </div>
        </div>
      </Card>
  );
};

export default GameOverScreen;