import type { AnyAction, ThunkAction } from '@reduxjs/toolkit';
import { configureStore } from '@reduxjs/toolkit';
import { sharedReducers } from '../shared/store';
import { managerReducers } from '../manager/store';
import fixedLocsReducer from './reducers/fixedLocsReducer';
import settingsReducer from './reducers/settingsReducer';

const store = configureStore({
  reducer: {
    ...sharedReducers,
    ...managerReducers,
    fixedLocs: fixedLocsReducer,
    settings: settingsReducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  AnyAction
>;

export default store;