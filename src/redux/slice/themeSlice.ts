<<<<<<< HEAD
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
=======
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
>>>>>>> 1555a1151d19f84683805fb0a9dda57c6ba6ec0b

interface ThemeState {
  mode: 'light' | 'dark';
}

const initialState: ThemeState = {
  mode: 'light',
};

// Load from localStorage if available
if (typeof window !== 'undefined') {
  const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
  if (savedTheme) {
    initialState.mode = savedTheme;
  } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    initialState.mode = 'dark';
  }
}

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<'light' | 'dark'>) => {
      state.mode = action.payload;
      if (typeof window !== 'undefined') {
        localStorage.setItem('theme', action.payload);
      }
    },
    toggleTheme: (state) => {
      state.mode = state.mode === 'light' ? 'dark' : 'light';
      if (typeof window !== 'undefined') {
        localStorage.setItem('theme', state.mode);
      }
    },
  },
});

export const { setTheme, toggleTheme } = themeSlice.actions;
export default themeSlice.reducer;
