import React, { createContext, useContext, useState, ReactNode } from 'react';

type ProgressContextType = {
  streak: number;
  hearts: number;
  xp: number;
  addXp: (amount: number) => void;
  loseHeart: () => void;
  resetHearts: () => void;
};

const ProgressContext = createContext<ProgressContextType | undefined>(undefined);

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [streak, setStreak] = useState(0);
  const [hearts, setHearts] = useState(5);
  const [xp, setXp] = useState(0);

  const addXp = (amount: number) => {
    setXp((prev) => prev + amount);
    // If they gain XP, we could also assume they kept their streak alive for the day.
    // For simplicity, we just set streak to 1 if it was 0 when they gain their first XP.
    if (streak === 0) setStreak(1);
  };

  const loseHeart = () => {
    setHearts((prev) => {
      if (prev <= 1) {
        // Auto-replenish back to 5 so study is never stuck
        return 5;
      }
      return prev - 1;
    });
  };

  const resetHearts = () => {
    setHearts(5);
  };

  return (
    <ProgressContext.Provider value={{ streak, hearts, xp, addXp, loseHeart, resetHearts }}>
      {children}
    </ProgressContext.Provider>
  );
}

export function useProgress() {
  const context = useContext(ProgressContext);
  if (context === undefined) {
    throw new Error('useProgress must be used within a ProgressProvider');
  }
  return context;
}
