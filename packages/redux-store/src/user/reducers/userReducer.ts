import { createSlice } from '@reduxjs/toolkit';
import userService from '@m-cafe-app/frontend-services/src/user';

import { AppDispatch } from '../store';

// import { showNotification } from './notificationsReducer';

import { ApplicationError, isUserDT, LoginUserBody, NewUserBody, UserDT } from '@m-cafe-app/utils';

import { handleAxiosError } from '../../utils/errorHandler';
import { RequestOptions } from '@m-cafe-app/frontend-services/src/types/requestOptions';

type SetUserAction = 
  | {
    payload: UserDT;
};

interface UserState extends UserDT {}

const initialState: UserState = {
  id: 0,
  username: '',
  name: '',
  phonenumber: '',
  email: '',
  birthdate: '',
  rights: ''
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state: UserState, action: SetUserAction) => {
      return { ...action.payload };
    },
    logout: () => {
      return initialState;
    },
  },
});

export const { setUser, logout } = userSlice.actions;

export const sendNewUser = (newUser: NewUserBody, options: RequestOptions) => {
  return async (dispatch: AppDispatch) => {
    try {
      await userService.createUser(newUser, options);
      await dispatch(sendLogin({ phonenumber: newUser.phonenumber, password: newUser.password }, options));
    } catch (e: unknown) {
      dispatch(handleAxiosError(e));
    }
  };
};

export const sendLogin = (credentials: LoginUserBody, options: RequestOptions) => {
  return async (dispatch: AppDispatch) => {
    try {
      const user = await userService.login(credentials, options);
      if (!isUserDT(user)) throw new ApplicationError('Server has sent wrong data');
      dispatch(setUser(user));
    } catch (e: unknown) {
      dispatch(handleAxiosError(e));
    }
  };
};

export const sendLogout = (options: RequestOptions) => {
  return async (dispatch: AppDispatch) => {
    try {
      await userService.logout(options);
      dispatch(logout);
      window.location.reload();
    } catch (e: unknown) {
      dispatch(handleAxiosError(e));
    }
  };
};

export const sendRefreshToken = (options: RequestOptions) => {
  return async (dispatch: AppDispatch) => {
    try {
      const user = await userService.refreshToken(options);
      if (!isUserDT(user)) throw new ApplicationError('Server has sent wrong data');
      dispatch(setUser(user));
    } catch (e: unknown) {
      dispatch(handleAxiosError(e));
    }
  };
};

export default userSlice.reducer;