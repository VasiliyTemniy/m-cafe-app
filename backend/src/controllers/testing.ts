import { RequestHandler, Router } from 'express';
import { runMigrations, sequelize } from '../utils/db.js';

const testingRouter = Router();

testingRouter.post(
  '/reset',
  (async (req, res) => {
    await sequelize.drop();
    await runMigrations();

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