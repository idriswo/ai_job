import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { getToken, removeToken } from '../utils/token';

type AuthContextType = {
  isAuthenticated: boolean;
  role: string | null;
  loading: boolean;
  checkAuth: () => void;
};

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  role: null,
  loading: true,
  checkAuth: () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = () => {
    const token = getToken();
    if (!token) {
      setIsAuthenticated(false);
      setRole(null);
      setLoading(false);
      return;
    }

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      // Check expiration if needed
      if (payload.exp && payload.exp * 1000 < Date.now()) {
        removeToken();
        setIsAuthenticated(false);
        setRole(null);
      } else {
        setIsAuthenticated(true);
        setRole(payload?.role || null);
      }
    } catch (e) {
      setIsAuthenticated(false);
      setRole(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
    
    // Add event listener for local storage changes to keep tabs in sync
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'store_token') {
        checkAuth();
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, role, loading, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
