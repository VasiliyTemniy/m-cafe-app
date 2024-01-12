import { expect } from 'chai';
import 'mocha';
import { dbHandler } from '@m-market-app/db';
import { FoodComponentRepoSequelizePG, FoodComponentService } from '../models/FoodComponent';
import { FoodRepoSequelizePG, FoodService } from '../models/Food';
import { LocStringRepoSequelizePG } from '../models/LocString';
import { FoodTypeRepoSequelizePG, FoodTypeService } from '../models/FoodType';
import { IngredientRepoSequelizePG, IngredientService } from '../models/Ingredient';
import { logger } from '@m-market-app/utils';
import { TransactionHandlerSequelizePG } from '../utils';
import { FoodPictureRepoSequelizePG } from '../models/FoodPicture';
import { PictureRepoSequelizePG, PictureService } from '../models/Picture';
import multer from 'multer';
import fs from 'fs';


// No mocking, no unit testing for this package. Only integration tests ->
// If tests fail after dependency injection, change dependencies accordingly
// in these tests


describe('FoodComponentService implementation tests', () => {

  let foodComponentService: FoodComponentService;
  let pictureService: PictureService;
  let foodService: FoodService;
  let foodTypeService: FoodTypeService;
  let ingredientService: IngredientService;

  before(async () => {
    await dbHandler.pingDb();

    foodComponentService = new FoodComponentService(
      new FoodComponentRepoSequelizePG(),
      new FoodRepoSequelizePG(),
      new IngredientRepoSequelizePG(),
      new TransactionHandlerSequelizePG(
        dbHandler
      )
    );

    const multerStorage = multer.diskStorage({
      destination: function (req, file, cb) {
        cb(null, '../../public/multerTemp');
      },
      filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + '.png');
      }
    });

    pictureService = new PictureService(
      new PictureRepoSequelizePG(),
      new LocStringRepoSequelizePG(),
      new TransactionHandlerSequelizePG(
        dbHandler
      ),
      './test',
      './test',
      './testTemp',
      multerStorage
    ),
    new TransactionHandlerSequelizePG(
      dbHandler
    );

    foodService = new FoodService(
      new FoodRepoSequelizePG(),
      new FoodTypeRepoSequelizePG(),
      new LocStringRepoSequelizePG(),
      new FoodPictureRepoSequelizePG(),
      pictureService,
      new TransactionHandlerSequelizePG(
        dbHandler
      )
    );

    foodTypeService = new FoodTypeService(
      new FoodTypeRepoSequelizePG(),
      new LocStringRepoSequelizePG(),
      new TransactionHandlerSequelizePG(
        dbHandler
      )
    );

    ingredientService = new IngredientService(
      new IngredientRepoSequelizePG(),
      new LocStringRepoSequelizePG(),
      new TransactionHandlerSequelizePG(
        dbHandler
      )
    );
  });

  beforeEach(async () => {
    await foodComponentService.removeAll();
    await foodService.removeAll();
    await foodTypeService.removeAll();
    await ingredientService.removeAll();
  });

  after(() => {
    // Delete picture service test dirs
    fs.rmSync('./test', { recursive: true });
    fs.rmSync('./testTemp', { recursive: true });
  });

  it('should add new food component for existing food and return proper errors for missing food', async () => {

    const newFoodType = await foodTypeService.create({
      nameLoc: {
        mainStr: 'test'
      },
      descriptionLoc: {
        mainStr: 'test'
      }
    });

    const newFood = await foodService.create({
      nameLoc: {
        mainStr: 'test'
      },
      descriptionLoc: {
        mainStr: 'test'
      },
      foodTypeId: newFoodType.id,
      price: 10
    });

    const newIngredient = await ingredientService.create({
      nameLoc: {
        mainStr: 'testExpect'
      },
      stockMeasureLoc: {
        mainStr: 'test'
      }
    });

    const newIngredientForInvalidFoodComponent = await ingredientService.create({
      nameLoc: {
        mainStr: 'testExpect2'
      },
      stockMeasureLoc: {
        mainStr: 'test2'
      }
    });

    const validNewFoodComponent = await foodComponentService.create({
      foodId: newFood.id,
      componentId: newIngredient.id,
      compositeFood: false,
      quantity: 10
    });

    expect(validNewFoodComponent).to.exist;
    expect(validNewFoodComponent.component.id).to.equal(newIngredient.id);
    expect(validNewFoodComponent.component.nameLoc.mainStr).to.equal(newIngredient.nameLoc.mainStr);

    let unexistingComponentId: number = 0;
    while (
      unexistingComponentId === 0 ||
      unexistingComponentId === newIngredient.id ||
      unexistingComponentId === newIngredientForInvalidFoodComponent.id ||
      unexistingComponentId === newFood.id
    ) {
      unexistingComponentId = Math.round(Math.random() * 100000);
    }

    try {
      await foodComponentService.create({
        foodId: newFood.id,
        componentId: unexistingComponentId,
        compositeFood: true,
        quantity: 10
      });
    } catch (err) {
      if (!(err instanceof Error)) {
        logger.shout('Unexpected error', err);
        return expect(true).to.equal(false);
      }
      expect(err).to.exist;
      expect(err.name).to.equal('DatabaseError');
      expect(err.message).to.equal(`No food entry with this id ${unexistingComponentId}`); // food entry because of compositeFood === true
    }

    let unexistingFoodId: number = 0;
    while (unexistingFoodId === 0 || unexistingFoodId === newFood.id) {
      unexistingFoodId = Math.round(Math.random() * 100000);
    }

    try {
      await foodComponentService.create({
        foodId: unexistingFoodId,
        componentId: newIngredientForInvalidFoodComponent.id,
        compositeFood: false,
        quantity: 10
      });
    } catch (err) {
      if (!(err instanceof Error)) {
        logger.shout('Unexpected error', err);
        return expect(true).to.equal(false);
      }
      expect(err).to.exist;
      expect(err.name).to.equal('SequelizeForeignKeyConstraintError');
    }

    const foodComponentsInDB = await foodComponentService.getAll();
    const foundFoodComponent = foodComponentsInDB.find(foodComponent =>
      foodComponent.component.nameLoc.mainStr === newIngredientForInvalidFoodComponent.nameLoc.mainStr
    );

    expect(foundFoodComponent).to.not.exist;

  });


});