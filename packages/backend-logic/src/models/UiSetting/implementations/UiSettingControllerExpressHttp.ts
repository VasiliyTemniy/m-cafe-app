import type { IUiSettingControllerHttp, IUiSettingService } from '../interfaces';
import type { Request, Response } from 'express';
import type { RequestWithUserRights } from '../../../utils';
import type { UiSettingDT, UiSettingInmemDT } from '@m-cafe-app/models';
import { isUiSettingDTMany, isUiSettingDTN } from '@m-cafe-app/models';
import { ApplicationError, RequestBodyError, isString } from '@m-cafe-app/utils';


export class UiSettingControllerExpressHttp implements IUiSettingControllerHttp {
  constructor( readonly service: IUiSettingService ) {}

  async getAll(req: Request, res: Response): Promise<void> {
    const uiSettings: UiSettingDT[] = await this.service.getAll();
    res.status(200).json(uiSettings);
  }

  async getById(req: Request, res: Response): Promise<void> {
    const uiSetting: UiSettingDT = await this.service.getById(Number(req.params.id));
    res.status(200).json(uiSetting);
  }

  async getByScope(req: RequestWithUserRights, res: Response): Promise<void> {
    if (req.rights === 'admin') {
      let scope = 'all';

      if (isString(req.query.scope)) scope = req.query.scope;

      const uiSettings: UiSettingDT[] = await this.service.getByScope(scope);
      res.status(200).json(uiSettings);
    } else {
      let theme = '';

      if (isString(req.query.theme)) theme = req.query.theme;

      const uiSettings: UiSettingInmemDT[] = await this.service.getFromInmem(theme);
      res.status(200).json(uiSettings);
    }
  }

  async create(req: Request, res: Response): Promise<void> {
    if (!isUiSettingDTN(req.body))
      throw new RequestBodyError('Invalid new ui setting request body');

    const { name, value, theme, group } = req.body;

    const savedUiSetting: UiSettingDT = await this.service.create({
      name,
      value,
      theme,
      group
    });
    
    res.status(201).json(savedUiSetting);
  }

  async update(req: Request, res: Response): Promise<void> {
    if (!isUiSettingDTN(req.body))
      throw new RequestBodyError('Invalid edit ui setting request body');

    const { name, value, theme, group } = req.body;

    const updatedUiSetting: UiSettingDT = await this.service.update({
      id: Number(req.params.id),
      name,
      value,
      theme,
      group
    });
    
    res.status(200).json(updatedUiSetting);
  }

  async updateMany(req: Request, res: Response): Promise<void> {
    if (!isUiSettingDTMany(req.body))
      throw new RequestBodyError('Invalid edit many ui settings request body');

    const updUiSettings = req.body;

    if (!this.service.updateMany)
      throw new ApplicationError(`Update many method not implemented for service ${this.service.constructor.name}`);

    const updatedUiSettings: UiSettingDT[] = await this.service.updateMany(updUiSettings);
    if (!updatedUiSettings) throw new ApplicationError('Could not update ui settings, check service implementation');

    res.status(200).json(updatedUiSettings);
  }

  async reset(req: Request, res: Response): Promise<void> {
    const resettedUiSettings: UiSettingDT[] = await this.service.reset();

    res.status(200).json(resettedUiSettings);
  }
}