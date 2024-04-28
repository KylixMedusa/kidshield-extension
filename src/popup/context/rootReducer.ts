import { combineReducers } from '@reduxjs/toolkit';

import appearanceReducer from './reducers/appearanceReducer';
import appReducer from './reducers/appReducer';
import settingsReducer from './reducers/settingsReducer';

const rootReducer = combineReducers({
  settings: settingsReducer,
  appearance: appearanceReducer,
  app: appReducer,
});

export default rootReducer;
