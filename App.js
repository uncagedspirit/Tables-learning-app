import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import './src/config/firebase'; // Initialize Firebase
import HomeScreen from './src/screens/HomeScreen';
import QuizScreen from './src/screens/QuizScreen';
import ResultsScreen from './src/screens/ResultsScreen';
import { colors } from './src/utils/theme';

export default function App() {
  // Navigation state: 'home' | 'quiz' | 'results'
  const [currentScreen, setCurrentScreen] = useState('home');
  
  // Quiz state
  const [quizMode, setQuizMode] = useState('practice'); // 'practice' | 'mistakes'
  
  // Results state
  const [results, setResults] = useState({
    total: 0,
    correct: 0,
    wrong: 0,
    mode: 'practice',
  });

  // Handlers for HomeScreen
  const handleStartPractice = (mode) => {
    setQuizMode(mode);
    setCurrentScreen('quiz');
  };

  const handleReviewMistakes = (mode) => {
    setQuizMode(mode);
    setCurrentScreen('quiz');
  };

  // Handlers for QuizScreen
  const handleEndSession = (sessionResults) => {
    setResults(sessionResults);
    setCurrentScreen('results');
  };

  const handleNavigateHome = () => {
    setCurrentScreen('home');
  };

  // Handlers for ResultsScreen
  const handlePracticeAgain = (mode) => {
    setQuizMode(mode);
    setCurrentScreen('quiz');
  };

  const handleBackToHome = () => {
    setCurrentScreen('home');
  };

  return (
    <SafeAreaProvider>
      <StatusBar barStyle="light-content" backgroundColor={colors.bg} />
      {currentScreen === 'home' && (
        <HomeScreen
          onStartPractice={handleStartPractice}
          onReviewMistakes={handleReviewMistakes}
        />
      )}
      {currentScreen === 'quiz' && (
        <QuizScreen
          mode={quizMode}
          onEndSession={handleEndSession}
          onNavigateHome={handleNavigateHome}
        />
      )}
      {currentScreen === 'results' && (
        <ResultsScreen
          total={results.total}
          correct={results.correct}
          wrong={results.wrong}
          mode={results.mode}
          onPracticeAgain={handlePracticeAgain}
          onBackToHome={handleBackToHome}
        />
      )}
    </SafeAreaProvider>
  );
}