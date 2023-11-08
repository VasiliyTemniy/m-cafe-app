import type { FoodComponentDT, FoodComponentDTN } from '@m-cafe-app/models';
import type { IFoodComponentRepo, IFoodComponentService } from '../interfaces';
import { FoodComponentMapper } from '../infrastructure';


export class FoodComponentService implements IFoodComponentService {
  constructor( readonly dbRepo: IFoodComponentRepo ) {}

  async getAll(): Promise<FoodComponentDT[]> {
    const foodComponents = await this.dbRepo.getAll();

    return foodComponents.map(foodComponent => FoodComponentMapper.domainToDT(foodComponent));
  }

  async getById(id: number): Promise<FoodComponentDT> {
    const foodComponent = await this.dbRepo.getById(id);

    return FoodComponentMapper.domainToDT(foodComponent);
  }

  async create(foodComponentDTN: FoodComponentDTN): Promise<FoodComponentDT> {
    const savedFoodComponent = await this.dbRepo.create(foodComponentDTN);

    return FoodComponentMapper.domainToDT(savedFoodComponent);
  }

  async update(foodComponent: FoodComponentDT, foodId: number): Promise<FoodComponentDT> {
    const updatedFoodComponent = await this.dbRepo.update(FoodComponentMapper.dtToDomain(foodComponent), foodId);

    return FoodComponentMapper.domainToDT(updatedFoodComponent);
  }

  async createMany(foodComponentDTNs: FoodComponentDTN[]): Promise<FoodComponentDT[]> {
    const savedFoodComponents = await this.dbRepo.createMany(foodComponentDTNs);

    return savedFoodComponents.map(foodComponent => FoodComponentMapper.domainToDT(foodComponent));
  }

  async rewriteAllForOneFood(updFoodComponents: FoodComponentDTN[], foodId: number): Promise<FoodComponentDT[]> {
    const savedFoodComponents = await this.dbRepo.rewriteAllForOneFood(updFoodComponents, foodId);

    return savedFoodComponents.map(foodComponent => FoodComponentMapper.domainToDT(foodComponent));
  }

  async remove(id: number): Promise<void> {
    await this.dbRepo.remove(id);
  }

  async removeAll(): Promise<void> {
    await this.dbRepo.removeAll();
  }
}