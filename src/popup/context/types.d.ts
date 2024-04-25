import { ExtendedDispatch } from 'reduxed-chrome-storage';

import rootReducer from './rootReducer';

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = ExtendedDispatch;
