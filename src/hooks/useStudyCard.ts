import { useState, useRef, useCallback } from 'react';
import { Animated } from 'react-native';
import { Expression, StudySessionStats } from '../types';
import { playExpressionAudio, stopExpressionAudio } from '../utils/audioPlayer';
import { useProgress } from '../contexts/ProgressContext';

export function useStudyCard(expressions: Expression[]) {
  const { addXp, loseHeart, markMastered } = useProgress();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isQuizMode, setIsQuizMode] = useState(false);
  const [sessionStats, setSessionStats] = useState<StudySessionStats>({
    totalStudied: 0,
    masteredCount: 0,
    reviewCount: 0,
    xpEarned: 0,
  });

  const flipAnim = useRef(new Animated.Value(0)).current;

  const currentExpression = expressions[currentIndex] || expressions[0];
  const totalCount = expressions.length;
  const progressPercentage = totalCount > 0 ? ((currentIndex + 1) / totalCount) * 100 : 0;
  const isFirst = currentIndex === 0;
  const isLast = currentIndex === totalCount - 1;

  // ── Card 3D Flip Interpolation ─────────────────────────────────────────
  const frontInterpolate = flipAnim.interpolate({
    inputRange: [0, 180],
    outputRange: ['0deg', '180deg'],
  });
  const backInterpolate = flipAnim.interpolate({
    inputRange: [0, 180],
    outputRange: ['180deg', '360deg'],
  });

  const frontAnimStyle = { transform: [{ rotateY: frontInterpolate }] };
  const backAnimStyle = {
    transform: [{ rotateY: backInterpolate }],
    position: 'absolute' as const,
    top: 0,
    opacity: isFlipped ? 1 : 0,
  };

  // ── Card Actions ──────────────────────────────────────────────────────
  const resetCardAnimation = () => {
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
    setIsFlipped((prev) => !prev);
  };

  const toggleQuizMode = () => {
    stopExpressionAudio();
    resetCardAnimation();
    setIsQuizMode((prev) => !prev);
  };

  const goNext = (mastered: boolean): 'next' | 'done' => {
    stopExpressionAudio();

    if (currentExpression) {
      if (mastered) {
        addXp(15);
        markMastered(currentExpression.id);
        setSessionStats((prev) => ({
          ...prev,
          totalStudied: prev.totalStudied + 1,
          masteredCount: prev.masteredCount + 1,
          xpEarned: prev.xpEarned + 15,
        }));
      } else {
        loseHeart();
        setSessionStats((prev) => ({
          ...prev,
          totalStudied: prev.totalStudied + 1,
          reviewCount: prev.reviewCount + 1,
        }));
      }
    }

    resetCardAnimation();

    if (!isLast) {
      setCurrentIndex((prev) => prev + 1);
      return 'next';
    }

    return 'done';
  };

  const goPrev = () => {
    if (!isFirst) {
      stopExpressionAudio();
      resetCardAnimation();
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const goForward = () => {
    if (!isLast) {
      stopExpressionAudio();
      resetCardAnimation();
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const playAudio = useCallback(() => {
    if (currentExpression) {
      playExpressionAudio(currentExpression.id, currentExpression.english);
    }
  }, [currentExpression]);

  const resetSession = () => {
    stopExpressionAudio();
    resetCardAnimation();
    setCurrentIndex(0);
    setSessionStats({
      totalStudied: 0,
      masteredCount: 0,
      reviewCount: 0,
      xpEarned: 0,
    });
  };

  return {
    currentExpression,
    currentIndex,
    totalCount,
    progressPercentage,
    isFlipped,
    isQuizMode,
    isFirst,
    isLast,
    sessionStats,
    frontAnimStyle,
    backAnimStyle,
    flipCard,
    toggleQuizMode,
    goNext,
    goPrev,
    goForward,
    playAudio,
    resetSession,
  };
}
