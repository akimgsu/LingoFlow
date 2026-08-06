import React, { createContext, useState, useEffect, useContext } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../firebaseConfig';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  guestLogin?: () => void;
}

const AuthContext = createContext<AuthContextType>({ user: null, loading: true });

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const guestLogin = () => {
    // Mock user to bypass Firebase Auth for UI testing
    setUser({ uid: 'guest123', email: 'guest@lingoflow.com' } as User);
    setLoading(false);
  };

  useEffect(() => {
    // We try to use Firebase auth, but if Firebase is unconfigured, it might fail silently or error
    try {
      const unsubscribe = onAuthStateChanged(auth, (usr) => {
        setUser(usr);
        setLoading(false);
      });
      return unsubscribe;
    } catch (e) {
      console.warn("Firebase Auth not configured yet. Guest mode available.");
      setLoading(false);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, guestLogin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
