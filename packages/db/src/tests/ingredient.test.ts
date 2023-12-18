import { expect } from 'chai';
import 'mocha';
import { Ingredient } from '../models';
import { dbHandler } from '../db';



describe('Database Ingredient model tests', () => {

  before(async () => {
    await dbHandler.pingDb();
  });

  beforeEach(async () => {
    await Ingredient.destroy({ force: true, where: {} });
  });

  after(async () => {
    await Ingredient.destroy({ force: true, where: {} });
  });

  it('Ingredient creation test', async () => {

    // Minimal data
    const ingredient = await Ingredient.create({
    });

    expect(ingredient).to.exist;

    // Full data
    const ingredient2 = await Ingredient.create({
      unitMass: 1,
      unitVolume: 1,
      proteins: 1,
      fats: 1,
      carbohydrates: 1,
      calories: 1
    });

    expect(ingredient2).to.exist;

  });

  it('Ingredient update test', async () => {
    
    const ingredient = await Ingredient.create({
      unitMass: 1,
      unitVolume: 1,
      proteins: 1,
      fats: 1,
      carbohydrates: 1,
      calories: 1
    });

    ingredient.proteins = 2;

    await ingredient.save();

    const ingredientInDB = await Ingredient.findOne({ where: { id: ingredient.id } });

    expect(ingredientInDB?.proteins).to.equal(2);

  });

  it('Ingredient delete test', async () => {

    const ingredient = await Ingredient.create({
      proteins: 1,
      fats: 1,
      carbohydrates: 1,
      calories: 1
    });

    await ingredient.destroy();

    const ingredientInDB = await Ingredient.findOne({ where: { id: ingredient.id } });

    expect(ingredientInDB).to.not.exist;

  });

  it('Ingredient default scope test: does not include timestamps', async () => {
    
    const ingredient = await Ingredient.create({
      proteins: 1,
      fats: 1,
      carbohydrates: 1,
      calories: 1
    });

    const ingredientInDB = await Ingredient.findOne({ where: { id: ingredient.id } });

    expect(ingredientInDB?.createdAt).to.not.exist;
    expect(ingredientInDB?.updatedAt).to.not.exist;

  });

});