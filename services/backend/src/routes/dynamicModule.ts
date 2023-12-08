import type { RequestHandler } from 'express';
import { Router } from 'express';
import { middleware } from '../utils/middleware.js';
import { dynamicModuleController, pictureService } from '../controllers/index.js';


const dynamicModuleRouter = Router();

dynamicModuleRouter.get(
  '/',
  (async (req, res) => {

    await dynamicModuleController.getAll(req, res);

  }) as RequestHandler
);

dynamicModuleRouter.get(
  '/:id',
  middleware.requestParamsCheck.bind(middleware),
  (async (req, res) => {

    await dynamicModuleController.getById(req, res);

  }) as RequestHandler
);

dynamicModuleRouter.post(
  '/',
  middleware.verifyToken.bind(middleware),
  middleware.userRightsExtractor.bind(middleware) as RequestHandler,
  middleware.adminCheck.bind(middleware),
  (async (req, res) => {

    await dynamicModuleController.create(req, res);

  }) as RequestHandler
);

dynamicModuleRouter.post(
  '/:id/loc-string',
  middleware.verifyToken.bind(middleware),
  middleware.userRightsExtractor.bind(middleware) as RequestHandler,
  middleware.adminCheck.bind(middleware),
  middleware.requestParamsCheck.bind(middleware),
  (async (req, res) => {
  
    await dynamicModuleController.addLocString(req, res);

  }) as RequestHandler
);

dynamicModuleRouter.post(
  '/:id/picture',
  middleware.verifyToken.bind(middleware),
  middleware.userRightsExtractor.bind(middleware) as RequestHandler,
  middleware.adminCheck.bind(middleware),
  middleware.requestParamsCheck.bind(middleware),
  pictureService.upload.single('picture').bind(pictureService),
  (async (req, res) => {

    await dynamicModuleController.addPicture(req, res);

  }) as RequestHandler
);

dynamicModuleRouter.put(
  '/:id',
  middleware.verifyToken.bind(middleware),
  middleware.userRightsExtractor.bind(middleware) as RequestHandler,
  middleware.adminCheck.bind(middleware),
  middleware.requestParamsCheck.bind(middleware),
  (async (req, res) => {

    await dynamicModuleController.update(req, res);

  }) as RequestHandler
);

dynamicModuleRouter.delete(
  '/:id',
  middleware.verifyToken.bind(middleware),
  middleware.userRightsExtractor.bind(middleware) as RequestHandler,
  middleware.adminCheck.bind(middleware),
  middleware.requestParamsCheck.bind(middleware),
  (async (req, res) => {

    await dynamicModuleController.remove(req, res);

  }) as RequestHandler
);

dynamicModuleRouter.delete(
  '/:id/loc-string',
  middleware.verifyToken.bind(middleware),
  middleware.userRightsExtractor.bind(middleware) as RequestHandler,
  middleware.adminCheck.bind(middleware),
  middleware.requestParamsCheck.bind(middleware),
  (async (req, res) => {
  
    await dynamicModuleController.removeLocString(req, res);

  }) as RequestHandler  
);

dynamicModuleRouter.delete(
  '/:id/picture',
  middleware.verifyToken.bind(middleware),
  middleware.userRightsExtractor.bind(middleware) as RequestHandler,
  middleware.adminCheck.bind(middleware),
  middleware.requestParamsCheck.bind(middleware),
  (async (req, res) => {
  
    await dynamicModuleController.removePicture(req, res);

  }) as RequestHandler
);

export default dynamicModuleRouter;