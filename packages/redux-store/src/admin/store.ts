import { AnyAction, configureStore, ThunkAction } from '@reduxjs/toolkit';
import { userReducers } from '../user/store';

const store = configureStore({
  reducer: {
    ...userReducers
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