import type { FixedLocDT } from '@m-cafe-app/utils';
import type { RequestHandler } from 'express';
import {
  ApplicationError,
  DatabaseError,
  isEditFixedLocBody,
  isEditManyFixedLocBody,
  isNewFixedLocBody,
  mapDataToTransit,
  RequestBodyError,
  updateInstance
} from '@m-cafe-app/utils';
import { Router } from 'express';
import { FixedLoc, LocString } from '@m-cafe-app/db';
import middleware from '../utils/middleware.js';
import { includeLocStringNoTimestamps } from '../utils/sequelizeHelpers.js';
import { fixedLocFilter } from '@m-cafe-app/shared-constants';


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
    if (!fixedLoc) throw new DatabaseError(`No fixed loc entry with this id ${req.params.id}`);

    const resBody: FixedLocDT = {
      locString: mapDataToTransit(fixedLoc.locString!.dataValues),
      ...mapDataToTransit(fixedLoc.dataValues)
    };
    
    res.status(200).json(resBody);

  }) as RequestHandler
);


// Should not ever be used. All new localizations must come with dynamicModules, so this here may be deleted
fixedLocRouter.post(
  '/',
  middleware.verifyToken,
  middleware.adminCheck,
  middleware.sessionCheck,
  (async (req, res) => {

    if (!isNewFixedLocBody(req.body)) throw new RequestBodyError('Invalid new fixed loc request body');

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
  '/all',
  middleware.verifyToken,
  middleware.adminCheck,
  middleware.sessionCheck,
  middleware.requestParamsCheck,
  (async (req, res) => {

    if (!isEditManyFixedLocBody(req.body)) throw new RequestBodyError('Invalid edit many fixed locs request body');

    const { updLocs } = req.body;

    const updFixedLocs = [] as { fixedLoc: FixedLoc, locString: LocString }[];

    for (const updLoc of updLocs) {

      const updFixedLoc = await FixedLoc.findByPk(updLoc.id, {
        include: [
          includeLocStringNoTimestamps
        ]
      });
      if (!updFixedLoc) throw new DatabaseError(`No fixed loc entry with this id ${updLoc.id}`);

      const updLocString = await LocString.findByPk(updLoc.locString.id);
      if (!updLocString) throw new DatabaseError(`No localization entry with this id ${updLoc.locString.id}`);

      updateInstance(updLocString, updLoc.locString);

      await updLocString.save();

      updFixedLocs.push({ fixedLoc: updFixedLoc, locString: updLocString });

    }

    const resBody: FixedLocDT[] = updFixedLocs.map(item => {
      const fixedLoc: FixedLocDT = {
        locString: mapDataToTransit(item.locString.dataValues),
        ...mapDataToTransit(item.fixedLoc.dataValues)
      };
      return fixedLoc;
    });
    
    res.status(200).json(resBody);

  }) as RequestHandler
);

fixedLocRouter.put(
  '/reserve/:id',
  middleware.verifyToken,
  middleware.adminCheck,
  middleware.sessionCheck,
  middleware.requestParamsCheck,
  (async (req, res) => {

    const fixedLoc = await FixedLoc.findByPk(req.params.id);
    if (!fixedLoc) throw new DatabaseError(`No fixed loc entry with this id ${req.params.id}`);

    const locString = await LocString.findByPk(fixedLoc.locStringId);
    if (!locString) throw new ApplicationError(`No loc string entry for existing fixed loc! fixed loc id: ${req.params.id}, loc string id: ${fixedLoc.locStringId}`);

    // Instead of deleting a fixed loc, it is assigned a filter value
    locString.mainStr = fixedLocFilter;
    locString.secStr = fixedLocFilter;
    locString.altStr = fixedLocFilter;

    await locString.save();

    const resBody: FixedLocDT = {
      locString: mapDataToTransit(locString.dataValues),
      ...mapDataToTransit(fixedLoc.dataValues)
    };

    res.status(200).json(resBody);

  }) as RequestHandler
);

fixedLocRouter.put(
  '/:id',
  middleware.verifyToken,
  middleware.adminCheck,
  middleware.sessionCheck,
  middleware.requestParamsCheck,
  (async (req, res) => {

    if (!isEditFixedLocBody(req.body)) throw new RequestBodyError('Invalid edit fixed loc request body');

    const { name, locString } = req.body;
    const _name = name;

    const updFixedLoc = await FixedLoc.findByPk(req.params.id, {
      include: [
        includeLocStringNoTimestamps
      ]
    });
    if (!updFixedLoc) throw new DatabaseError(`No fixed loc entry with this id ${req.params.id}`);

    const updLocString = await LocString.findByPk(locString.id);
    if (!updLocString) throw new DatabaseError(`No localization entry with this id ${locString.id}`);

    updateInstance(updLocString, locString);

    await updLocString.save();

    // updFixedLoc.name = name; // Fixed loc must be fixed, thus name must not be mutated!

    // await updFixedLoc.save(); // locString id is immutable + fixedLoc.name is immutable -> no need to save updFixedLoc instance

    const resBody: FixedLocDT = {
      locString: mapDataToTransit(updLocString.dataValues),
      ...mapDataToTransit(updFixedLoc.dataValues)
    };
    
    res.status(200).json(resBody);

  }) as RequestHandler
);

export default fixedLocRouter;