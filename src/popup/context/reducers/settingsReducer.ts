/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type SettingsState = {
  logging: boolean;
  isExtensionOn: boolean;
  filterEffect: 'hide' | 'blur' | 'grayscale';
  filterStrictness: number;
  websites: string[];
};

const initialState: SettingsState = {
  logging: true,
  isExtensionOn: false,
  filterEffect: 'blur',
  filterStrictness: 55,
  websites: ['www.kidshield.life'],
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setLogging: (state, action: PayloadAction<boolean>) => {
      state.logging = action.payload;
    },
    toggleExtension: (state, action: PayloadAction<boolean>) => {
      state.isExtensionOn = action.payload;
    },
    setFilterEffect: (
      state,
      action: PayloadAction<'hide' | 'blur' | 'grayscale'>,
    ) => {
      state.filterEffect = action.payload;
    },
    setFilterStrictness: (state, action: PayloadAction<number>) => {
      state.filterStrictness = action.payload;
    },
    setWebsites: (state, action: PayloadAction<string[]>) => {
      state.websites = action.payload;
    },
  },
});

export const {
  setLogging,
  toggleExtension,
  setFilterEffect,
  setFilterStrictness,
  setWebsites,
} = settingsSlice.actions;

export default settingsSlice.reducer;
