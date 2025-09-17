
import React from 'react';
import Button from './common/Button';
import Card from './common/Card';

const HighScoresScreen = ({ scores, onBack }) => {
  return (
    <Card>
      <h1 className="text-4xl font-bold text-center text-cyan-400 mb-6">High Scores</h1>
      <div className="w-full max-w-lg mx-auto">
        {scores.length > 0 ? (
          <div className="space-y-3">
            <div className="grid grid-cols-[2fr,1fr,1fr,1fr] gap-4 text-slate-400 font-semibold px-4">
              <span>Name</span>
              <span className="text-center">Score</span>
              <span className="text-center">Difficulty</span>
              <span className="text-right">Date</span>
            </div>
            {scores.map((score, index) => (
              <div key={index} className="grid grid-cols-[2fr,1fr,1fr,1fr] gap-4 p-4 bg-slate-700/50 rounded-lg items-center">
                <span className="font-semibold text-white truncate">{score.name}</span>
                <span className="text-xl font-bold text-cyan-400 text-center">{score.score}</span>
                <span className="capitalize text-slate-300 text-center">{score.difficulty}</span>
                <span className="text-right text-slate-400">{score.date}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-slate-400 py-8">No high scores yet. Be the first!</p>
        )}
      </div>
      <div className="text-center mt-8">
        <Button onClick={onBack} variant="secondary">Back to Menu</Button>
      </div>
    </Card>
  );
};

export default HighScoresScreen;