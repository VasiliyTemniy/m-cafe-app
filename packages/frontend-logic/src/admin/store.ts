import { AnyAction, configureStore, ThunkAction } from '@reduxjs/toolkit';
import { customerReducers } from '../customer/store';
import fixedLocsReducer from './reducers/fixedLocsReducer';
import settingsReducer from './reducers/settingsReducer';

const store = configureStore({
  reducer: {
    ...customerReducers,
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