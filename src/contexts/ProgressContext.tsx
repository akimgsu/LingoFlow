import React, { createContext, useContext, useState, ReactNode } from 'react';

interface ProgressContextType {
  streak: number;
  hearts: number;
  xp: number;
  level: number;
  levelProgress: number;
  nextLevelXp: number;
  masteredIds: string[];
  addXp: (amount: number) => void;
  loseHeart: () => void;
  resetHearts: () => void;
  markMastered: (id: string) => void;
  isMastered: (id: string) => boolean;
}

const ProgressContext = createContext<ProgressContextType | undefined>(undefined);

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [streak, setStreak] = useState<number>(1);
  const [hearts, setHearts] = useState<number>(5);
  const [xp, setXp] = useState<number>(120);
  const [masteredIds, setMasteredIds] = useState<string[]>([]);

  // Level calculations: every 100 XP is 1 Level
  const level = Math.floor(xp / 100) + 1;
  const currentLevelBaseXp = (level - 1) * 100;
  const nextLevelXp = level * 100;
  const levelProgress = Math.min(100, Math.max(0, ((xp - currentLevelBaseXp) / 100) * 100));

  const addXp = (amount: number) => {
    setXp((prev) => prev + amount);
    if (streak === 0) setStreak(1);
  };

  const loseHeart = () => {
    setHearts((prev) => {
      if (prev <= 1) {
        // Auto-replenish so study sessions never get permanently blocked
        return 5;
      }
      return prev - 1;
    });
  };

  const resetHearts = () => {
    setHearts(5);
  };

  const markMastered = (id: string) => {
    setMasteredIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
  };

  const isMastered = (id: string) => masteredIds.includes(id);

  return (
    <ProgressContext.Provider
      value={{
        streak,
        hearts,
        xp,
        level,
        levelProgress,
        nextLevelXp,
        masteredIds,
        addXp,
        loseHeart,
        resetHearts,
        markMastered,
        isMastered,
      }}
    >
      {children}
    </ProgressContext.Provider>
  );
}

export function useProgress(): ProgressContextType {
  const context = useContext(ProgressContext);
  if (!context) {
    throw new Error('useProgress must be used within a ProgressProvider');
  }
  return context;
}
