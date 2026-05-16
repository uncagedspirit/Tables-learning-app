import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import './src/config/firebase';
import { analytics, logEvent } from './src/config/firebase';
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

  // Track screen views in Firebase Analytics
  useEffect(() => {
    logEvent(analytics, 'screen_view', {
      screen_name: currentScreen,
      screen_class: currentScreen.charAt(0).toUpperCase() + currentScreen.slice(1),
    });
  }, [currentScreen]);

  const handleStartPractice = (mode) => {
    // Track practice session start
    logEvent(analytics, 'practice_started', {
      mode: mode,
    });
    setQuizMode(mode);
    setCurrentScreen('quiz');
  };

  const handleReviewMistakes = (mode) => {
    setQuizMode(mode);
    setCurrentScreen('quiz');
  };

  const handleLearnTables = () => {
    logEvent(analytics, 'learn_tables_opened');
    setCurrentScreen('learn');
  };

  const handleEndSession = (sessionResults) => {
    // Track quiz completion in Firebase Analytics
    logEvent(analytics, 'quiz_completed', {
      mode: sessionResults.mode,
      total_questions: sessionResults.total,
      correct_answers: sessionResults.correct,
      wrong_answers: sessionResults.wrong,
      score_percentage: sessionResults.total > 0 
        ? Math.round((sessionResults.correct / sessionResults.total) * 100) 
        : 0,
    });
    
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