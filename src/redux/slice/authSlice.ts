import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { User } from '@/types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean; // track if we are verifying
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  loading: true, // start as loading
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.loading = false;
    },
    clearUser: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.loading = false;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
});

export const { setUser, clearUser, setLoading } = authSlice.actions;
export default authSlice.reducer;
