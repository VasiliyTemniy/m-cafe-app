import app from './app.js'
import http from 'http'
import config from './utils/config.js'
// import logger from './utils/logger'
// import { connectToDatabase } from './utils/db'

const start = async () => {
  // await connectToDatabase()
  const server = http.createServer(app)
  server.listen(config.PORT, () => {
    console.log(`Server running on port ${config.PORT}`)
  })
}

start()