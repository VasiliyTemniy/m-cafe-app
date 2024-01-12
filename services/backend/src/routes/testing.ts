import type { RequestHandler } from 'express';
import { Router } from 'express';
import { dbHandler } from '@m-cafe-app/db';

const testingRouter = Router();

testingRouter.get(
  '/ping',
  (req, res) => {
    res.status(200).json({ 'message': 'Pong' });
  });

testingRouter.get(
  '/reset',
  (async (req, res) => {
    await dbHandler.dbInstance?.query('DELETE FROM migrations');
    await dbHandler.dbInstance?.drop({ cascade: true });
    await dbHandler.runMigrations();

    res.status(204).end();
  }) as RequestHandler
);

testingRouter.get(
  '/sync',
  (async (req, res) => {
    await dbHandler.dbInstance?.sync({
      force: true
    });

    res.status(204).end();
  }) as RequestHandler
);

export default testingRouter;