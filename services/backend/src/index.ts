import config from './utils/config.js';
import app from './app.js';
import http from 'http';
import logger from './utils/logger.js';
import { connectToDatabase } from '@m-cafe-app/db';
import { connectToRedisSessionDB } from './redis/Session.js';
import { initFixedLocs } from './utils/initFixedLocs.js';
import { uiSettingController } from './controllers';
import { userController } from './controllers';

const start = async () => {
  await connectToDatabase();
  await userController.service.initSuperAdmin();
  await connectToRedisSessionDB();
  await uiSettingController.service.initUiSettings();
  await initFixedLocs();
  const server = http.createServer(app);
  server.listen(config.PORT, () => {
    logger.info(`Server running on port ${config.PORT}`);
  });
};

await start();