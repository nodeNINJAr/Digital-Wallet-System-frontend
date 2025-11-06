import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { AuthState, User } from '@/types';

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
};

// Load from localStorage if available
if (typeof window !== 'undefined') {
  const savedAuth = localStorage.getItem('auth');
  if (savedAuth) {
    try {
      const parsed = JSON.parse(savedAuth);
      if (parsed.token && parsed.user) {
        Object.assign(initialState, parsed, { isAuthenticated: true });
      }
    } catch (e) {
      localStorage.removeItem('auth');
    }
  }
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      
      // Persist to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('auth', JSON.stringify({
          user: action.payload.user,
          token: action.payload.token,
        }));
      }
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      
      // Clear localStorage
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth');
      }
    },
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
        
        // Update localStorage
        if (typeof window !== 'undefined') {
          localStorage.setItem('auth', JSON.stringify({
            user: state.user,
            token: state.token,
          }));
        }
      }
    },
  },
});

export const { setCredentials, logout, updateUser } = authSlice.actions;
export default authSlice.reducer;
