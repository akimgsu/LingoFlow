import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  ReactNode,
} from 'react';
import { useAuth } from './AuthContext';
import {
  DEFAULT_PROGRESS,
  saveUserProgress,
  subscribeUserProgress,
} from '../services/progressService';
import { UserProgress } from '../types';

interface ProgressContextType {
  loading: boolean;
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

function calcLevelFields(xp: number) {
  const level = Math.floor(xp / 100) + 1;
  const currentLevelBaseXp = (level - 1) * 100;
  const nextLevelXp = level * 100;
  const levelProgress = Math.min(100, Math.max(0, ((xp - currentLevelBaseXp) / 100) * 100));
  return { level, nextLevelXp, levelProgress };
}

export function ProgressProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [progress, setProgress] = useState<UserProgress>(DEFAULT_PROGRESS);
  const [loading, setLoading] = useState(true);
  const userIdRef = useRef<string | null>(null);
  const skipPersistRef = useRef(false);

  useEffect(() => {
    if (!user) {
      userIdRef.current = null;
      skipPersistRef.current = true;
      setProgress({ ...DEFAULT_PROGRESS });
      setLoading(false);
      return;
    }

    userIdRef.current = user.uid;
    setLoading(true);

    const unsubscribe = subscribeUserProgress(
      user.uid,
      (remoteProgress) => {
        skipPersistRef.current = true;
        setProgress(remoteProgress);
        setLoading(false);
      },
      (error) => {
        console.warn('[ProgressContext] Firestore sync error:', error);
        setLoading(false);
      },
    );

    return () => unsubscribe();
  }, [user?.uid]);

  const updateProgress = useCallback((updater: (prev: UserProgress) => UserProgress) => {
    setProgress((prev) => {
      const next = updater(prev);
      const uid = userIdRef.current;

      if (uid && !skipPersistRef.current) {
        void saveUserProgress(uid, next).catch((err) => {
          console.warn('[ProgressContext] Failed to save progress:', err);
        });
      }

      skipPersistRef.current = false;
      return next;
    });
  }, []);

  const addXp = useCallback((amount: number) => {
    updateProgress((prev) => ({
      ...prev,
      xp: prev.xp + amount,
      streak: prev.streak === 0 ? 1 : prev.streak,
    }));
  }, [updateProgress]);

  const loseHeart = useCallback(() => {
    updateProgress((prev) => ({
      ...prev,
      hearts: prev.hearts <= 1 ? 5 : prev.hearts - 1,
    }));
  }, [updateProgress]);

  const resetHearts = useCallback(() => {
    updateProgress((prev) => ({ ...prev, hearts: 5 }));
  }, [updateProgress]);

  const markMastered = useCallback((id: string) => {
    updateProgress((prev) =>
      prev.masteredIds.includes(id)
        ? prev
        : { ...prev, masteredIds: [...prev.masteredIds, id] },
    );
  }, [updateProgress]);

  const isMastered = useCallback(
    (id: string) => progress.masteredIds.includes(id),
    [progress.masteredIds],
  );

  const { level, nextLevelXp, levelProgress } = calcLevelFields(progress.xp);

  return (
    <ProgressContext.Provider
      value={{
        loading,
        streak: progress.streak,
        hearts: progress.hearts,
        xp: progress.xp,
        level,
        levelProgress,
        nextLevelXp,
        masteredIds: progress.masteredIds,
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
