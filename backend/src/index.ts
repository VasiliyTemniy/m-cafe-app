import config from './utils/config.js';
import app from './app.js';
import http from 'http';
import logger from './utils/logger.js';
import { connectToDatabase } from './utils/db.js';

const start = async () => {
  await connectToDatabase();
  const server = http.createServer(app);
  server.listen(config.PORT, () => {
    logger.info(`Server running on port ${config.PORT}`);
  });
};

await start();