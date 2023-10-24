import type { FoodTypeDT, FoodTypeDTN } from '@m-cafe-app/models';
import type { IFoodTypeRepo, IFoodTypeService } from '../interfaces';
import { FoodTypeMapper } from '../infrastructure';


export class FoodTypeService implements IFoodTypeService {
  constructor( readonly dbRepo: IFoodTypeRepo ) {}

  async getAll(): Promise<FoodTypeDT[]> {
    const foodTypes = await this.dbRepo.getAll();

    const res: FoodTypeDT[] = foodTypes.map(foodType => FoodTypeMapper.domainToDT(foodType));

    return res;
  }

  async getById(id: number): Promise<FoodTypeDT> {
    const foodType = await this.dbRepo.getById(id);

    const res: FoodTypeDT = FoodTypeMapper.domainToDT(foodType);

    return res;
  }

  async create(foodTypeDTN: FoodTypeDTN): Promise<FoodTypeDT> {
    const savedFoodType = await this.dbRepo.create(foodTypeDTN);

    const res: FoodTypeDT = FoodTypeMapper.domainToDT(savedFoodType);

    return res;
  }

  async update(foodType: FoodTypeDT): Promise<FoodTypeDT> {
    const updatedFoodType = await this.dbRepo.update(FoodTypeMapper.dtToDomain(foodType));

    const res: FoodTypeDT = FoodTypeMapper.domainToDT(updatedFoodType);

    return res;
  }

  async remove(id: number): Promise<void> {
    await this.dbRepo.remove(id);
  }

  async removeAll(): Promise<void> {
    await this.dbRepo.removeAll();
  }
}