import * as dotenv from "dotenv";
// dotenv.config({ path: __dirname+'/.env' });
dotenv.config();

import { Secret } from 'jsonwebtoken';

const PORT = process.env.PORT as string

const DATABASE_URL =
  process.env.NODE_ENV === 'test' ? process.env.TEST_DATABASE_URL as string : process.env.DATABASE_URL as string

const SECRET = process.env.SECRET as Secret

const TOKEN_TTL = process.env.TOKEN_TTL as string

// const allowedOrigin = process.env.NODE_ENV === 'test' || process.env.NODE_ENV === 'development'
//   ?
//   {
//     port: 4000,
//     allowedOrigin: 'http://localhost:8080'
//   }
//   :
//   {
//     port: 4000,
//     allowedOrigin: 'http://localhost:4000'
//   }

export default {
  DATABASE_URL,
  PORT,
  SECRET,
  TOKEN_TTL,
  // allowedOrigin
}