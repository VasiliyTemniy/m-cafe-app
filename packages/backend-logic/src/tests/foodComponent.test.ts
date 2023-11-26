import { expect } from 'chai';
import 'mocha';
import { dbHandler } from '@m-cafe-app/db';
import { FoodComponentRepoSequelizePG, FoodComponentService } from '../models/FoodComponent';
import { FoodRepoSequelizePG, FoodService } from '../models/Food';
import { LocStringRepoSequelizePG } from '../models/LocString';
import { FoodTypeRepoSequelizePG, FoodTypeService } from '../models/FoodType';
import { IngredientRepoSequelizePG, IngredientService } from '../models/Ingredient';
import { logger } from '@m-cafe-app/utils';


// No mocking, no unit testing for this package. Only integration tests ->
// If tests fail after dependency injection, change dependencies accordingly
// in these tests


describe('FoodComponentService implementation tests', () => {

  let foodComponentService: FoodComponentService;
  let foodService: FoodService;
  let foodTypeService: FoodTypeService;
  let ingredientService: IngredientService;
  let locStringRepo: LocStringRepoSequelizePG;

  before(async () => {
    await dbHandler.pingDb();
    locStringRepo = new LocStringRepoSequelizePG(
      dbHandler
    );
    foodComponentService = new FoodComponentService(
      new FoodComponentRepoSequelizePG(
        dbHandler
      ),
    );
    foodService = new FoodService(
      new FoodRepoSequelizePG(
        dbHandler,
        locStringRepo
      )
    );
    foodTypeService = new FoodTypeService(
      new FoodTypeRepoSequelizePG(
        dbHandler,
        locStringRepo
      )
    );
    ingredientService = new IngredientService(
      new IngredientRepoSequelizePG(
        dbHandler,
        locStringRepo
      )
    );
  });

  beforeEach(async () => {
    await foodComponentService.removeAll();
    await foodService.removeAll();
    await foodTypeService.removeAll();
    await ingredientService.removeAll();
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
      expect(err.message).to.equal(`No component entry with this id ${unexistingComponentId}`);
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