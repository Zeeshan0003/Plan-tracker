import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, UserRole } from '../types';
import { users } from '../data/mockData';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLibrarian: () => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      login: async (email: string, password: string) => {
        // In a real app, this would be an API call with proper authentication
        const user = users.find(
          (u) => u.email === email && u.password === password
        );
        
        if (user) {
          // Remove password before storing in state
          const { password: _, ...userWithoutPassword } = user;
          
          set({
            user: userWithoutPassword as User,
            isAuthenticated: true,
          });
          return true;
        }
        return false;
      },
      logout: () => {
        set({
          user: null,
          isAuthenticated: false,
        });
      },
      isLibrarian: () => {
        const { user } = get();
        return user?.role === 'librarian';
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);