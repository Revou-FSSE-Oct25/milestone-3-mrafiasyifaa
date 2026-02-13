import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface User {
  id: number;
  email: string;
  name: string;
  role: 'admin' | 'customer';
  avatar: string;
}

interface AuthState {
  user: User | null;
  setUser: (user: User) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      
      // TODO AUTH: Implement Login Logic
      setUser: (user: User) => {
        // 1. Create a session expiration (e.g., 1 day)
        const expirationDate = new Date();
        expirationDate.setDate(expirationDate.getDate() + 1);
        
        // 2. Set a cookie with the user data (JSON.stringify)
        if (typeof window !== 'undefined') {
          document.cookie = `auth_session=${JSON.stringify(user)}; expires=${expirationDate.toUTCString()}; path=/; SameSite=Lax`;
        }
        
        set({ user, isAuthenticated: true });
      },
      
      // TODO AUTH: Implement Logout Logic
      logout: () => {
        // 1. Delete the auth cookie
        if (typeof window !== 'undefined') {
          document.cookie = 'auth_session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        }
        
        set({ user: null, isAuthenticated: false });
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);

// TODO AUTH: Implement Session Retrieval
export const getSessionFromCookie = (): User | null => {
  // 1. Get the cookie store
  if (typeof window === 'undefined') return null;
  
  // 2. Retrieve the AUTH_COOKIE
  const cookies = document.cookie.split('; ');
  const authCookie = cookies.find(cookie => cookie.startsWith('auth_session='));
  
  // 4. Return null if no cookie exists
  if (!authCookie) return null;
  
  try {
    // 3. Parse the JSON value and return the User object
    const cookieValue = authCookie.split('=')[1];
    const user = JSON.parse(decodeURIComponent(cookieValue));
    return user;
  } catch (error) {
    console.error('Error parsing auth cookie:', error);
    // 4. Return null if no cookie exists
    return null;
  }
};

export default useAuthStore;