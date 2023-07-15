import config from './utils/config.js';
import express from 'express';
import 'express-async-errors';
const app = express();
import cors from 'cors';
import usersRouter from './controllers/user.js';
import sessionRouter from './controllers/session.js';
import adminRouter from './controllers/admin.js';
import middleware from './utils/middleware.js';
import helmet from 'helmet';


app.use(helmet());

app.use(cors({
  origin: config.ALLOWED_ORIGIN
}));

// app.use((_req, _res, next) => {
//   next();
// }, cors({ maxAge: 84600 }));

app.use(express.json());


app.use(middleware.requestLogger);

app.use('/api/session', sessionRouter);
app.use('/api/users', usersRouter);
app.use('/api/admin', adminRouter);

( async () => {
  if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test') {
    const testingRouter = await import('./controllers/testing.js');
    app.use('/api/testing', testingRouter.default);
  }
});

app.get('/ping', (req, res) => {
  res.status(200).json({ "message": "Pong" });
});

app.use(middleware.errorHandler);
app.use(middleware.unknownEndpoint);

export default app;