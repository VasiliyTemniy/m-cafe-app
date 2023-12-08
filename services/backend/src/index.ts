import { PORT } from './utils/config.js';
import app from './app.js';
import http from 'http';
import { logger } from '@m-cafe-app/utils';
import { dbHandler } from '@m-cafe-app/db';
import { authController, fixedLocService, sessionService, uiSettingService } from './controllers';
import { userController } from './controllers';

const start = async () => {
  await dbHandler.connect();
  await dbHandler.pingDb();
  logger.info('connected to db');
  await dbHandler.loadMigrations();
  await dbHandler.runMigrations();
  logger.info('ran migrations');
  await authController.connect();
  await authController.ping();
  logger.info('connected to auth service');
  await authController.getPublicKey();
  logger.info('got auth public key');
  await userController.service.initSuperAdmin();
  logger.info('initialized super admin');
  await uiSettingService.connectInmem();
  await uiSettingService.pingInmem();
  logger.info('connected to ui settings inmem');
  await uiSettingService.initUiSettings();
  logger.info('initialized ui settings');
  await fixedLocService.connectInmem();
  await fixedLocService.pingInmem();
  logger.info('connected to fixed loc inmem');
  await fixedLocService.initFixedLocs('locales', 'jsonc');
  logger.info('initialized fixed locs');
  await sessionService.connectInmem();
  await sessionService.pingInmem();
  logger.info('connected to sessions inmem');
  const server = http.createServer(app);
  server.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`);
  });
};

await start();