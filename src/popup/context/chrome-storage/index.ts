import {
  ReduxedSetupOptions,
  setupReduxed,
  StoreCreatorContainer,
} from 'reduxed-chrome-storage';

import { configureStore } from '@reduxjs/toolkit';

import rootReducer from '../rootReducer';

// Function to create a Redux store container
const storeCreatorContainer: StoreCreatorContainer = preloadedState =>
  configureStore({
    reducer: rootReducer,
    preloadedState,
  });

// Setup options for reduxed-chrome-storage
const options: ReduxedSetupOptions = {
  storageArea: 'local', // or 'sync' based on your preference
  storageKey: 'kidshield-redux-storage', // Key under which to store your app's state in Chrome storage
};

// Instantiate the store
const instantiate = setupReduxed(storeCreatorContainer, options);

// Function to create a Chrome store
export const createChromeStore = async () => {
  const store = await instantiate();
  return store;
};
