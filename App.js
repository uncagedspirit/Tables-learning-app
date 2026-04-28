import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import './src/config/firebase';
import HomeScreen from './src/screens/HomeScreen';
import QuizScreen from './src/screens/QuizScreen';
import ResultsScreen from './src/screens/ResultsScreen';
import LearnScreen from './src/screens/LearnScreen';
import { colors } from './src/utils/theme';
import { initSounds } from './src/utils/sounds';

export default function App() {
  // Navigation state: 'home' | 'quiz' | 'results' | 'learn'
  const [currentScreen, setCurrentScreen] = useState('home');
  const [quizMode, setQuizMode] = useState('practice');
  const [results, setResults] = useState({
    total: 0,
    correct: 0,
    wrong: 0,
    mode: 'practice',
  });

  useEffect(() => {
    initSounds();
  }, []);

  const handleStartPractice = (mode) => {
    setQuizMode(mode);
    setCurrentScreen('quiz');
  };

  const handleReviewMistakes = (mode) => {
    setQuizMode(mode);
    setCurrentScreen('quiz');
  };

  const handleLearnTables = () => {
    setCurrentScreen('learn');
  };

  const handleEndSession = (sessionResults) => {
    setResults(sessionResults);
    setCurrentScreen('results');
  };

  const handleNavigateHome = () => {
    setCurrentScreen('home');
  };

  const handlePracticeAgain = (mode) => {
    setQuizMode(mode);
    setCurrentScreen('quiz');
  };

  const handleBackToHome = () => {
    setCurrentScreen('home');
  };

  return (
    <SafeAreaProvider>
      <StatusBar style="light" backgroundColor={colors.bg} />
      {currentScreen === 'home' && (
        <HomeScreen
          onStartPractice={handleStartPractice}
          onReviewMistakes={handleReviewMistakes}
          onLearnTables={handleLearnTables}
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
      {currentScreen === 'learn' && (
        <LearnScreen onBack={handleNavigateHome} />
      )}
    </SafeAreaProvider>
  );
}