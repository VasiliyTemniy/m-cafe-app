import type { LoginUserBody } from '@m-cafe-app/utils';
import type { UserData } from '@m-cafe-app/db';
import supertest from 'supertest';
import { apiBaseUrl } from './test_helper';
import { expect } from 'chai';

export const userAgent = 'SUPERTEST';

export const initLogin = async (
  user: UserData | Omit<UserData, 'id' | 'rights'>,
  password: string,
  api: supertest.SuperTest<supertest.Test>,
  expectedStatus: number,
  loginUserAgent: string = userAgent,
  isSuperAdmin: boolean = false
) => {

  const loginBody: LoginUserBody = isSuperAdmin
    ? {
      username: user.username,
      password: password
    } : {
      phonenumber: user.phonenumber,
      password: password
    };

  const response = await api
    .post(`${apiBaseUrl}/session`)
    .set('User-Agent', loginUserAgent)
    .send(loginBody as object)
    .expect(expectedStatus);

  if (!response.headers['set-cookie']) return expect(true).to.equal(false);

  const loginCookies = response.headers['set-cookie'] as string[];

  const tokenCookie = loginCookies.find(cookie => cookie.startsWith('token='));

  if (!tokenCookie) return expect(true).to.equal(false);

  return tokenCookie;

};