import { RequestHandler, Router } from 'express';
import { runMigrations, sequelize } from '@m-cafe-app/db-models';

const testingRouter = Router();

testingRouter.get(
  '/ping',
  (req, res) => {
    res.status(200).json({ "message": "Pong" });
  });

testingRouter.get(
  '/reset',
  (async (req, res) => {
    await sequelize.drop({ cascade: true });
    await runMigrations();

    res.status(204).end();
  }) as RequestHandler
);

testingRouter.get(
  '/sync',
  (async (req, res) => {
    await sequelize.sync({
      force: true
    });

    res.status(204).end();
  }) as RequestHandler
);

// testingRouter.put(
//   '/admin/:id',
//   (async (req, res) => {

//     const user = await User.findByPk(req.params.id);

//     if (user) {

//       user.admin = req.body.admin;

//       await user.save();

//       res.json(user);
//     } else {
//       throw new Error('No entry');
//     }

//   }) as RequestHandler
// );

export default testingRouter;