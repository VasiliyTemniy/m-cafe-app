import type { PictureDT } from '@m-cafe-app/utils';
import type { RequestHandler } from 'express';
import { Router } from 'express';
import middleware from '../utils/middleware.js';
import { foodPicturesDir, modulesPicturesDir, upload } from '../utils/uploadMiddleware.js';
import path from 'path';
import { promises as fs } from 'fs';
import {
  ApplicationError,
  DatabaseError,
  isEditPictureBody,
  isNewPictureBody,
  mapDataToTransit,
  RequestBodyError,
  UploadFileError
} from '@m-cafe-app/utils';
import { LocString, Picture, FoodPicture, DynamicModule, Food } from '@m-cafe-app/db';
import { logger } from '@m-cafe-app/utils';

const pictureRouter = Router();

pictureRouter.get(
  '/:id',
  middleware.requestParamsCheck,
  (async (req, res) => {

    const picture = await Picture.findByPk(req.params.id);
    if (!picture) throw new DatabaseError(`No picture entry with this id ${req.params.id}`);    

    res.status(200).sendFile(picture.src);

  }) as RequestHandler
);

pictureRouter.post(
  '/',
  middleware.verifyToken,
  middleware.adminCheck,
  middleware.sessionCheck,
  upload.single('picture'),
  (async (req, res) => {

    if (!req.file) throw new UploadFileError('File cannot be read');
    if (!isNewPictureBody(req.body)) throw new RequestBodyError('Invalid new picture body');

    const { type, orderNumber, altTextMainStr, altTextSecStr, altTextAltStr, subjectId } = req.body;

    const foundSubject = type === 'foodPicture'
      ? await Food.findByPk(subjectId)
      : await DynamicModule.findByPk(subjectId);

    if (!foundSubject) throw new DatabaseError(`No requested entry with this id ${subjectId}`);

    const __dirname = path.resolve();

    const tempFilePath = req.file.path;
    const targetFilePath = type === 'foodPicture'
      ? path.join(__dirname, foodPicturesDir, `./${type}-${subjectId}.png`)
      : path.join(__dirname, modulesPicturesDir, `./${type}-${subjectId}.png`);

    if (path.extname(req.file.originalname).toLowerCase() === '.png') {
      try {
        await fs.rename(tempFilePath, targetFilePath);
      } catch (e) {
        logger.shout('Filesystem cannot rename a file!', e);
        throw new ApplicationError('Filesystem cannot rename a file. Please, contact admins');
      }
    } else {
      try {
        await fs.unlink(tempFilePath);
      } catch(e) {
        logger.shout('Filesystem cannot delete a file!', e);
        throw new ApplicationError('Filesystem cannot delete a file. Please, contact admins');
      }
      throw new UploadFileError('Only .png images are allowed');
    }

    const savedAltTextLoc = await LocString.create({
      mainStr: altTextMainStr,
      secStr: altTextSecStr,
      altStr: altTextAltStr
    });

    const savedPicture = await Picture.create({
      src: targetFilePath,
      altTextLocId: savedAltTextLoc.id
    });

    if (type === 'foodPicture') {
      await FoodPicture.create({
        foodId: Number(subjectId),
        pictureId: savedPicture.id,
        orderNumber: orderNumber ? Number(orderNumber) : 0
      });
    } else if (type === 'modulePicture') {
      const dynamicModule = foundSubject as DynamicModule;

      dynamicModule.pictureId = savedPicture.id;
      await dynamicModule.save();
    }

    const resBody: PictureDT = {
      id: savedPicture.id,
      src: savedPicture.src,
      altTextLoc: mapDataToTransit(savedAltTextLoc.dataValues)
    };

    res.status(201).json(resBody);

  }) as RequestHandler
);

/**
 * Path to assign new main food picture and/or update altTextLoc
 */
pictureRouter.put(
  '/:id',
  middleware.verifyToken,
  middleware.adminCheck,
  middleware.sessionCheck,
  middleware.requestParamsCheck,
  (async (req, res) => {

    if (!isEditPictureBody(req.body)) throw new RequestBodyError('Invalid new picture body');

    const { type, orderNumber, altTextMainStr, altTextSecStr, altTextAltStr } = req.body;

    const updPicture = await Picture.findByPk(req.params.id);
    if (!updPicture) throw new DatabaseError(`No picture entry with this id ${req.params.id}`);

    const updAltTextLoc = await LocString.findByPk(updPicture.altTextLocId);
    if (!updAltTextLoc) throw new DatabaseError(`No picture entry with this id ${updPicture.altTextLocId}`);

    updAltTextLoc.mainStr = altTextMainStr;
    updAltTextLoc.secStr = altTextSecStr;
    updAltTextLoc.altStr = altTextAltStr;

    if (type === 'foodPicture' && !!orderNumber) {
      const foodPicture = await FoodPicture.findOne({ where: { pictureId: req.params.id } });
      if (!foodPicture) throw new DatabaseError(`No food picture entry with this picture id ${req.params.id}`);
      foodPicture.orderNumber = Number(orderNumber);
      await foodPicture.save();
    }

    await updAltTextLoc.save();

    const resBody: PictureDT = {
      id: updPicture.id,
      src: updPicture.src,
      altTextLoc: mapDataToTransit(updAltTextLoc.dataValues)
    };

    res.status(200).json(resBody);

  }) as RequestHandler
);

pictureRouter.delete(
  '/:id',
  middleware.verifyToken,
  middleware.adminCheck,
  middleware.sessionCheck,
  middleware.requestParamsCheck,
  (async (req, res) => {

    // Must delete Picture + FoodPicture if any because of onDelete cascade for foreign key
    // If the picture was connected to dynamic module, than this module's pictureId will become null
    await Picture.destroy({ where: { id: req.params.id } });

    res.status(204).end();

  }) as RequestHandler
);

export default pictureRouter;