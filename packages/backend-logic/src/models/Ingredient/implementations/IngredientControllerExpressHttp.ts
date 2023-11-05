import type { IngredientDT } from '@m-cafe-app/models';
import type { IIngredientControllerHttp, IIngredientService } from '../interfaces';
import type { Request, Response } from 'express';
import { isIngredientDTN, isIngredientDT } from '@m-cafe-app/models';
import { RequestBodyError } from '@m-cafe-app/utils';

export class IngredientControllerExpressHttp implements IIngredientControllerHttp {
  constructor( readonly service: IIngredientService ) {}

  async getAll(req: Request, res: Response): Promise<void> {
    const ingredients: IngredientDT[] = await this.service.getAll();
    res.status(200).json(ingredients);
  }

  async getById(req: Request, res: Response): Promise<void> {
    const ingredient: IngredientDT = await this.service.getById(Number(req.params.id));
    res.status(200).json(ingredient);
  }

  async create(req: Request, res: Response): Promise<void> {
    if (!isIngredientDTN(req.body))
      throw new RequestBodyError('Invalid new ingredient request body');

    const { nameLoc, stockMeasureLoc, proteins, carbohydrates, fats, calories } = req.body;

    const ingredient: IngredientDT = await this.service.create({
      nameLoc,
      stockMeasureLoc,
      proteins,
      carbohydrates,
      fats,
      calories
    });

    res.status(201).json(ingredient);
  }

  async update(req: Request, res: Response): Promise<void> {
    if (!isIngredientDT(req.body))
      throw new RequestBodyError('Invalid edit ingredient request body');

    const { nameLoc, stockMeasureLoc, proteins, carbohydrates, fats, calories } = req.body;

    const updatedIngredient: IngredientDT = await this.service.update({
      id: Number(req.params.id),
      nameLoc,
      stockMeasureLoc,
      proteins,
      carbohydrates,
      fats,
      calories
    });

    res.status(200).json(updatedIngredient);
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