import { createSlice } from '@reduxjs/toolkit';
import userService from '../services/user';

import { AppDispatch } from '../store';

// import { showNotification } from './notificationsReducer';

import { ApplicationError, EditUserBody, isUserDT, LoginUserBody, NewUserBody, UserDT } from '@m-cafe-app/utils';

import { handleAxiosError } from '../../utils/errorHandler';
import { RequestOptions } from '../../types';
import { TFunction } from '../hooks/useTranslation';

type SetUserAction = 
  | {
    payload: UserDT;
};

export interface UserState extends UserDT {}

const initialState: UserState = {
  id: 0,
  username: undefined,
  name: undefined,
  phonenumber: '',
  email: undefined,
  birthdate: undefined,
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

export const sendNewUser = (newUser: NewUserBody, options: RequestOptions, t: TFunction) => {
  return async (dispatch: AppDispatch) => {
    try {
      await userService.createUser(newUser, options);
      await dispatch(sendLogin({
        phonenumber: newUser.phonenumber,
        password: newUser.password
      },
      {
        apiBaseUrl: options.apiBaseUrl
      },
      t));
    } catch (e: unknown) {
      dispatch(handleAxiosError(e, t));
    }
  };
};

export const sendUpdateUser = (updUser: EditUserBody, userId: number, options: RequestOptions, t: TFunction) => {
  return async (dispatch: AppDispatch) => {
    try {
      await userService.updateUser(updUser, userId, options);
      await dispatch(sendLogin({
        phonenumber: updUser.phonenumber,
        password: updUser.password
      },
      {
        apiBaseUrl: options.apiBaseUrl
      },
      t));
    } catch (e: unknown) {
      dispatch(handleAxiosError(e, t));
    }
  };
};

export const sendLogin = (credentials: LoginUserBody, options: RequestOptions, t: TFunction) => {
  return async (dispatch: AppDispatch) => {
    try {
      const user = await userService.login(credentials, options);
      if (!isUserDT(user)) throw new ApplicationError('Server has sent wrong data', { current: user });
      dispatch(setUser(user));
    } catch (e: unknown) {
      dispatch(handleAxiosError(e, t));
    }
  };
};

export const sendLogout = (options: RequestOptions, t: TFunction) => {
  return async (dispatch: AppDispatch) => {
    try {
      await userService.logout(options);
      dispatch(logout);
      window.location.reload();
    } catch (e: unknown) {
      dispatch(handleAxiosError(e, t));
    }
  };
};

export const sendRefreshToken = (options: RequestOptions, t: TFunction) => {
  return async (dispatch: AppDispatch) => {
    try {
      const user = await userService.refreshToken(options);
      if (!isUserDT(user)) throw new ApplicationError('Server has sent wrong data', { current: user });
      dispatch(setUser(user));
    } catch (e: unknown) {
      dispatch(handleAxiosError(e, t));
    }
  };
};

export default userSlice.reducer;