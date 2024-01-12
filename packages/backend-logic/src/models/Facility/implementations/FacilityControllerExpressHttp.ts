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
import { ProhibitedError, RequestBodyError, UnknownError, isNumber } from '@m-cafe-app/utils';
import { isRequestCustom } from '../../../utils';

export class FacilityControllerExpressHttp implements IFacilityControllerHttp {
  constructor( readonly service: IFacilityService ) {}

  async getAll(req: Request, res: Response): Promise<void> {
    const facilities = await this.service.getAll();
    res.status(200).json(facilities);
  }

  async getAllWithAssociations(req: Request, res: Response): Promise<void> {
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
    const facility: FacilityDT = await this.service.getById(Number(req.params.id));
    res.status(200).json(facility);
  }

  async getByIdWithAssociations(req: Request, res: Response): Promise<void> {
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
    if (!isRequestCustom(req))
      throw new UnknownError('This code should never be reached - check verifyToken and userRightsExtractor middleware');

    const { ingredientId, facilityId, quantity } = req.body;

    // Customers must be already filtered by managerCheck middleware
    // If stocks are managed by manager, check if user is a manager of the facility he tries to update stocks of
    if (req.rights === 'manager') {
      const isFacilityManager = await this.service.checkFacilityManager(req.userId, facilityId);
      if (!isFacilityManager) {
        throw new UnknownError('This code should never be reached - check verifyToken and userRightsExtractor middleware');
      }
    }

    const stock: StockDT = await this.service.createStock({
      ingredientId,
      facilityId,
      quantity
    });

    res.status(201).json(stock);
  }

  async createManyStocks(req: Request, res: Response): Promise<void> {
    if (!isStockDTNMany(req.body))
      throw new RequestBodyError('Invalid create many new stocks request body');
    if (!isRequestCustom(req))
      throw new UnknownError('This code should never be reached - check verifyToken and userRightsExtractor middleware');

    // Customers must be already filtered by managerCheck middleware
    // If stocks are managed by manager, check if user is a manager of the facility he tries to update stocks of
    if (req.rights === 'manager') {
      const facilityIds: number[] = [];

      for (const stock of req.body) {
        if (!facilityIds.includes(stock.facilityId))
          facilityIds.push(stock.facilityId);
      }

      for (const facilityId of facilityIds) {
        const isFacilityManager = await this.service.checkFacilityManager(req.userId, facilityId);
        if (!isFacilityManager) {
          throw new ProhibitedError('You are not a manager of this facility');
        }
      }
    }

    const stocks: StockDT[] = await this.service.createManyStocks(req.body);

    res.status(201).json(stocks);
  }

  async updateStock(req: Request, res: Response): Promise<void> {
    if (!isStockDT(req.body))
      throw new RequestBodyError('Invalid edit stock request body');
    if (!isRequestCustom(req))
      throw new UnknownError('This code should never be reached - check verifyToken and userRightsExtractor middleware');

    const { id, ingredientId, facilityId, quantity } = req.body;

    // Customers must be already filtered by managerCheck middleware
    // If stocks are managed by manager, check if user is a manager of the facility he tries to update stocks of
    if (req.rights === 'manager') {
      const isFacilityManager = await this.service.checkFacilityManager(req.userId, facilityId);
      if (!isFacilityManager) {
        throw new UnknownError('This code should never be reached - check verifyToken and userRightsExtractor middleware');
      }
    }

    const updatedStock: StockDT = await this.service.updateStock({
      id,
      ingredientId,
      facilityId,
      quantity
    });

    res.status(200).json(updatedStock);
  }

  async updateManyStocks(req: Request, res: Response): Promise<void> {
    if (!isStockDTMany(req.body))
      throw new RequestBodyError('Invalid many edit stock request body');
    if (!isRequestCustom(req))
      throw new UnknownError('This code should never be reached - check verifyToken and userRightsExtractor middleware');

    // Customers must be already filtered by managerCheck middleware
    // If stocks are managed by manager, check if user is a manager of the facility he tries to update stocks of
    if (req.rights === 'manager') {
      const facilityIds: number[] = [];

      for (const stock of req.body) {
        if (!facilityIds.includes(stock.facilityId))
          facilityIds.push(stock.facilityId);
      }

      for (const facilityId of facilityIds) {
        const isFacilityManager = await this.service.checkFacilityManager(req.userId, facilityId);
        if (!isFacilityManager) {
          throw new ProhibitedError('You are not a manager of this facility');
        }
      }
    }

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