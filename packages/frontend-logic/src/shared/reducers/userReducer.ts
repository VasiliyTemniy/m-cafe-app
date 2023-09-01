import { createSlice } from '@reduxjs/toolkit';
import userService from '../services/user';
import { AppDispatch } from '../store';
// import { showNotification } from './notificationsReducer';
import { ApplicationError, EditUserBody, isUserDT, LoginUserBody, NewUserBody, UserDT } from '@m-cafe-app/utils';
import { handleAxiosError } from '../../utils/errorHandler';
import { TFunction } from '../hooks';

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

export const sendNewUser = (newUser: NewUserBody, t: TFunction) => {
  return async (dispatch: AppDispatch) => {
    try {
      await userService.createUser(newUser);
      await dispatch(sendLogin({
        phonenumber: newUser.phonenumber,
        password: newUser.password
      },
      t));
    } catch (e: unknown) {
      dispatch(handleAxiosError(e, t));
    }
  };
};

export const sendUpdateUser = (updUser: EditUserBody, userId: number, t: TFunction) => {
  return async (dispatch: AppDispatch) => {
    try {
      await userService.updateUser(updUser, userId);
      await dispatch(sendLogin({
        phonenumber: updUser.phonenumber,
        password: updUser.password
      },
      t));
    } catch (e: unknown) {
      dispatch(handleAxiosError(e, t));
    }
  };
};

export const sendLogin = (credentials: LoginUserBody, t: TFunction) => {
  return async (dispatch: AppDispatch) => {
    try {
      const user = await userService.login(credentials);
      if (!isUserDT(user)) throw new ApplicationError('Server has sent wrong data', { current: user });
      dispatch(setUser(user));
    } catch (e: unknown) {
      dispatch(handleAxiosError(e, t));
    }
  };
};

export const sendLogout = (t: TFunction) => {
  return async (dispatch: AppDispatch) => {
    try {
      await userService.logout();
      dispatch(logout);
      window.location.reload();
    } catch (e: unknown) {
      dispatch(handleAxiosError(e, t));
    }
  };
};

export const sendRefreshToken = (t: TFunction) => {
  return async (dispatch: AppDispatch) => {
    try {
      const user = await userService.refreshToken();
      if (!isUserDT(user)) throw new ApplicationError('Server has sent wrong data', { current: user });
      dispatch(setUser(user));
    } catch (e: unknown) {
      dispatch(handleAxiosError(e, t));
    }
  };
};

export default userSlice.reducer;