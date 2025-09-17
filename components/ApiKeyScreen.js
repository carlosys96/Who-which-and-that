
import React, { useState } from 'react';
import Card from './common/Card.js';
import Button from './common/Button.js';
import { GAME_TITLE } from '../constants.js';

const ApiKeyScreen = ({ onKeySubmit }) => {
  const [apiKey, setApiKey] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (apiKey.trim()) {
      onKeySubmit(apiKey.trim());
    }
  };

  return (
    <Card>
      <div className="text-center">
        <h1 className="text-5xl font-bold text-cyan-400 mb-2">{GAME_TITLE}</h1>
        <p className="text-slate-300 mb-8 text-lg">Enter your Gemini API Key to begin.</p>
        
        <form onSubmit={handleSubmit} className="max-w-md mx-auto">
          <label htmlFor="apiKey" className="sr-only">Gemini API Key</label>
          <input
            id="apiKey"
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="Enter your Gemini API Key"
            className="w-full p-3 bg-slate-700 border-2 border-slate-600 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition duration-200 text-lg mb-4"
            aria-label="Gemini API Key Input"
          />
          <Button type="submit" disabled={!apiKey.trim()} className="w-full">
            Start Playing
          </Button>
        </form>
        <div className="mt-6 text-sm text-slate-400 bg-slate-900/50 p-3 rounded-md">
            <p className="font-bold">Important:</p>
            <p>Your API key is stored only in your browser's session and is never sent anywhere except to the Google AI API. Close the tab to clear it.</p>
            <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline mt-2 inline-block">
                Get your API Key from Google AI Studio
            </a>
        </div>
      </div>
    </Card>
  );
};

export default ApiKeyScreen;