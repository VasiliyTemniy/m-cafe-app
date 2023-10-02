import 'mocha';
import { connectToDatabase } from '@m-cafe-app/db';
import supertest from 'supertest';
import app from '../app';
import { apiBaseUrl } from './test_helper';


const api = supertest(app);


describe('Reset before all testing', () => {

  before(async () => {
    await connectToDatabase();
  });

  it('Reset', async () => {
    await api
      .get(`${apiBaseUrl}/testing/reset`)
      .expect(204);
  });

});

