import { LoginUserBody } from "@m-cafe-app/utils";
import supertest from 'supertest';
import { apiBaseUrl } from './test_helper';
import { UserData } from "@m-cafe-app/utils";
import { expect } from "chai";

export const userAgent = 'SUPERTEST';

export const initLogin = async (
  user: UserData,
  password: string,
  api: supertest.SuperTest<supertest.Test>,
  expectedStatus: number,
  loginUserAgent: string = userAgent
) => {

  const loginBody: LoginUserBody = {
    phonenumber: user.phonenumber,
    password: password
  };

  const response = await api
    .post(`${apiBaseUrl}/session`)
    .set('User-Agent', loginUserAgent)
    .send(loginBody as object)
    .expect(expectedStatus)
    .expect('Content-Type', /application\/json/);

  if (!response.body.token) return expect(true).to.equal(false);

  return response.body.token as string;

};