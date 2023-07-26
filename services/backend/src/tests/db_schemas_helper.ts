// No types for libs pg-info, pg-diff-sync

/* eslint-disable @typescript-eslint/ban-ts-comment */
import pg from 'pg';
// @ts-ignore
import pgInfo from '@wmfs/pg-info';


interface DBSchemaInfo {
  generated: object;
  schemas: object[];
}

const getDBInfo = async (db_uri: string) => {
  const client = new pg.Client(db_uri);
  await client.connect();

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
  const info = await pgInfo({
    client,
    schemas: [
      'public'
    ]
  }) as DBSchemaInfo;


  return info.schemas;
};

export { getDBInfo };