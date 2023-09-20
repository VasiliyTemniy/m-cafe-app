import type { AnyAction, ThunkAction } from '@reduxjs/toolkit';
import { configureStore } from '@reduxjs/toolkit';
import fixedLocsReducer from './reducers/fixedLocsReducer';
import notificationsReducer from './reducers/notificationsReducer';
import settingsReducer from './reducers/settingsReducer';
import userReducer from './reducers/userReducer';

export const sharedReducers = {
  notifications: notificationsReducer,
  user: userReducer,
  fixedLocs: fixedLocsReducer,
  settings: settingsReducer
};

/**
 * This shared store is needed only for redux-specific circular dependency to resolve types for AppDispatch, etc
 * Does not get bundled, does not get used otherwise
 */
const store = configureStore({
  reducer: {
    ...sharedReducers
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  undefined, // ExtraThunkArg, injected by middleware. It is supposed to be 'unknown' in docs in case there is no middleware, but unknown caused errors
  AnyAction
>;

export default store;