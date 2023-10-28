import type { FoodDT, FoodDTN } from '@m-cafe-app/models';
import type { IFoodRepo, IFoodService } from '../interfaces';
import { FoodMapper } from '../infrastructure';


export class FoodService implements IFoodService {
  constructor( readonly dbRepo: IFoodRepo ) {}

  async getAll(): Promise<FoodDT[]> {
    const foods = await this.dbRepo.getAll();

    const res: FoodDT[] = foods.map(food => FoodMapper.domainToDT(food));

    return res;
  }

  async getById(id: number): Promise<FoodDT> {
    const food = await this.dbRepo.getById(id);

    const res: FoodDT = FoodMapper.domainToDT(food);

    return res;
  }

  async create(foodDTN: FoodDTN): Promise<FoodDT> {
    const savedFood = await this.dbRepo.create(foodDTN);

    const res: FoodDT = FoodMapper.domainToDT(savedFood);

    return res;
  }

  async update(food: FoodDT): Promise<FoodDT> {
    const updatedFood = await this.dbRepo.update(FoodMapper.dtToDomain(food));

    const res: FoodDT = FoodMapper.domainToDT(updatedFood);

    return res;
  }

  async remove(id: number): Promise<void> {
    await this.dbRepo.remove(id);
  }

  async removeAll(): Promise<void> {
    await this.dbRepo.removeAll();
  }
}