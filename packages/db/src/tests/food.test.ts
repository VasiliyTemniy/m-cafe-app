import { expect } from 'chai';
import 'mocha';
import { Food, FoodType, LocString } from '../models';
import { dbHandler } from '../db';



describe('Database Food model tests', () => {

  let foodNameLoc: LocString;
  let foodDescriptionLoc: LocString;
  let foodType: FoodType;

  before(async () => {
    await dbHandler.pingDb();

    foodNameLoc = await LocString.create({
      mainStr: 'тест',
      secStr: 'тест',
      altStr: 'тест'
    });

    foodDescriptionLoc = await LocString.create({
      mainStr: 'тест',
      secStr: 'тест',
      altStr: 'тест'
    });

    foodType = await FoodType.create({
      nameLocId: foodNameLoc.id,
      descriptionLocId: foodDescriptionLoc.id
    });
  });

  beforeEach(async () => {
    await Food.destroy({ force: true, where: {} });
  });

  after(async () => {
    await Food.destroy({ force: true, where: {} });
    await FoodType.destroy({ force: true, where: {} });
    await LocString.destroy({ force: true, where: {} });
  });

  it('Food creation test', async () => {

    const food = await Food.create({
      nameLocId: foodNameLoc.id,
      descriptionLocId: foodDescriptionLoc.id,
      price: 1,
      foodTypeId: foodType.id
    });

    expect(food).to.exist;

  });

  it('Food update test', async () => {
    
    const food = await Food.create({
      nameLocId: foodNameLoc.id,
      descriptionLocId: foodDescriptionLoc.id,
      price: 1,
      foodTypeId: foodType.id
    });

    food.price = 2;

    await food.save();

    const foodInDB = await Food.findOne({ where: { id: food.id } });

    expect(foodInDB?.price).to.equal(2);

  });

  it('Food delete test', async () => {

    const food = await Food.create({
      nameLocId: foodNameLoc.id,
      descriptionLocId: foodDescriptionLoc.id,
      price: 1,
      foodTypeId: foodType.id
    });

    await food.destroy();

    const foodInDB = await Food.findOne({ where: { id: food.id } });

    expect(foodInDB).to.not.exist;

  });

  it('Food default scope test: does not include timestamps', async () => {
    
    const food = await Food.create({
      nameLocId: foodNameLoc.id,
      descriptionLocId: foodDescriptionLoc.id,
      price: 1,
      foodTypeId: foodType.id
    });

    const foodInDB = await Food.findOne({ where: { id: food.id } });

    expect(foodInDB?.createdAt).to.not.exist;
    expect(foodInDB?.updatedAt).to.not.exist;

  });

});