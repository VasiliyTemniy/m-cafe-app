import * as dotenv from "dotenv";

dotenv.config({
  override: process.env.DOCKERIZED_DEV === 'true' ? false : true
});

import { Secret } from 'jsonwebtoken';

const PORT = process.env.BACKEND_PORT as string;

const DATABASE_URL = process.env.NODE_ENV === 'test'
  ? process.env.TEST_DATABASE_URL as string
  : process.env.DATABASE_URL as string;

const SECRET = process.env.SECRET as Secret;

const TOKEN_TTL = process.env.TOKEN_TTL as string;

const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN as string;

export default {
  DATABASE_URL,
  PORT,
  SECRET,
  TOKEN_TTL,
  ALLOWED_ORIGIN
};