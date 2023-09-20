import type { AnyAction, ThunkAction } from '@reduxjs/toolkit';
import { configureStore } from '@reduxjs/toolkit';
import { sharedReducers } from '../shared/store';
import ingredientsReducer from './reducers/ingredientsReducer';

export const managerReducers = {
  ingredient: ingredientsReducer
};

const store = configureStore({
  reducer: {
    ...sharedReducers,
    ...managerReducers
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