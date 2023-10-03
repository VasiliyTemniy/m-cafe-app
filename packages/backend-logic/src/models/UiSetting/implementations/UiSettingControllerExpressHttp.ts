import type { IUiSettingController, IUiSettingService } from '../interfaces';
import type { Request, Response } from 'express';
import type { RequestWithUserRights } from '../../../utils';
import { isUiSettingDTMany, isUiSettingDTNU } from '../UiSettingDT.js';
import { ApplicationError, RequestBodyError } from '@m-cafe-app/utils';


export class UiSettingControllerExpressHttp implements IUiSettingController {
  constructor( readonly service: IUiSettingService ) {}

  async getAll(req: Request, res: Response) {
    const uiSettings = await this.service.getAll();
    res.status(200).json(uiSettings);
  }

  async getById(req: Request, res: Response) {
    const uiSetting = await this.service.getById(Number(req.params.id));
    res.status(200).json(uiSetting);
  }

  async getAllByScope(req: RequestWithUserRights, res: Response) {
    const scope = req.rights === 'admin'
      ? 'all'
      : 'nonFalsy';

    const uiSettings = await this.service.getAllByScope(scope);
    res.status(200).json(uiSettings);
  }

  async create(req: Request, res: Response) {
    if (!isUiSettingDTNU(req.body))
      throw new RequestBodyError('Invalid new ui setting request body');

    const { name, value, theme, group } = req.body;

    if (!this.service.create)
      throw new ApplicationError(`Create method not implemented for service ${this.service.constructor.name}`);

    const savedUiSetting = await this.service.create({
      name,
      value,
      theme,
      group
    });
    
    res.status(201).json(savedUiSetting);
  }

  async update(req: Request, res: Response) {
    if (!isUiSettingDTNU(req.body))
      throw new RequestBodyError('Invalid edit ui setting request body');

    const { name, value, theme, group } = req.body;

    if (!this.service.update)
      throw new ApplicationError(`Update method not implemented for service ${this.service.constructor.name}`);

    const updatedUiSetting = await this.service.update({
      id: Number(req.params.id),
      name,
      value,
      theme,
      group
    });
    
    res.status(200).json(updatedUiSetting);
  }

  async updateMany(req: Request, res: Response) {
    if (!isUiSettingDTMany(req.body))
      throw new RequestBodyError('Invalid edit many ui settings request body');

    const updUiSettings = req.body;

    if (!this.service.updateMany)
      throw new ApplicationError(`Update many method not implemented for service ${this.service.constructor.name}`);

    const updatedUiSettings = await this.service.updateMany(updUiSettings);
    if (!updatedUiSettings) throw new ApplicationError('Could not update ui settings, check service implementation');

    res.status(200).json(updatedUiSettings);
  }

  async remove(req: Request, res: Response) {
    if (!this.service.remove)
      throw new ApplicationError(`Remove method not implemented for service ${this.service.constructor.name}`);
    await this.service.remove(Number(req.params.id));
    
    res.status(204).end();
  }
}