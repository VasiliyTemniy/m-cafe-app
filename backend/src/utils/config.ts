import * as dotenv from "dotenv";
// dotenv.config({ path: __dirname+'/.env' });
dotenv.config({
  override: process.env.DOCKERIZED_DEV === 'true' ? false : true
});

import { Secret } from 'jsonwebtoken';

const PORT = process.env.BACKEND_PORT as string;

const DATABASE_URL =
  (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test')
  ? process.env.DEV_DATABASE_URL as string
  : process.env.DATABASE_URL as string;

const SECRET =
  (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test')
  ? process.env.DEV_SECRET as Secret
  : process.env.SECRET as Secret;

const TOKEN_TTL = process.env.TOKEN_TTL as string;

const ALLOWED_ORIGIN = 
  (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test')
  ? process.env.DEV_ALLOWED_ORIGIN as string
  : process.env.ALLOWED_ORIGIN as string;

export default {
  DATABASE_URL,
  PORT,
  SECRET,
  TOKEN_TTL,
  ALLOWED_ORIGIN
};