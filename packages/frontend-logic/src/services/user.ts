import axios from 'axios';
import { NewUserBody, LoginUserBody, EditUserBody } from '@m-cafe-app/utils';
import { RequestOptions } from '../types/requestOptions';

const createUser = async (newUser: NewUserBody, options: RequestOptions) => {

  const reqBody: NewUserBody = newUser;

  const config = { headers: {'Content-Type': 'application/json'} };
  const { data: userInfo } = await axios.post<JSON>(
    `${options.apiBaseUrl}/api/user`,
    JSON.stringify(reqBody),
    config
  );

  return userInfo;
};

const updateUser = async (updUser: EditUserBody, userId: number, options: RequestOptions) => {

  const reqBody: EditUserBody = updUser;

  const config = { headers: {'Content-Type': 'application/json'}, withCredentials: true  };
  const { data: userInfo } = await axios.put<JSON>(
    `${options.apiBaseUrl}/api/user/${userId}`,
    JSON.stringify(reqBody),
    config
  );

  return userInfo;
};

const login = async (credentials: LoginUserBody, options: RequestOptions) => {

  const reqBody: LoginUserBody = credentials;

  const config = { headers: {'Content-Type': 'application/json'}, withCredentials: true };
  const { data: userInfo } = await axios.post<JSON>(
    `${options.apiBaseUrl}/api/session`,
    JSON.stringify(reqBody),
    config
  );

  return userInfo;
};

const refreshToken = async (options: RequestOptions) => {

  const config = { withCredentials: true };
  const { data: userInfo } = await axios.get<JSON>(
    `${options.apiBaseUrl}/api/session/refresh`,
    config
  );

  return userInfo;  
};

const logout = async (options: RequestOptions) => {

  const config = { withCredentials: true };
  await axios.delete<JSON>(
    `${options.apiBaseUrl}/api/session`,
    config
  );

};

export default { createUser, updateUser, login, refreshToken, logout };