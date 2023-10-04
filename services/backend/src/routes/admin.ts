import type { RequestHandler } from 'express';
import type { FixedLocDT } from '@m-cafe-app/utils';
import { Router } from 'express';
import {
  mapDataToTransit
} from '@m-cafe-app/utils';
import middleware from '../utils/middleware.js';
import { FixedLoc } from '@m-cafe-app/db';
import { initFixedLocs } from '../utils/initFixedLocs.js';
import { uiSettingController, userController } from '../controllers';


const adminRouter = Router();

adminRouter.get(
  '/user/',
  middleware.verifyToken,
  middleware.adminCheck,
  middleware.sessionCheck,
  (async (req, res) => {

    await userController.getSome(req, res);

  }) as RequestHandler
);


// adminRouter.get(
//   '/user/',
//   middleware.verifyToken,
//   middleware.adminCheck,
//   middleware.sessionCheck,
//   (async (req, res) => {

//     let limit = 20;
//     let offset = 0;

//     if (req.query.limit) {
//       if (isNaN(Number(req.query.limit))) throw new RequestQueryError('Incorrect query string');
//       limit = Number(req.query.limit);
//     }

//     if (req.query.offset) {
//       if (isNaN(Number(req.query.offset))) throw new RequestQueryError('Incorrect query string');
//       offset = Number(req.query.offset);
//     }

//     const userSubjects = await User.scope('all').findAll({
//       attributes: { exclude: ['passwordHash'] },
//       limit,
//       offset
//     });

//     res.status(200).json(userSubjects);

//   }) as RequestHandler
// );

adminRouter.get(
  '/user/:id',
  middleware.verifyToken,
  middleware.adminCheck,
  middleware.sessionCheck,
  middleware.requestParamsCheck,
  (async (req, res) => {

    await userController.getById(req, res);

  }) as RequestHandler
);

// adminRouter.get(
//   '/user/:id',
//   middleware.verifyToken,
//   middleware.adminCheck,
//   middleware.sessionCheck,
//   middleware.requestParamsCheck,
//   (async (req, res) => {

//     const userSubject = await User.scope('all').findByPk(req.params.id, {
//       attributes: { exclude: ['passwordHash'] }
//     });

//     if (!userSubject) throw new DatabaseError(`No user entry with this id ${req.params.id}`);

//     res.status(200).json(userSubject);

//   }) as RequestHandler
// );

adminRouter.put(
  '/user/:id',
  middleware.verifyToken,
  middleware.adminCheck,
  middleware.sessionCheck,
  middleware.requestParamsCheck,
  (async (req, res) => {

    await userController.administrate(req, res);

  }) as RequestHandler
);

// adminRouter.put(
//   '/user/:id',
//   middleware.verifyToken,
//   middleware.adminCheck,
//   middleware.sessionCheck,
//   middleware.requestParamsCheck,
//   (async (req, res) => {

//     if (!isAdministrateUserBody(req.body)) throw new RequestBodyError('Invalid administrate user request body');

//     const userSubject = await User.scope('all').findByPk(req.params.id, { paranoid: false });

//     if (!userSubject) throw new DatabaseError(`No user entry with this id ${req.params.id}`);
//     if (userSubject.phonenumber === config.SUPERADMIN_PHONENUMBER)
//       throw new ProhibitedError('Attempt to alter superadmin');

//     if (hasOwnProperty(req.body, 'rights')) {
//       if (possibleUserRights.includes(req.body.rights!))
//         userSubject.rights = req.body.rights!;

//       if (userSubject.rights === 'disabled') {
//         await Session.destroy({
//           where: {
//             userId: userSubject.id,
//           }
//         });
//       }
//     }

//     if (hasOwnProperty(req.body, 'restore') && req.body.restore) {
//       await userSubject.restore();
//     }

//     await userSubject.save();

//     res.status(200).json(userSubject);

//   }) as RequestHandler
// );

adminRouter.delete(
  '/user/:id',
  middleware.verifyToken,
  middleware.adminCheck,
  middleware.sessionCheck,
  middleware.requestParamsCheck,
  (async (req, res) => {

    await userController.delete(req, res);

  }) as RequestHandler
);

// adminRouter.delete(
//   '/user/:id',
//   middleware.verifyToken,
//   middleware.adminCheck,
//   middleware.sessionCheck,
//   middleware.requestParamsCheck,
//   (async (req, res) => {

//     const userSubject = await User.scope('allWithTimestamps').findByPk(req.params.id);

//     if (!userSubject) throw new DatabaseError(`No user entry with this id ${req.params.id}`);
//     if (!userSubject.deletedAt) throw new ProhibitedError('Only voluntarily deleted users can be fully removed by admins');

//     await userSubject.destroy({ force: true });

//     res.status(204).end();

//   }) as RequestHandler
// );

adminRouter.get(
  '/fixed-loc/reset',
  middleware.verifyToken,
  middleware.superAdminCheck,
  middleware.sessionCheck,
  (async (req, res) => {

    await FixedLoc.scope('admin').destroy({ where: {} });
    await initFixedLocs();

    const fixedLocs = await FixedLoc.findAll();

    const resBody: FixedLocDT[] = fixedLocs.map(fixedLoc => {
      const resFixedLoc: FixedLocDT = {
        locString: mapDataToTransit(fixedLoc.locString!.dataValues),
        ...mapDataToTransit(fixedLoc.dataValues)
      };
      return resFixedLoc;
    });
    
    res.status(200).json(resBody);

  }) as RequestHandler
);

adminRouter.get(
  '/ui-setting/reset',
  middleware.verifyToken,
  middleware.superAdminCheck,
  middleware.sessionCheck,
  (async (req, res) => {

    await uiSettingController.reset(req, res);

  }) as RequestHandler
);

export default adminRouter;