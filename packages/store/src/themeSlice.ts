import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { ThemeName } from '@solar-system/ui';

interface ThemeState {
  current: ThemeName;
}

const initialState: ThemeState = { current: 'dark' };

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    toggleTheme(state) {
      state.current = state.current === 'dark' ? 'light' : 'dark';
    },
    setTheme(state, action: PayloadAction<ThemeName>) {
      state.current = action.payload;
    },
  },
});

export const { setTheme, toggleTheme } = themeSlice.actions;
export default themeSlice.reducer;
