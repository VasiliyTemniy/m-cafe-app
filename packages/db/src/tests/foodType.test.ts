import { expect } from 'chai';
import 'mocha';
import { connectToDatabase } from '../db';
import { FoodType, LocString } from '../models';


await connectToDatabase();


describe('Database FoodType model tests', () => {

  let foodTypeNameLoc: LocString;
  let foodTypeDescriptionLoc: LocString;

  before(async () => {
    foodTypeNameLoc = await LocString.create({
      mainStr: 'тест',
      secStr: 'тест',
      altStr: 'тест'
    });

    foodTypeDescriptionLoc = await LocString.create({
      mainStr: 'тест',
      secStr: 'тест',
      altStr: 'тест'
    });
  });

  beforeEach(async () => {
    await FoodType.destroy({ force: true, where: {} });
  });

  after(async () => {
    await FoodType.destroy({ force: true, where: {} });
    await LocString.destroy({ force: true, where: {} });
  });

  it('FoodType creation test', async () => {

    const foodType = await FoodType.create({
      nameLocId: foodTypeNameLoc.id,
      descriptionLocId: foodTypeDescriptionLoc.id
    });

    expect(foodType).to.exist;

  });

  it('FoodType update test', async () => {
    
    const foodType = await FoodType.create({
      nameLocId: foodTypeNameLoc.id,
      descriptionLocId: foodTypeDescriptionLoc.id
    });

    const newFoodTypeNameLoc = await LocString.create({
      mainStr: 'тест2',
      secStr: 'тест2',
      altStr: 'тест2'
    });

    foodType.nameLocId = newFoodTypeNameLoc.id;

    await foodType.save();

    const foodTypeInDB = await FoodType.findOne({ where: { id: foodType.id } });

    expect(foodTypeInDB?.nameLocId).to.equal(newFoodTypeNameLoc.id);

  });

  it('FoodType delete test', async () => {

    const foodType = await FoodType.create({
      nameLocId: foodTypeNameLoc.id,
      descriptionLocId: foodTypeDescriptionLoc.id
    });

    await foodType.destroy();

    const foodTypeInDB = await FoodType.findOne({ where: { id: foodType.id } });

    expect(foodTypeInDB).to.not.exist;

  });

  it('FoodType default scope test: does not include timestamps', async () => {
    
    const foodType = await FoodType.create({
      nameLocId: foodTypeNameLoc.id,
      descriptionLocId: foodTypeDescriptionLoc.id
    });

    const foodTypeInDB = await FoodType.findOne({ where: { id: foodType.id } });

    expect(foodTypeInDB?.createdAt).to.not.exist;
    expect(foodTypeInDB?.updatedAt).to.not.exist;

  });

});