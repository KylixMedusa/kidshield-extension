/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';

interface AppearanceState {
  theme: 'light' | 'dark';
}

const initialState: AppearanceState = {
  theme: 'light',
};

const appearanceSlice = createSlice({
  name: 'appearance',
  initialState,
  reducers: {
    toggleTheme: state => {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
    },
  },
});

export const { toggleTheme } = appearanceSlice.actions;

export default appearanceSlice.reducer;
