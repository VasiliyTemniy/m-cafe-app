import { AnyAction, configureStore, ThunkAction } from '@reduxjs/toolkit';
import fixedLocsReducer from './reducers/fixedLocsReducer';
import notificationsReducer from './reducers/notificationsReducer';
import userReducer from './reducers/userReducer';

export const userReducers = {
  locs: fixedLocsReducer,
  notifications: notificationsReducer,
  user: userReducer
};

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
  undefined, // ExtraThunkArg, injected by middleware. It is supposed to be 'unknown' in docs in case there is no middleware, but unknown caused errors
  AnyAction
>;

export default store;