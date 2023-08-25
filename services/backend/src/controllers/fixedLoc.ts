import {
  DatabaseError,
  FixedLocDT,
  isEditFixedLocBody,
  isNewFixedLocBody,
  mapDataToTransit,
  RequestBodyError,
  updateInstance
} from '@m-cafe-app/utils';
import { Router, RequestHandler } from 'express';
import { FixedLoc, LocString } from '@m-cafe-app/db-models';
import middleware from '../utils/middleware.js';
import { includeLocStringNoTimestamps } from '../utils/sequelizeHelpers.js';


const fixedLocRouter = Router();

fixedLocRouter.get(
  '/',
  (async (req, res) => {

    const fixedLocs = await FixedLoc.findAll({
      include: [
        includeLocStringNoTimestamps
      ]
    });

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

fixedLocRouter.get(
  '/:id',
  middleware.requestParamsCheck,
  (async (req, res) => {

    const fixedLoc = await FixedLoc.findByPk(req.params.id, {
      include: [
        includeLocStringNoTimestamps
      ]
    });
    if (!fixedLoc) throw new DatabaseError(`No ui setting entry with this id ${req.params.id}`);

    const resBody: FixedLocDT = {
      locString: mapDataToTransit(fixedLoc.locString!.dataValues),
      ...mapDataToTransit(fixedLoc.dataValues)
    };
    
    res.status(200).json(resBody);

  }) as RequestHandler
);

fixedLocRouter.post(
  '/',
  middleware.verifyToken,
  middleware.adminCheck,
  middleware.sessionCheck,
  (async (req, res) => {

    if (!isNewFixedLocBody(req.body)) throw new RequestBodyError('Invalid new ui setting request body');

    const { name, locString } = req.body;
    
    const savedLocString = await LocString.create(locString);

    const savedFixedLoc = await FixedLoc.create({
      name,
      locStringId: savedLocString.id
    });

    const resBody: FixedLocDT = {
      locString: mapDataToTransit(savedLocString.dataValues),
      ...mapDataToTransit(savedFixedLoc.dataValues)
    };
    
    res.status(201).json(resBody);

  }) as RequestHandler
);

fixedLocRouter.put(
  '/:id',
  middleware.verifyToken,
  middleware.adminCheck,
  middleware.sessionCheck,
  middleware.requestParamsCheck,
  (async (req, res) => {

    if (!isEditFixedLocBody(req.body)) throw new RequestBodyError('Invalid edit ui setting request body');

    const { name, locString } = req.body;

    const updFixedLoc = await FixedLoc.findByPk(req.params.id, {
      include: [
        includeLocStringNoTimestamps
      ]
    });
    if (!updFixedLoc) throw new DatabaseError(`No ui setting entry with this id ${req.params.id}`);

    const updLocString = await LocString.findByPk(locString.id);
    if (!updLocString) throw new DatabaseError(`No localization entry with this id ${locString.id}`);

    updateInstance(updLocString, locString);

    await updLocString.save();

    updFixedLoc.name = name;

    await updFixedLoc.save();

    const resBody: FixedLocDT = {
      locString: mapDataToTransit(updLocString.dataValues),
      ...mapDataToTransit(updFixedLoc.dataValues)
    };
    
    res.status(200).json(resBody);

  }) as RequestHandler
);

fixedLocRouter.delete(
  '/:id',
  middleware.verifyToken,
  middleware.adminCheck,
  middleware.sessionCheck,
  middleware.requestParamsCheck,
  (async (req, res) => {

    await FixedLoc.destroy({ where: { id: req.params.id } });
    await LocString.destroy({ where: { id: req.params.id } });

    res.status(204).end();

  }) as RequestHandler
);

export default fixedLocRouter;