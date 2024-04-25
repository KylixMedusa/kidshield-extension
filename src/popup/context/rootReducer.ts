import { combineReducers } from '@reduxjs/toolkit';

import appearanceReducer from './reducers/appearanceReducer';
import settingsReducer from './reducers/settingsReducer';

const rootReducer = combineReducers({
  settings: settingsReducer,
  appearance: appearanceReducer,
});

export default rootReducer;
