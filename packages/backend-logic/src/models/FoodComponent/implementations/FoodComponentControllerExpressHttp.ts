import type { FoodComponentDT } from '@m-cafe-app/models';
import type { IFoodComponentControllerHttp, IFoodComponentService } from '../interfaces';
import type { Request, Response } from 'express';
import { isFoodComponentDTN, isFoodComponentDT, isFoodComponentDTNMany, isRewriteAllForOneFoodBody } from '@m-cafe-app/models';
import { RequestBodyError } from '@m-cafe-app/utils';

export class FoodComponentControllerExpressHttp implements IFoodComponentControllerHttp {
  constructor( readonly service: IFoodComponentService ) {}

  async getAll(req: Request, res: Response): Promise<void> {
    const foodComponents: FoodComponentDT[] = await this.service.getAll();
    res.status(200).json(foodComponents);
  }

  async getById(req: Request, res: Response): Promise<void> {
    const foodComponent: FoodComponentDT = await this.service.getById(Number(req.params.id));
    res.status(200).json(foodComponent);
  }

  async create(req: Request, res: Response): Promise<void> {
    if (!isFoodComponentDTN(req.body))
      throw new RequestBodyError('Invalid new foodComponent request body');

    const { foodId, componentId, compositeFood, quantity } = req.body;

    const foodComponent: FoodComponentDT = await this.service.create({
      foodId,
      componentId,
      compositeFood,
      quantity
    });

    res.status(201).json(foodComponent);
  }

  async createMany(req: Request, res: Response): Promise<void> {
    if (!isFoodComponentDTNMany(req.body))
      throw new RequestBodyError('Invalid new foodComponent request body');

    const foodComponents = req.body;

    const createdFoodComponents: FoodComponentDT[] = await this.service.createMany(foodComponents);

    res.status(201).json(createdFoodComponents);
  }

  async update(req: Request, res: Response): Promise<void> {
    if (!isFoodComponentDT(req.body))
      throw new RequestBodyError('Invalid edit foodComponent request body');

    const { id, component, compositeFood, quantity } = req.body;

    const updatedFoodComponent: FoodComponentDT = await this.service.update({
      id,
      component,
      compositeFood,
      quantity,
    }, Number(req.params.id));

    res.status(200).json(updatedFoodComponent);
  }

  async rewriteAllForOneFood(req: Request, res: Response): Promise<void> {
    if (!isRewriteAllForOneFoodBody(req.body))
      throw new RequestBodyError('Invalid rewrite all for one food request body');

    const { foodId, components } = req.body;

    const updatedFoodComponents: FoodComponentDT[] = await this.service.rewriteAllForOneFood(components, foodId);

    res.status(200).json(updatedFoodComponents);
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