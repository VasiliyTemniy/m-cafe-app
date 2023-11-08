import type { FoodDT, FoodDTN } from '@m-cafe-app/models';
import type { IFoodRepo, IFoodService } from '../interfaces';
import { FoodMapper } from '../infrastructure';


export class FoodService implements IFoodService {
  constructor( readonly dbRepo: IFoodRepo ) {}

  async getAll(): Promise<FoodDT[]> {
    const foods = await this.dbRepo.getAll();

    return foods.map(food => FoodMapper.domainToDT(food));
  }

  async getById(id: number): Promise<FoodDT> {
    const food = await this.dbRepo.getById(id);

    return FoodMapper.domainToDT(food);
  }

  async create(foodDTN: FoodDTN): Promise<FoodDT> {
    const savedFood = await this.dbRepo.create(foodDTN);

    return FoodMapper.domainToDT(savedFood);
  }

  async update(food: FoodDT): Promise<FoodDT> {
    const updatedFood = await this.dbRepo.update(FoodMapper.dtToDomain(food));

    return FoodMapper.domainToDT(updatedFood);
  }

  async remove(id: number): Promise<void> {
    await this.dbRepo.remove(id);
  }

  async removeAll(): Promise<void> {
    await this.dbRepo.removeAll();
  }
}