import config, { isDockerized } from './utils/config.js';
import express from 'express';
import 'express-async-errors';
const app = express();
import cors from 'cors';
import userRouter from './controllers/user.js';
import sessionRouter from './controllers/session.js';
import adminRouter from './controllers/admin.js';
import foodRouter from './controllers/food.js';
import foodComponentRouter from './controllers/foodComponent.js';
import foodTypeRouter from './controllers/foodType.js';
import ingredientRouter from './controllers/ingredient.js';
import facilityRouter from './controllers/facility.js';
import orderRouter from './controllers/order.js';
import pictureRouter from './controllers/picture.js';
import dynamicModuleRouter from './controllers/dynamicModule.js';
import uiSettingRouter from './controllers/uiSetting.js';
import fixedLocRouter from './controllers/fixedLoc.js';
import middleware from './utils/middleware.js';
import { errorHandler } from './utils/errorHandler.js';
import helmet from 'helmet';
import { connectToRedisSessionDB } from './redis/Session.js';
import cookieParser from 'cookie-parser';
import path from 'path';

const __dirname = path.resolve();

app.use('/public', express.static(path.resolve(__dirname, './public')));

app.use(helmet());

if (!isDockerized)
  app.use(cors({
    origin: config.ALLOWED_ORIGIN,
    credentials: true
  }));

app.use(express.json());

app.use(cookieParser());


app.use(middleware.requestLogger);

app.use('/session', sessionRouter);
app.use('/user', userRouter);
app.use('/admin', adminRouter);
app.use('/food', foodRouter);
app.use('/food', foodComponentRouter);
app.use('/foodtype', foodTypeRouter);
app.use('/ingredient', ingredientRouter);
app.use('/facility', facilityRouter);
app.use('/order', orderRouter);
app.use('/picture', pictureRouter);
app.use('/dynamic-module', dynamicModuleRouter);
app.use('/ui-setting', uiSettingRouter);
app.use('/fixed-loc', fixedLocRouter);


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