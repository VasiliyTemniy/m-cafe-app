import type { FacilityDT, StockDT } from '@m-cafe-app/models';
import type { IFacilityControllerHttp, IFacilityService } from '../interfaces';
import type { Request, Response } from 'express';
import {
  isFacilityDTN,
  isFacilityDT,
  isStockDTN,
  isStockDTNMany,
  isStockDT,
  isStockDTMany,
  isManageManagersBody
} from '@m-cafe-app/models';
import { RequestBodyError, isNumber } from '@m-cafe-app/utils';

export class FacilityControllerExpressHttp implements IFacilityControllerHttp {
  constructor( readonly service: IFacilityService ) {}

  async getAll(req: Request, res: Response): Promise<void> {
    if (!req.query.include) {
      const facilities = await this.service.getAll();
      res.status(200).json(facilities);
    }

    if (req.query.include === 'stocks') {
      const facilities = await this.service.getAllWithStocks();
      res.status(200).json(facilities);
    }

    if (req.query.include === 'managers') {
      const facilities = await this.service.getAllWithManagers();
      res.status(200).json(facilities);
    }

    if (req.query.include === 'full') {
      const facilities = await this.service.getAllWithFullData();
      res.status(200).json(facilities);
    }
  }

  async getById(req: Request, res: Response): Promise<void> {
    if (!req.query.include) {
      const facility: FacilityDT = await this.service.getById(Number(req.params.id));
      res.status(200).json(facility);
    }

    if (req.query.include === 'stocks') {
      const facility: FacilityDT = await this.service.getByIdWithStocks(Number(req.params.id));
      res.status(200).json(facility);
    }

    if (req.query.include === 'managers') {
      const facility: FacilityDT = await this.service.getByIdWithManagers(Number(req.params.id));
      res.status(200).json(facility);
    }

    if (req.query.include === 'full') {
      const facility: FacilityDT = await this.service.getByIdWithFullData(Number(req.params.id));
      res.status(200).json(facility);
    }
  }

  async create(req: Request, res: Response): Promise<void> {
    if (!isFacilityDTN(req.body))
      throw new RequestBodyError('Invalid new facility request body');

    const { nameLoc, descriptionLoc, address } = req.body;

    const facility: FacilityDT = await this.service.create({
      nameLoc,
      descriptionLoc,
      address
    });

    res.status(201).json(facility);
  }

  async update(req: Request, res: Response): Promise<void> {
    if (!isFacilityDT(req.body))
      throw new RequestBodyError('Invalid edit facility request body');

    const { nameLoc, descriptionLoc, address } = req.body;

    const updatedFacility: FacilityDT = await this.service.update({
      id: Number(req.params.id),
      nameLoc,
      descriptionLoc,
      address
    });

    res.status(200).json(updatedFacility);
  }

  async remove(req: Request, res: Response): Promise<void> {
    await this.service.remove(Number(req.params.id));
    res.status(204).end();
  }

  async removeAll(req: Request, res: Response): Promise<void> {
    await this.service.removeAll();
    res.status(204).end();
  }

  async createStock(req: Request, res: Response): Promise<void> {
    if (!isStockDTN(req.body))
      throw new RequestBodyError('Invalid create new stock request body');

    const { ingredientId, facilityId, amount } = req.body;

    // Do I need to check this?..
    // if (facilityId !== req.params.id)
    //   throw new RequestBodyError('Invalid facility id in stock request body');

    const stock: StockDT = await this.service.createStock({
      ingredientId,
      facilityId,
      amount
    });

    res.status(201).json(stock);
  }

  async createManyStocks(req: Request, res: Response): Promise<void> {
    if (!isStockDTNMany(req.body))
      throw new RequestBodyError('Invalid create many new stocks request body');

    const stocks: StockDT[] = await this.service.createManyStocks(req.body);

    res.status(201).json(stocks);
  }

  async updateStock(req: Request, res: Response): Promise<void> {
    if (!isStockDT(req.body))
      throw new RequestBodyError('Invalid edit stock request body');

    const { id, ingredientId, facilityId, amount } = req.body;

    const updatedStock: StockDT = await this.service.updateStock({
      id,
      ingredientId,
      facilityId,
      amount
    });

    res.status(200).json(updatedStock);
  }

  async updateManyStocks(req: Request, res: Response): Promise<void> {
    if (!isStockDTMany(req.body))
      throw new RequestBodyError('Invalid many edit stock request body');

    const updatedStocks = await this.service.updateManyStocks(req.body);

    res.status(200).json(updatedStocks);
  }

  async removeStock(req: Request, res: Response): Promise<void> {
    await this.service.removeStock(Number(req.params.id));
    res.status(204).end();
  }

  async removeManyStocks(req: Request, res: Response): Promise<void> {
    if (!(Array.isArray(req.body) && req.body.every(isNumber)))
      throw new RequestBodyError('Invalid remove many stocks request body');

    await this.service.removeManyStocks(req.body);
    res.status(204).end();
  }

  async addManagers(req: Request, res: Response): Promise<void> {
    if (!isManageManagersBody(req.body))
      throw new RequestBodyError('Invalid add managers request body');

    const { facilityId, managerIds } = req.body;

    const updatedFacility: FacilityDT = await this.service.addManagers(
      facilityId,
      managerIds
    );
    
    res.status(200).json(updatedFacility);
  }

  async removeManagers(req: Request, res: Response): Promise<void> {
    if (!isManageManagersBody(req.body))
      throw new RequestBodyError('Invalid remove managers request body');

    const { facilityId, managerIds } = req.body;

    const updatedFacility: FacilityDT = await this.service.removeManagers(
      facilityId,
      managerIds
    );

    res.status(200).json(updatedFacility);
  }
}