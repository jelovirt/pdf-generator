import { combineReducers } from '@reduxjs/toolkit';
import modelReducer from './modelSlice';

const rootReducer = combineReducers({
  model: modelReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
