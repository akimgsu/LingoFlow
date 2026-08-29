import { doc, onSnapshot, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import { UserProgress } from '../types';

export const DEFAULT_PROGRESS: UserProgress = {
  streak: 1,
  hearts: 5,
  xp: 0,
  masteredIds: [],
};

function progressDocRef(userId: string) {
  return doc(db, 'users', userId, 'progress', 'data');
}

function normalizeProgress(data: Record<string, unknown> | undefined): UserProgress {
  if (!data) return { ...DEFAULT_PROGRESS };

  return {
    streak: typeof data.streak === 'number' ? data.streak : DEFAULT_PROGRESS.streak,
    hearts: typeof data.hearts === 'number' ? data.hearts : DEFAULT_PROGRESS.hearts,
    xp: typeof data.xp === 'number' ? data.xp : DEFAULT_PROGRESS.xp,
    masteredIds: Array.isArray(data.masteredIds)
      ? data.masteredIds.filter((id): id is string => typeof id === 'string')
      : [],
  };
}

export function subscribeUserProgress(
  userId: string,
  onData: (progress: UserProgress) => void,
  onError?: (error: Error) => void,
): () => void {
  return onSnapshot(
    progressDocRef(userId),
    (snapshot) => {
      if (!snapshot.exists()) {
        onData({ ...DEFAULT_PROGRESS });
        void saveUserProgress(userId, DEFAULT_PROGRESS);
        return;
      }
      onData(normalizeProgress(snapshot.data()));
    },
    (error) => onError?.(error),
  );
}

export async function saveUserProgress(userId: string, progress: UserProgress): Promise<void> {
  await setDoc(
    progressDocRef(userId),
    {
      streak: progress.streak,
      hearts: progress.hearts,
      xp: progress.xp,
      masteredIds: progress.masteredIds,
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  );
}
