import type { FoodDT } from '@m-cafe-app/models';
import type { IFoodControllerHttp, IFoodService } from '../interfaces';
import type { Request, Response } from 'express';
import { isFoodDTN, isFoodDT } from '@m-cafe-app/models';
import { RequestBodyError } from '@m-cafe-app/utils';

export class FoodControllerExpressHttp implements IFoodControllerHttp {
  constructor( readonly service: IFoodService ) {}

  async getAll(req: Request, res: Response): Promise<void> {
    const foods: FoodDT[] = await this.service.getAll();
    res.status(200).json(foods);
  }

  async getById(req: Request, res: Response): Promise<void> {
    const food: FoodDT = await this.service.getById(Number(req.params.id));
    res.status(200).json(food);
  }

  async create(req: Request, res: Response): Promise<void> {
    if (!isFoodDTN(req.body))
      throw new RequestBodyError('Invalid new food request body');

    const { nameLoc, descriptionLoc, foodTypeId, price } = req.body;

    const food: FoodDT = await this.service.create({
      nameLoc,
      descriptionLoc,
      foodTypeId,
      price
    });

    res.status(201).json(food);
  }

  async update(req: Request, res: Response): Promise<void> {
    if (!isFoodDT(req.body))
      throw new RequestBodyError('Invalid edit food request body');

    const { nameLoc, descriptionLoc, foodType, price } = req.body;

    const updatedFood: FoodDT = await this.service.update({
      id: Number(req.params.id),
      nameLoc,
      descriptionLoc,
      foodType,
      price
    });

    res.status(200).json(updatedFood);
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