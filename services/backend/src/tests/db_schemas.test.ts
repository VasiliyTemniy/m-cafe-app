import { expect } from "chai";
import "mocha";
import { getDBInfo } from "./db_schemas_helper";
import { connectToDatabase } from "../utils/db";
import config from "../utils/config";
import supertest from "supertest";
import app from "../app";
import { apiBaseUrl } from "./test_helper";
import { diffString } from 'json-diff';


const api = supertest(app);


describe('Database migrations code is synchronized with models code', () => {

  it('Schema comparison diff should be null', async () => {

    if (process.env.RUN_COMPARISON_TEST === 'false') return;


    await connectToDatabase();

    await api
      .get(`${apiBaseUrl}/testing/reset`)
      .expect(204);

    const dbInfo1 = await getDBInfo(config.DATABASE_URL);

    await api
      .get(`${apiBaseUrl}/testing/sync`)
      .expect(204);

    const dbInfo2 = await getDBInfo(config.DATABASE_URL);


    const deepEqual = (obj1: object, obj2: object): boolean => {
      const str1 = JSON.stringify(obj1);
      const str2 = JSON.stringify(obj2);

      return str1 === str2;
    };

    const state = deepEqual(dbInfo1, dbInfo2);

    if (!state) console.log(diffString(dbInfo1, dbInfo2));

    expect(state).to.equal(true);


  });

});

