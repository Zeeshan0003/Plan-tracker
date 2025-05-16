import React, { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { login, register, forgotPassword } from '../services/authService';

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    // Check for token on startup
    const token = localStorage.getItem('auth_token');
    if (token) {
      try {
        const decoded = jwtDecode<{ sub: string; email: string; name: string }>(token);
        setUser({
          id: decoded.sub,
          email: decoded.email,
          name: decoded.name
        });
      } catch (err) {
        localStorage.removeItem('auth_token');
      }
    }
    setIsLoading(false);
    
    // Set up timer for inactivity logout
    const inactivityTimeout = 30 * 60 * 1000; // 30 minutes
    let logoutTimer: number;
    
    const resetTimer = () => {
      if (logoutTimer) window.clearTimeout(logoutTimer);
      logoutTimer = window.setTimeout(() => {
        if (localStorage.getItem('auth_token')) {
          logout();
          alert('You have been logged out due to inactivity.');
        }
      }, inactivityTimeout);
    };
    
    // Reset timer on user activity
    window.addEventListener('mousemove', resetTimer);
    window.addEventListener('keypress', resetTimer);
    
    resetTimer();
    
    return () => {
      window.clearTimeout(logoutTimer);
      window.removeEventListener('mousemove', resetTimer);
      window.removeEventListener('keypress', resetTimer);
    };
  }, []);
  
  const loginUser = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const token = await login(email, password);
      localStorage.setItem('auth_token', token);
      const decoded = jwtDecode<{ sub: string; email: string; name: string }>(token);
      setUser({
        id: decoded.sub,
        email: decoded.email,
        name: decoded.name
      });
    } catch (err: any) {
      setError(err.message || 'Login failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };
  
  const registerUser = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const token = await register(name, email, password);
      localStorage.setItem('auth_token', token);
      const decoded = jwtDecode<{ sub: string; email: string; name: string }>(token);
      setUser({
        id: decoded.sub,
        email: decoded.email,
        name: decoded.name
      });
    } catch (err: any) {
      setError(err.message || 'Registration failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };
  
  const forgotPasswordUser = async (email: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await forgotPassword(email);
    } catch (err: any) {
      setError(err.message || 'Password reset failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };
  
  const logout = () => {
    localStorage.removeItem('auth_token');
    setUser(null);
  };
  
  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    error,
    login: loginUser,
    register: registerUser,
    forgotPassword: forgotPasswordUser,
    logout
  };
  
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};