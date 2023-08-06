import config from './utils/config.js';
import express from 'express';
import 'express-async-errors';
const app = express();
import cors from 'cors';
import usersRouter from './controllers/user.js';
import sessionRouter from './controllers/session.js';
import adminRouter from './controllers/admin.js';
// import foodRouter from './controllers/food.js';
import middleware from './utils/middleware.js';
import { errorHandler } from './utils/errorHandler.js';
import helmet from 'helmet';
import { connectToRedisSessionDB } from './redis/Session.js';
import cookieParser from 'cookie-parser';


app.use(helmet());

app.use(cors({
  origin: config.ALLOWED_ORIGIN
}));

app.use(express.json());

app.use(cookieParser());


app.use(middleware.requestLogger);

app.use('/session', sessionRouter);
app.use('/users', usersRouter);
app.use('/admin', adminRouter);
// app.use('/food', foodRouter);


const initTestingHelper = async () => {
  if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test') {
    const testingRouter = await import('./controllers/testing.js');
    app.use('/testing', testingRouter.default);
  }
  if (process.env.NODE_ENV === 'test') {
    await connectToRedisSessionDB();
  }
};

await initTestingHelper();

app.use(errorHandler);
app.use(middleware.unknownEndpoint);

export default app;