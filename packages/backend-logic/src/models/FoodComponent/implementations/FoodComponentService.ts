import type { FoodComponentDT, FoodComponentDTN } from '@m-cafe-app/models';
import type { IFoodComponentRepo, IFoodComponentService } from '../interfaces';
import { FoodComponentMapper } from '../infrastructure';


export class FoodComponentService implements IFoodComponentService {
  constructor( readonly dbRepo: IFoodComponentRepo ) {}

  async getAll(): Promise<FoodComponentDT[]> {
    const foodComponents = await this.dbRepo.getAll();

    const res: FoodComponentDT[] = foodComponents.map(foodComponent => FoodComponentMapper.domainToDT(foodComponent));

    return res;
  }

  async getById(id: number): Promise<FoodComponentDT> {
    const foodComponent = await this.dbRepo.getById(id);

    const res: FoodComponentDT = FoodComponentMapper.domainToDT(foodComponent);

    return res;
  }

  async create(foodComponentDTN: FoodComponentDTN): Promise<FoodComponentDT> {
    const savedFoodComponent = await this.dbRepo.create(foodComponentDTN);

    const res: FoodComponentDT = FoodComponentMapper.domainToDT(savedFoodComponent);

    return res;
  }

  async update(foodComponent: FoodComponentDT, foodId: number): Promise<FoodComponentDT> {
    const updatedFoodComponent = await this.dbRepo.update(FoodComponentMapper.dtToDomain(foodComponent), foodId);

    const res: FoodComponentDT = FoodComponentMapper.domainToDT(updatedFoodComponent);

    return res;
  }

  async createMany(foodComponentDTNs: FoodComponentDTN[]): Promise<FoodComponentDT[]> {
    const savedFoodComponents = await this.dbRepo.createMany(foodComponentDTNs);

    const res: FoodComponentDT[] = savedFoodComponents.map(foodComponent => FoodComponentMapper.domainToDT(foodComponent));

    return res;
  }

  async rewriteAllForOneFood(updFoodComponents: FoodComponentDTN[], foodId: number): Promise<FoodComponentDT[]> {
    const savedFoodComponents = await this.dbRepo.rewriteAllForOneFood(updFoodComponents, foodId);

    const res: FoodComponentDT[] = savedFoodComponents.map(foodComponent => FoodComponentMapper.domainToDT(foodComponent));

    return res;
  }

  async remove(id: number): Promise<void> {
    await this.dbRepo.remove(id);
  }

  async removeAll(): Promise<void> {
    await this.dbRepo.removeAll();
  }
}