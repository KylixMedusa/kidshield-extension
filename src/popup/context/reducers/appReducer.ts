/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type AppState = {
  isLoggedIn: boolean;
  isExtensionOn: boolean;
};

const initialState: AppState = {
  isLoggedIn: false,
  isExtensionOn: false,
};

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setIsLoggedIn: (state, action: PayloadAction<boolean>) => {
      state.isLoggedIn = action.payload;
      state.isExtensionOn = action.payload;
    },
    toggleExtension: (state, action: PayloadAction<boolean>) => {
      state.isExtensionOn = action.payload;
    },
  },
});

export const { setIsLoggedIn, toggleExtension } = appSlice.actions;

export default appSlice.reducer;
