import { expect } from 'chai';
import 'mocha';
import { Food, FoodType, LocString, FoodComponent, Ingredient } from '../models';
import { dbHandler } from '../db';



describe('Database FoodComponent model tests', () => {

  let foodNameLoc: LocString;
  let foodDescriptionLoc: LocString;
  let stockMeasureLoc: LocString;
  let foodType: FoodType;
  let food: Food;
  let foodAsFoodComponent: Food;
  let ingredient: Ingredient;

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

    stockMeasureLoc = await LocString.create({
      mainStr: 'тест',
      secStr: 'тест',
      altStr: 'тест'
    });

    foodType = await FoodType.create({
      nameLocId: foodNameLoc.id,
      descriptionLocId: foodDescriptionLoc.id
    });

    food = await Food.create({
      nameLocId: foodNameLoc.id,
      descriptionLocId: foodDescriptionLoc.id,
      price: 1,
      foodTypeId: foodType.id
    });

    foodAsFoodComponent = await Food.create({
      nameLocId: foodNameLoc.id,
      descriptionLocId: foodDescriptionLoc.id,
      price: 1,
      foodTypeId: foodType.id
    });

    ingredient = await Ingredient.create({
      nameLocId: foodNameLoc.id,
      stockMeasureLocId: stockMeasureLoc.id,
      proteins: 1,
      fats: 1,
      carbohydrates: 1,
      calories: 1
    });
  });

  beforeEach(async () => {
    await FoodComponent.destroy({ force: true, where: {} });
  });

  after(async () => {
    await Food.destroy({ force: true, where: {} });
    await FoodType.destroy({ force: true, where: {} });
    await Ingredient.destroy({ force: true, where: {} });
    await FoodComponent.destroy({ force: true, where: {} });
    await LocString.destroy({ force: true, where: {} });
  });

  it('FoodComponent creation test', async () => {

    const foodComponent = await FoodComponent.create({
      foodId: food.id,
      componentId: ingredient.id,
      amount: 1,
      compositeFood: false
    });

    expect(foodComponent).to.exist;

    const foodComponentWithFoodAsComponent = await FoodComponent.create({
      foodId: food.id,
      componentId: foodAsFoodComponent.id,
      amount: 1,
      compositeFood: true
    });

    expect(foodComponentWithFoodAsComponent).to.exist;

  });

  it('FoodComponent update test', async () => {
    
    const foodComponent = await FoodComponent.create({
      foodId: food.id,
      componentId: ingredient.id,
      amount: 1,
      compositeFood: false
    });

    foodComponent.amount = 2;
    foodComponent.componentId = foodAsFoodComponent.id;
    foodComponent.compositeFood = true;

    await foodComponent.save();

    const foodComponentInDB = await FoodComponent.findOne({ where: { id: foodComponent.id } });

    expect(foodComponentInDB?.amount).to.equal(2);
    expect(foodComponentInDB?.compositeFood).to.equal(true);

  });

  it('FoodComponent delete test', async () => {

    const foodComponent = await FoodComponent.create({
      foodId: food.id,
      componentId: ingredient.id,
      amount: 1,
      compositeFood: false
    });

    await foodComponent.destroy();

    const foodComponentInDB = await FoodComponent.findOne({ where: { id: foodComponent.id } });

    expect(foodComponentInDB).to.not.exist;

  });

  it('FoodComponent default scope test: does not include timestamps', async () => {
    
    const foodComponent = await FoodComponent.create({
      foodId: food.id,
      componentId: ingredient.id,
      amount: 1,
      compositeFood: false
    });

    const foodComponentInDB = await FoodComponent.findOne({ where: { id: foodComponent.id } });

    expect(foodComponentInDB?.createdAt).to.not.exist;
    expect(foodComponentInDB?.updatedAt).to.not.exist;

  });

});