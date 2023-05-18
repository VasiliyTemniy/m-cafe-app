import express from 'express'
require('express-async-errors')
const app = express()
import cors from 'cors'
// import config from './utils/config.js'
// import usersRouter from './controllers/user'
// import loginRouter from './controllers/login'
// import adminRouter from './controllers/admin'
import middleware from './utils/middleware'
import helmet from 'helmet'


app.use(helmet())

app.use((_req, _res, next) => {
  next();
}, cors({ maxAge: 84600 }));

app.use(express.json())


app.use(middleware.requestLogger)

// app.use('/api/login', loginRouter)
// app.use('/api/users', usersRouter)
// app.use('/api/admin', adminRouter)

if (process.env.NODE_ENV === 'test') {
  const testingRouter = require('./controllers/testing')
  app.use('/api/testing', testingRouter)
}

app.use(middleware.errorHandler)
app.use(middleware.unknownEndpoint)

export default app