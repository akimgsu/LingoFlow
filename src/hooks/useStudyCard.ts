import { useState, useRef } from 'react';
import { Animated } from 'react-native';
import { Expression } from '../types';
import { playExpressionAudio } from '../utils/audioPlayer';
import { useProgress } from '../contexts/ProgressContext';

/**
 * Encapsulates all flashcard study state and actions.
 * Used by app/study.tsx.
 */
export function useStudyCard(expressions: Expression[]) {
  const { addXp, loseHeart } = useProgress();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isQuizMode, setIsQuizMode] = useState(false);
  const flipAnim = useRef(new Animated.Value(0)).current;

  const currentExpression = expressions[currentIndex];
  const progressPercentage = ((currentIndex + 1) / expressions.length) * 100;
  const isFirst = currentIndex === 0;
  const isLast  = currentIndex === expressions.length - 1;

  // ── Animations ─────────────────────────────────────────────
  const frontInterpolate = flipAnim.interpolate({ inputRange: [0, 180], outputRange: ['0deg', '180deg'] });
  const backInterpolate  = flipAnim.interpolate({ inputRange: [0, 180], outputRange: ['180deg', '360deg'] });

  const frontAnimStyle = { transform: [{ rotateY: frontInterpolate }] };
  const backAnimStyle  = {
    transform: [{ rotateY: backInterpolate }],
    position: 'absolute' as const,
    top: 0,
    opacity: isFlipped ? 1 : 0,
  };

  // ── Actions ────────────────────────────────────────────────
  const resetCard = () => {
    flipAnim.setValue(0);
    setIsFlipped(false);
  };

  const flipCard = () => {
    Animated.spring(flipAnim, {
      toValue: isFlipped ? 0 : 180,
      friction: 8,
      tension: 10,
      useNativeDriver: true,
    }).start();
    setIsFlipped(prev => !prev);
  };

  const toggleQuizMode = () => {
    resetCard();
    setIsQuizMode(prev => !prev);
  };

  const goNext = (mastered: boolean): 'next' | 'done' => {
    if (mastered) addXp(10); else loseHeart();
    resetCard();
    if (!isLast) {
      setCurrentIndex(prev => prev + 1);
      return 'next';
    }
    return 'done';
  };

  const goPrev = () => {
    if (!isFirst) {
      resetCard();
      setCurrentIndex(prev => prev - 1);
    }
  };

  const goForward = () => {
    if (!isLast) {
      resetCard();
      setCurrentIndex(prev => prev + 1);
    }
  };

  const playAudio = () => {
    if (currentExpression) {
      playExpressionAudio(currentExpression.id, currentExpression.english);
    }
  };

  return {
    currentExpression,
    currentIndex,
    progressPercentage,
    isFlipped,
    isQuizMode,
    isFirst,
    isLast,
    frontAnimStyle,
    backAnimStyle,
    // actions
    flipCard,
    toggleQuizMode,
    goNext,
    goPrev,
    goForward,
    playAudio,
  };
}
