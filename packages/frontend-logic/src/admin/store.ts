import { AnyAction, configureStore, ThunkAction } from '@reduxjs/toolkit';
import { customerReducers } from '../customer/store';
import fixedLocsReducer from './reducers/fixedLocsReducer';

const store = configureStore({
  reducer: {
    ...customerReducers,
    fixedLocs: fixedLocsReducer
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