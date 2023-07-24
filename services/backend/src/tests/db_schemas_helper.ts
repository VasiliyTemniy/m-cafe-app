// No types for libs pg-info, pg-diff-sync

/* eslint-disable @typescript-eslint/ban-ts-comment */
import pg from 'pg';
// @ts-ignore
import pgInfo from '@wmfs/pg-info';


interface DBSchemaInfo {
  generated: object;
  schemas: object[];
}

const getDBInfo = async (db_uri1: string, db_uri2: string) => {
  const client1 = new pg.Client(db_uri1);
  await client1.connect();

  const client2 = new pg.Client(db_uri2);
  await client2.connect();

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
  const info1 = await pgInfo({
    client: client1,
    schemas: [
      'public'
    ]
  }) as DBSchemaInfo;


  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
  const info2 = await pgInfo({
    client: client2,
    schemas: [
      'public'
    ]
  }) as DBSchemaInfo;



  return { info1, info2 };
};

export { getDBInfo };