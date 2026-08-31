import { useState, useRef, useCallback, useEffect } from 'react';
import { Animated } from 'react-native';
import { Expression, StudySessionStats } from '../types';
import { playExpressionAudio, stopExpressionAudio, delay } from '../utils/audioPlayer';
import { useProgress } from '../contexts/ProgressContext';

const AUTO_REVIEW_PAUSE_MS = 4000;

export function useStudyCard(expressions: Expression[]) {
  const { addXp, markMastered } = useProgress();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isQuizMode, setIsQuizMode] = useState(false);
  const [isAutoReviewing, setIsAutoReviewing] = useState(false);
  const [sessionStats, setSessionStats] = useState<StudySessionStats>({
    totalStudied: 0,
    masteredCount: 0,
    reviewCount: 0,
    xpEarned: 0,
  });

  const flipAnim = useRef(new Animated.Value(0)).current;
  const autoReviewActiveRef = useRef(false);

  const currentExpression = expressions[currentIndex] || expressions[0];
  const totalCount = expressions.length;
  const progressPercentage = totalCount > 0 ? ((currentIndex + 1) / totalCount) * 100 : 0;
  const isFirst = currentIndex === 0;
  const isLast = currentIndex === totalCount - 1;

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

  const resetCardAnimation = () => {
    flipAnim.setValue(0);
    setIsFlipped(false);
  };

  const flipToBack = () =>
    new Promise<void>((resolve) => {
      setIsFlipped(true);
      Animated.spring(flipAnim, {
        toValue: 180,
        friction: 8,
        tension: 10,
        useNativeDriver: true,
      }).start(() => resolve());
    });

  const stopAutoReview = useCallback(() => {
    autoReviewActiveRef.current = false;
    setIsAutoReviewing(false);
    void stopExpressionAudio();
  }, []);

  useEffect(() => {
    return () => {
      autoReviewActiveRef.current = false;
      void stopExpressionAudio();
    };
  }, []);

  const flipCard = () => {
    if (autoReviewActiveRef.current) return;
    Animated.spring(flipAnim, {
      toValue: isFlipped ? 0 : 180,
      friction: 8,
      tension: 10,
      useNativeDriver: true,
    }).start();
    setIsFlipped((prev) => !prev);
  };

  const toggleQuizMode = () => {
    if (autoReviewActiveRef.current) return;
    stopExpressionAudio();
    resetCardAnimation();
    setIsQuizMode((prev) => !prev);
  };

  const goNext = (mastered: boolean): 'next' | 'done' => {
    if (autoReviewActiveRef.current) return 'next';
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
    if (autoReviewActiveRef.current || isFirst) return;
    stopExpressionAudio();
    resetCardAnimation();
    setCurrentIndex((prev) => prev - 1);
  };

  const goForward = () => {
    if (autoReviewActiveRef.current || isLast) return;
    stopExpressionAudio();
    resetCardAnimation();
    setCurrentIndex((prev) => prev + 1);
  };

  const playAudio = useCallback(() => {
    if (autoReviewActiveRef.current) return;
    if (currentExpression) {
      void playExpressionAudio(currentExpression.id, currentExpression.english);
    }
  }, [currentExpression]);

  const startAutoReview = useCallback(async (): Promise<'done' | 'stopped'> => {
    if (autoReviewActiveRef.current) {
      stopAutoReview();
      return 'stopped';
    }

    if (expressions.length === 0) return 'stopped';

    const startIndex = currentIndex;
    autoReviewActiveRef.current = true;
    setIsAutoReviewing(true);
    setIsQuizMode(false);
    resetCardAnimation();

    for (let i = startIndex; i < expressions.length; i++) {
      if (!autoReviewActiveRef.current) {
        return 'stopped';
      }

      setCurrentIndex(i);
      resetCardAnimation();

      // Let FlashCard re-render before speaking
      await delay(80);
      if (!autoReviewActiveRef.current) {
        return 'stopped';
      }

      const expression = expressions[i];
      // 1) Show English + speak
      await playExpressionAudio(expression.id, expression.english);

      if (!autoReviewActiveRef.current) {
        return 'stopped';
      }

      // 2) Flip to show Korean
      await flipToBack();

      if (!autoReviewActiveRef.current) {
        return 'stopped';
      }

      // 3) Pause so learner can read Korean, then next card
      await delay(AUTO_REVIEW_PAUSE_MS);
    }

    if (!autoReviewActiveRef.current) {
      return 'stopped';
    }

    const reviewedCount = expressions.length - startIndex;
    autoReviewActiveRef.current = false;
    setIsAutoReviewing(false);
    setSessionStats((prev) => ({
      ...prev,
      totalStudied: prev.totalStudied + reviewedCount,
      reviewCount: prev.reviewCount + reviewedCount,
    }));

    return 'done';
  }, [expressions, currentIndex, stopAutoReview]);

  const resetSession = () => {
    stopAutoReview();
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
    isAutoReviewing,
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
    startAutoReview,
    stopAutoReview,
    resetSession,
  };
}
