import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { User, onAuthStateChanged, signOut as firebaseSignOut } from 'firebase/auth';
import { auth } from '../../firebaseConfig';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  logout: () => Promise<void>;
  displayName: string;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  logout: async () => {},
  displayName: 'Learner',
});

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    // Safety fallback: if auth state doesn't resolve within 2.5s, unblock loading
    const safetyTimer = setTimeout(() => {
      if (isMounted) {
        setLoading(false);
      }
    }, 2500);

    let unsubscribe: (() => void) | null = null;

    try {
      unsubscribe = onAuthStateChanged(
        auth,
        (currentUser) => {
          if (isMounted) {
            setUser(currentUser);
            setLoading(false);
            clearTimeout(safetyTimer);
          }
        },
        (error) => {
          console.warn('[AuthContext] onAuthStateChanged warning:', error);
          if (isMounted) {
            setLoading(false);
            clearTimeout(safetyTimer);
          }
        }
      );
    } catch (err) {
      console.warn('[AuthContext] Auth initialization error:', err);
      if (isMounted) {
        setLoading(false);
        clearTimeout(safetyTimer);
      }
    }

    return () => {
      isMounted = false;
      clearTimeout(safetyTimer);
      if (unsubscribe) unsubscribe();
    };
  }, []);

  const logout = async () => {
    try {
      await firebaseSignOut(auth);
    } catch (err) {
      console.warn('[AuthContext] Sign out error:', err);
    }
  };

  const displayName = user?.displayName || (user?.email ? user.email.split('@')[0] : 'Learner');

  return (
    <AuthContext.Provider value={{ user, loading, logout, displayName }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
