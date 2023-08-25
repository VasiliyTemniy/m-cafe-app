import {
  DatabaseError,
  UiSettingDT,
  isEditUiSettingBody,
  isNewUiSettingBody,
  mapDataToTransit,
  RequestBodyError,
  timestampsKeys
} from '@m-cafe-app/utils';
import { Router, RequestHandler } from 'express';
import { UiSetting } from '@m-cafe-app/db';
import middleware from '../utils/middleware.js';


const uiSettingRouter = Router();

uiSettingRouter.get(
  '/',
  (async (req, res) => {

    const uiSettings = await UiSetting.findAll({
      attributes: {
        exclude: [...timestampsKeys]
      }
    });

    const resBody: UiSettingDT[] = uiSettings.map(uiSetting => {
      const resUiSetting: UiSettingDT = {
        ...mapDataToTransit(uiSetting.dataValues)
      };
      return resUiSetting;
    });
    
    res.status(200).json(resBody);

  }) as RequestHandler
);

uiSettingRouter.get(
  '/:id',
  middleware.requestParamsCheck,
  (async (req, res) => {

    const uiSetting = await UiSetting.findByPk(req.params.id, {
      attributes: {
        exclude: [...timestampsKeys]
      }
    });
    if (!uiSetting) throw new DatabaseError(`No ui setting entry with this id ${req.params.id}`);

    const resBody: UiSettingDT = {
      ...mapDataToTransit(uiSetting.dataValues)
    };
    
    res.status(200).json(resBody);

  }) as RequestHandler
);

uiSettingRouter.post(
  '/',
  middleware.verifyToken,
  middleware.adminCheck,
  middleware.sessionCheck,
  (async (req, res) => {

    if (!isNewUiSettingBody(req.body)) throw new RequestBodyError('Invalid new ui setting request body');

    const { name, value } = req.body;
    
    const savedUiSetting = await UiSetting.create({
      name,
      value
    });

    const resBody: UiSettingDT = {
      ...mapDataToTransit(savedUiSetting.dataValues)
    };
    
    res.status(201).json(resBody);

  }) as RequestHandler
);

uiSettingRouter.put(
  '/:id',
  middleware.verifyToken,
  middleware.adminCheck,
  middleware.sessionCheck,
  middleware.requestParamsCheck,
  (async (req, res) => {

    if (!isEditUiSettingBody(req.body)) throw new RequestBodyError('Invalid edit ui setting request body');

    const { name, value } = req.body;

    const updUiSetting = await UiSetting.findByPk(req.params.id, {
      attributes: {
        exclude: [...timestampsKeys]
      }
    });
    if (!updUiSetting) throw new DatabaseError(`No ui setting entry with this id ${req.params.id}`);

    updUiSetting.name = name;
    updUiSetting.value = value;

    await updUiSetting.save();

    const resBody: UiSettingDT = {
      ...mapDataToTransit(updUiSetting.dataValues)
    };
    
    res.status(200).json(resBody);

  }) as RequestHandler
);

uiSettingRouter.delete(
  '/:id',
  middleware.verifyToken,
  middleware.adminCheck,
  middleware.sessionCheck,
  middleware.requestParamsCheck,
  (async (req, res) => {

    await UiSetting.destroy({ where: { id: req.params.id } });

    res.status(204).end();

  }) as RequestHandler
);

export default uiSettingRouter;