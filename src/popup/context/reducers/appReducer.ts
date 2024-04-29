/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type AppState = {
  apiEndpoint: string;
  token: string | null;
  isLoggedIn: boolean;
};

const initialState: AppState = {
  apiEndpoint: 'https://9wn4104g-9000.inc1.devtunnels.ms',
  token: null,
  isLoggedIn: false,
};

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setToken: (state, action: PayloadAction<string | null>) => {
      state.token = action.payload;
    },
    setIsLoggedIn: (state, action: PayloadAction<boolean>) => {
      state.isLoggedIn = action.payload;
    },
  },
});

export const { setIsLoggedIn, setToken } = appSlice.actions;

export default appSlice.reducer;
