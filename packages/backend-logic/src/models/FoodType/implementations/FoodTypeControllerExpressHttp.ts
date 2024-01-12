import type { FoodTypeDT } from '@m-market-app/models';
import type { IFoodTypeControllerHttp, IFoodTypeService } from '../interfaces';
import type { Request, Response } from 'express';
import { isFoodTypeDT, isFoodTypeDTN } from '@m-market-app/models';
import { RequestBodyError } from '@m-market-app/utils';

export class FoodTypeControllerExpressHttp implements IFoodTypeControllerHttp {
  constructor( readonly service: IFoodTypeService ) {}

  async getAll(req: Request, res: Response): Promise<void> {

    let withFoodOnly = false;

    if (req.query.withfoodonly) {
      withFoodOnly = req.query.withfoodonly === 'true';
    }

    const foodTypes: FoodTypeDT[] = await this.service.getAll(withFoodOnly);
    res.status(200).json(foodTypes);
  }

  async getById(req: Request, res: Response): Promise<void> {
    const foodType: FoodTypeDT = await this.service.getById(Number(req.params.id));
    res.status(200).json(foodType);
  }

  async create(req: Request, res: Response): Promise<void> {
    if (!isFoodTypeDTN(req.body))
      throw new RequestBodyError('Invalid new food type request body');

    const { nameLoc, descriptionLoc } = req.body;

    const foodType: FoodTypeDT = await this.service.create({
      nameLoc,
      descriptionLoc
    });

    res.status(201).json(foodType);
  }

  async update(req: Request, res: Response): Promise<void> {
    if (!isFoodTypeDT(req.body))
      throw new RequestBodyError('Invalid edit food type request body');

    const { nameLoc, descriptionLoc } = req.body;

    const updatedFoodType: FoodTypeDT = await this.service.update({
      id: Number(req.params.id),
      nameLoc,
      descriptionLoc
    });

    res.status(200).json(updatedFoodType);
  }

  async remove(req: Request, res: Response): Promise<void> {
    await this.service.remove(Number(req.params.id));
    res.status(204).end();
  }

  async removeAll(req: Request, res: Response): Promise<void> {
    await this.service.removeAll();
    res.status(204).end();
  }
}