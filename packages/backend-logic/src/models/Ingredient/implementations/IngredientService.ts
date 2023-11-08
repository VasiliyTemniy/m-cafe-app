import type { IngredientDT, IngredientDTN } from '@m-cafe-app/models';
import type { IIngredientRepo, IIngredientService } from '../interfaces';
import { IngredientMapper } from '../infrastructure';


export class IngredientService implements IIngredientService {
  constructor( readonly dbRepo: IIngredientRepo ) {}

  async getAll(): Promise<IngredientDT[]> {
    const ingredients = await this.dbRepo.getAll();

    return ingredients.map(ingredient => IngredientMapper.domainToDT(ingredient));
  }

  async getById(id: number): Promise<IngredientDT> {
    const ingredient = await this.dbRepo.getById(id);

    return IngredientMapper.domainToDT(ingredient);
  }

  async create(ingredientDTN: IngredientDTN): Promise<IngredientDT> {
    const savedIngredient = await this.dbRepo.create(ingredientDTN);

    return IngredientMapper.domainToDT(savedIngredient);
  }

  async update(ingredient: IngredientDT): Promise<IngredientDT> {
    const updatedIngredient = await this.dbRepo.update(IngredientMapper.dtToDomain(ingredient));

    return IngredientMapper.domainToDT(updatedIngredient);
  }

  async remove(id: number): Promise<void> {
    await this.dbRepo.remove(id);
  }

  async removeAll(): Promise<void> {
    await this.dbRepo.removeAll();
  }
}