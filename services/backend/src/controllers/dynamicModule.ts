import {
  DatabaseError,
  DynamicModuleDT,
  isEditDynamicModuleBody,
  isNewDynamicModuleBody,
  mapDataToTransit,
  RequestBodyError,
  timestampsKeys,
  updateInstance
} from '@m-cafe-app/utils';
import { Router, RequestHandler } from 'express';
import { DynamicModule, LocString, Picture } from '../models/index.js';
import middleware from '../utils/middleware.js';
import { includeAltTextLocNoTimestamps, includeLocStringNoTimestamps } from '../utils/sequelizeHelpers.js';


const dynamicModuleRouter = Router();

dynamicModuleRouter.get(
  '/',
  (async (req, res) => {

    const dynamicModules = await DynamicModule.findAll({
      attributes: {
        exclude: [...timestampsKeys]
      },
      include: [
        {
          model: Picture,
          as: 'picture',
          required: false,
          attributes: {
            exclude: [...timestampsKeys]
          },
          include: [
            includeAltTextLocNoTimestamps
          ]
        },
        includeLocStringNoTimestamps
      ]
    });

    const resBody: DynamicModuleDT[] = dynamicModules.map(dynamicModule => {
      const resDynamicModule: DynamicModuleDT = {
        locString: dynamicModule.locString ? mapDataToTransit(dynamicModule.locString.dataValues)
        : undefined,
        picture: dynamicModule.picture ? {
          altTextLoc: mapDataToTransit(dynamicModule.picture.altTextLoc!.dataValues),
          ...mapDataToTransit(dynamicModule.picture.dataValues)
        } : undefined,
        ...mapDataToTransit(dynamicModule.dataValues)
      };
      return resDynamicModule;
    });
    
    res.status(200).json(resBody);

  }) as RequestHandler
);

dynamicModuleRouter.get(
  '/:id',
  middleware.requestParamsCheck,
  (async (req, res) => {

    const dynamicModule = await DynamicModule.findByPk(req.params.id, {
      attributes: {
        exclude: [...timestampsKeys]
      },
      include: [
        {
          model: Picture,
          as: 'picture',
          required: false,
          attributes: {
            exclude: [...timestampsKeys]
          },
          include: [
            includeAltTextLocNoTimestamps
          ]
        },
        includeLocStringNoTimestamps
      ]
    });
    if (!dynamicModule) throw new DatabaseError(`No dynamic module entry with this id ${req.params.id}`);

    const resBody: DynamicModuleDT = {
      locString: dynamicModule.locString ? mapDataToTransit(dynamicModule.locString.dataValues)
      : undefined,
      picture: dynamicModule.picture ? {
        altTextLoc: mapDataToTransit(dynamicModule.picture.altTextLoc!.dataValues),
        ...mapDataToTransit(dynamicModule.picture.dataValues)
      } : undefined,
      ...mapDataToTransit(dynamicModule.dataValues)
    };
    
    res.status(200).json(resBody);

  }) as RequestHandler
);

dynamicModuleRouter.post(
  '/',
  middleware.verifyToken,
  middleware.adminCheck,
  middleware.sessionCheck,
  (async (req, res) => {

    if (!isNewDynamicModuleBody(req.body)) throw new RequestBodyError('Invalid new dynamic module request body');

    const { moduleType, page, placement, className, inlineCss, url, locString, placementType } = req.body;
    
    const savedLocString = await LocString.create(locString);

    const savedDynamicModule = await DynamicModule.create({
      moduleType,
      page,
      placement,
      className,
      inlineCss,
      url,
      locStringId: savedLocString.id,
      placementType
    });

    const resBody: DynamicModuleDT = {
      locString: mapDataToTransit(savedLocString.dataValues),
      ...mapDataToTransit(savedDynamicModule.dataValues)
    };
    
    res.status(201).json(resBody);

  }) as RequestHandler
);

dynamicModuleRouter.put(
  '/:id',
  middleware.verifyToken,
  middleware.adminCheck,
  middleware.sessionCheck,
  middleware.requestParamsCheck,
  (async (req, res) => {

    if (!isEditDynamicModuleBody(req.body)) throw new RequestBodyError('Invalid new dynamic module request body');

    const { moduleType, page, placement, className, inlineCss, url, locString, placementType } = req.body;

    const updDynamicModule = await DynamicModule.findByPk(req.params.id, {
      attributes: {
        exclude: [...timestampsKeys]
      },
      include: [
        {
          model: Picture,
          as: 'picture',
          required: false,
          attributes: {
            exclude: [...timestampsKeys]
          },
          include: [
            includeAltTextLocNoTimestamps
          ]
        }
      ]
    });
    if (!updDynamicModule) throw new DatabaseError(`No dynamic module entry with this id ${req.params.id}`);
    
    let updLocString = null as LocString | null;

    if (locString) {
      updLocString = await LocString.findByPk(locString.id);
      if (!updLocString) throw new DatabaseError(`No localization entry with this id ${locString.id}`);

      updateInstance(updLocString, locString);

      await updLocString.save();
    }

    updDynamicModule.moduleType = moduleType;
    updDynamicModule.page = page;
    updDynamicModule.placement = placement;
    updDynamicModule.className = className ? className : updDynamicModule.className;
    updDynamicModule.inlineCss = inlineCss ? inlineCss : updDynamicModule.inlineCss;
    updDynamicModule.url = url ? url : updDynamicModule.url;
    updDynamicModule.placementType = placementType ? placementType : updDynamicModule.placementType;

    await updDynamicModule.save();

    const resBody: DynamicModuleDT = {
      locString: updLocString
        ? mapDataToTransit(updLocString.dataValues)
        : undefined,
      picture: updDynamicModule.picture ? {
        altTextLoc: mapDataToTransit(updDynamicModule.picture.altTextLoc!.dataValues),
        ...mapDataToTransit(updDynamicModule.picture.dataValues)
      } : undefined,
      ...mapDataToTransit(updDynamicModule.dataValues)
    };
    
    res.status(200).json(resBody);

  }) as RequestHandler
);

dynamicModuleRouter.delete(
  '/:id',
  middleware.verifyToken,
  middleware.adminCheck,
  middleware.sessionCheck,
  middleware.requestParamsCheck,
  (async (req, res) => {

    await DynamicModule.destroy({ where: { id: req.params.id } });

    res.status(204).end();

  }) as RequestHandler
);

export default dynamicModuleRouter;