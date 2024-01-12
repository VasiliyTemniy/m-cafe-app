import type { IDynamicModuleControllerExpressHttp, IDynamicModuleService } from '../interfaces';
import type { Request, Response } from 'express';
import type { DynamicModuleDT } from '@m-market-app/models';
import { isDynamicModuleDTN, isDynamicModuleDT, isLocStringDTN, isPictureForDynamicModuleDTN } from '@m-market-app/models';
import { RequestBodyError, UploadFileError } from '@m-market-app/utils';

export class DynamicModuleControllerExpressHttp implements IDynamicModuleControllerExpressHttp {
  constructor (readonly service: IDynamicModuleService) {}

  async getAll(req: Request, res: Response): Promise<void> {
    const dynamicModules = await this.service.getAll();
    res.status(200).json(dynamicModules);
  }

  async getById(req: Request, res: Response): Promise<void> {
    const dynamicModule = await this.service.getById(Number(req.params.id));
    res.status(200).json(dynamicModule);
  }

  async getAllByPage(req: Request, res: Response): Promise<void> {
    // Sanitize somehow??
    const dynamicModules = await this.service.getAllByPage(req.params.page);
    res.status(200).json(dynamicModules);
  }

  async create(req: Request, res: Response): Promise<void> {
    if (!isDynamicModuleDTN(req.body))
      throw new RequestBodyError('Invalid create dynamic module request body');

    const { locString, moduleType, page, placement, className, inlineCss, url, placementType } = req.body;

    const dynamicModuleDT: DynamicModuleDT = await this.service.create({
      locString,
      moduleType,
      page,
      placement,
      className,
      inlineCss,
      url,
      placementType
    });
    
    res.status(201).json(dynamicModuleDT);
  }

  async update(req: Request, res: Response): Promise<void> {
    if (!isDynamicModuleDT(req.body))
      throw new RequestBodyError('Invalid edit dynamic module request body');

    const { locString, moduleType, page, placement, className, inlineCss, url, placementType } = req.body;

    const dynamicModuleDT: DynamicModuleDT = await this.service.update({
      id: Number(req.params.id),
      locString,
      moduleType,
      page,
      placement,
      className,
      inlineCss,
      url,
      placementType
    });
    
    res.status(200).json(dynamicModuleDT);
  }

  async remove(req: Request, res: Response): Promise<void> {
    await this.service.remove(Number(req.params.id));
    res.status(204).send();
  }

  async removeAll(req: Request, res: Response): Promise<void> {
    await this.service.removeAll();
    res.status(204).send();
  }

  async addLocString(req: Request, res: Response): Promise<void> {
    if (!isLocStringDTN(req.body))
      throw new RequestBodyError('Invalid add locString to dynamic module request body');

    const { mainStr, secStr, altStr } = req.body;

    const updatedDynamicModule: DynamicModuleDT = await this.service.addLocString(
      Number(req.params.id),
      {
        mainStr,
        secStr,
        altStr
      }
    );

    res.status(200).json(updatedDynamicModule);
  }

  async removeLocString(req: Request, res: Response): Promise<void> {
    
    const updatedDynamicModule: DynamicModuleDT = await this.service.removeLocString(
      Number(req.params.id),
    );

    res.status(200).json(updatedDynamicModule);
  }

  async addPicture(req: Request, res: Response): Promise<void> {
    if (!isPictureForDynamicModuleDTN(req.body))
      throw new RequestBodyError('Invalid add picture to dynamic module request body');
    if (!req.file)
      throw new UploadFileError('File cannot be read');

    const { dynamicModuleId, altTextMainStr, altTextSecStr, altTextAltStr } = req.body;

    const updatedDynamicModule: DynamicModuleDT = await this.service.addPicture(
      {
        dynamicModuleId,
        altTextMainStr,
        altTextSecStr,
        altTextAltStr
      },
      req.file.path,
      req.file.originalname
    );

    res.status(200).json(updatedDynamicModule);
  }

  async removePicture(req: Request, res: Response): Promise<void> {

    const updatedDynamicModule: DynamicModuleDT = await this.service.removePicture(
      Number(req.params.id),
    );

    res.status(200).json(updatedDynamicModule);
  }
}