import type { RequestHandler } from 'express';
import { Router } from 'express';
import { middleware } from '../utils/middleware.js';
import { foodController, pictureService } from '../controllers';


const foodRouter = Router();

foodRouter.get(
  '/',
  (async (req, res) => {

    await foodController.getSomeWithAssociations(req, res);

  }) as RequestHandler
);

foodRouter.get(
  '/:id',
  middleware.requestParamsCheck.bind(middleware),
  (async (req, res) => {

    await foodController.getByIdWithAssociations(req, res);

  }) as RequestHandler
);

foodRouter.post(
  '/',
  middleware.verifyToken.bind(middleware),
  middleware.userRightsExtractor.bind(middleware) as RequestHandler,
  middleware.adminCheck.bind(middleware),
  (async (req, res) => {

    await foodController.create(req, res);

  }) as RequestHandler
);

foodRouter.post(
  '/:id/pictures',
  middleware.verifyToken.bind(middleware),
  middleware.userRightsExtractor.bind(middleware) as RequestHandler,
  middleware.adminCheck.bind(middleware),
  middleware.requestParamsCheck.bind(middleware),
  pictureService.upload.single('picture').bind(pictureService),
  (async (req, res) => {
  
    await foodController.addPicture(req, res);

  }) as RequestHandler
);

foodRouter.put(
  '/:id',
  middleware.verifyToken.bind(middleware),
  middleware.userRightsExtractor.bind(middleware) as RequestHandler,
  middleware.adminCheck.bind(middleware),
  middleware.requestParamsCheck.bind(middleware),
  (async (req, res) => {

    await foodController.update(req, res);

  }) as RequestHandler
);

foodRouter.put(
  '/:id/pictures',
  middleware.verifyToken.bind(middleware),
  middleware.userRightsExtractor.bind(middleware) as RequestHandler,
  middleware.adminCheck.bind(middleware),
  middleware.requestParamsCheck.bind(middleware),
  (async (req, res) => {
    
    await foodController.updatePicturesOrder(req, res);

  }) as RequestHandler
);

foodRouter.delete(
  '/:id',
  middleware.verifyToken.bind(middleware),
  middleware.userRightsExtractor.bind(middleware) as RequestHandler,
  middleware.adminCheck.bind(middleware),
  middleware.requestParamsCheck.bind(middleware),
  (async (req, res) => {

    await foodController.remove(req, res);

  }) as RequestHandler
);

foodRouter.delete(
  '/:id/pictures',
  middleware.verifyToken.bind(middleware),
  middleware.userRightsExtractor.bind(middleware) as RequestHandler,
  middleware.adminCheck.bind(middleware),
  (async (req, res) => {
    
    await foodController.removePicturesByFoodId(req, res);

  }) as RequestHandler
);

foodRouter.delete(
  '/:id/pictures/:pictureId',
  middleware.verifyToken.bind(middleware),
  middleware.userRightsExtractor.bind(middleware) as RequestHandler,
  middleware.adminCheck.bind(middleware),
  middleware.requestParamsCheck.bind(middleware),
  (async (req, res) => {
    
    await foodController.removePicture(req, res);

  }) as RequestHandler
);

export default foodRouter;