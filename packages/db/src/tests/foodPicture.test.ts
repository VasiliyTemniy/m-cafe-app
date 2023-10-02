import { expect } from 'chai';
import 'mocha';
import { connectToDatabase } from '../db';
import { Picture, LocString, FoodPicture, Food, FoodType } from '../models';


await connectToDatabase();


describe('Database FoodPicture model tests', () => {

  let pictureAltTextLoc: LocString;
  let picture: Picture;
  let foodNameLoc: LocString;
  let foodDescriptionLoc: LocString;
  let foodType: FoodType;
  let food: Food;


  before(async () => {
    pictureAltTextLoc = await LocString.create({
      mainStr: 'тест',
      secStr: 'тест',
      altStr: 'тест'
    });

    picture = await Picture.create({
      altTextLocId: pictureAltTextLoc.id,
      src: 'тест'
    });

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

    food = await Food.create({
      nameLocId: foodNameLoc.id,
      descriptionLocId: foodDescriptionLoc.id,
      price: 1,
      foodTypeId: foodType.id
    });
  });

  beforeEach(async () => {
    await FoodPicture.destroy({ force: true, where: {} });
  });

  after(async () => {
    await Picture.destroy({ force: true, where: {} });
    await LocString.destroy({ force: true, where: {} });
    await FoodPicture.destroy({ force: true, where: {} });
    await Food.destroy({ force: true, where: {} });
    await FoodType.destroy({ force: true, where: {} });
  });

  it('FoodPicture creation test', async () => {

    const foodPicture = await FoodPicture.create({
      foodId: food.id,
      pictureId: picture.id,
      orderNumber: 1
    });

    expect(foodPicture).to.exist;

  });

  it('FoodPicture update test', async () => {
    
    const foodPicture = await FoodPicture.create({
      foodId: food.id,
      pictureId: picture.id,
      orderNumber: 1
    });

    foodPicture.orderNumber = 2;

    await foodPicture.save();

    const foodPictureInDB = await FoodPicture.findOne({ where: { foodId: food.id, pictureId: picture.id } });

    expect(foodPictureInDB?.orderNumber).to.equal(2);

  });

  it('FoodPicture delete test', async () => {

    const foodPicture = await FoodPicture.create({
      foodId: food.id,
      pictureId: picture.id,
      orderNumber: 1
    });

    await foodPicture.destroy();

    const foodPictureInDB = await FoodPicture.findOne({ where: { foodId: food.id, pictureId: picture.id } });

    expect(foodPictureInDB).to.not.exist;

  });

});