import axios from 'axios';
import type { NewUserBody, LoginUserBody, EditUserBody } from '@m-cafe-app/utils';
import { apiBaseUrl } from '../utils/config';

const createUser = async (newUser: NewUserBody) => {

  const reqBody: NewUserBody = newUser;

  const config = { headers: {'Content-Type': 'application/json'} };
  const { data: userInfo } = await axios.post<JSON>(
    `${apiBaseUrl}/api/user`,
    JSON.stringify(reqBody),
    config
  );

  return userInfo;
};

const updateUser = async (updUser: EditUserBody, userId: number) => {

  const reqBody: EditUserBody = updUser;

  const config = { headers: {'Content-Type': 'application/json'}, withCredentials: true  };
  const { data: userInfo } = await axios.put<JSON>(
    `${apiBaseUrl}/api/user/${userId}`,
    JSON.stringify(reqBody),
    config
  );

  return userInfo;
};

const login = async (credentials: LoginUserBody) => {

  const reqBody: LoginUserBody = credentials;

  const config = { headers: {'Content-Type': 'application/json'}, withCredentials: true };
  const { data: userInfo } = await axios.post<JSON>(
    `${apiBaseUrl}/api/session`,
    JSON.stringify(reqBody),
    config
  );

  return userInfo;
};

const refreshToken = async () => {

  const config = { withCredentials: true };
  const { data: userInfo } = await axios.get<JSON>(
    `${apiBaseUrl}/api/session/refresh`,
    config
  );

  return userInfo;  
};

const logout = async () => {

  const config = { withCredentials: true };
  await axios.delete<JSON>(
    `${apiBaseUrl}/api/session`,
    config
  );

};

export default { createUser, updateUser, login, refreshToken, logout };