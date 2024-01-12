import 'mocha';
import { dbHandler } from '@m-cafe-app/db';
import supertest from 'supertest';
import app from '../app';
import { apiBaseUrl } from './test_helper';
import { fixedLocService, sessionService, uiSettingService, userService } from '../controllers';


const api = supertest(app);


describe('Reset before all testing, ping all services, repositories, etc', () => {

  before(async () => {
    await dbHandler.connect();
    await dbHandler.pingDb();

    await userService.authController.connect();
    await userService.authController.ping();
    await userService.authController.flushExternalDB();
    await userService.authController.getPublicKey();


    await uiSettingService.connectInmem();
    await uiSettingService.pingInmem();
    await fixedLocService.connectInmem();
    await fixedLocService.pingInmem();
    await sessionService.connectInmem();
    await sessionService.pingInmem();
  });

  it('Reset', async () => {
    await api
      .get(`${apiBaseUrl}/testing/reset`)
      .expect(204);
  });

});

