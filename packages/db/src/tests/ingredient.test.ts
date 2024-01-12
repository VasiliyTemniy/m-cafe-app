import { expect } from 'chai';
import 'mocha';
import { dbHandler } from '../db';
import { createOrgAdminManager, randomEnumValue } from './db_test_helper';



describe('Database Ingredient model tests', () => {

  let organization: InstanceType<typeof dbHandler.models.Organization>;
  let creator: InstanceType<typeof dbHandler.models.User>;

  const pickedCurrencyCode = randomEnumValue('CurrencyCode');

  before(async () => {
    await dbHandler.pingDb();

    ({ creator, organization } = await createOrgAdminManager(dbHandler));
  });

  beforeEach(async () => {
    await dbHandler.models.Ingredient.destroy({ force: true, where: {} });
  });

  after(async () => {
    await dbHandler.models.Ingredient.destroy({ force: true, where: {} });
    await dbHandler.models.Organization.destroy({ force: true, where: {} });
    await dbHandler.models.User.destroy({ force: true, where: {} });
  });

  it('Ingredient creation test', async () => {

    // Minimal data
    const ingredient = await dbHandler.models.Ingredient.create({
      organizationId: organization.id,
      createdBy: creator.id,
      updatedBy: creator.id,
    });

    expect(ingredient).to.exist;

    // Full data
    const ingredient2 = await dbHandler.models.Ingredient.create({
      organizationId: organization.id,
      createdBy: creator.id,
      updatedBy: creator.id,
      price: 100,
      currencyCode: pickedCurrencyCode,
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
    
    const ingredient = await dbHandler.models.Ingredient.create({
      organizationId: organization.id,
      createdBy: creator.id,
      updatedBy: creator.id,
      unitMass: 1,
      unitVolume: 1,
      proteins: 1,
      fats: 1,
      carbohydrates: 1,
      calories: 1
    });

    ingredient.proteins = 2;

    await ingredient.save();

    const ingredientInDB = await dbHandler.models.Ingredient.findOne({ where: { id: ingredient.id } });

    expect(ingredientInDB?.proteins).to.equal(2);

  });

  it('Ingredient delete test', async () => {

    const ingredient = await dbHandler.models.Ingredient.create({
      organizationId: organization.id,
      createdBy: creator.id,
      updatedBy: creator.id,
      proteins: 1,
      fats: 1,
      carbohydrates: 1,
      calories: 1
    });

    await ingredient.destroy();

    const ingredientInDB = await dbHandler.models.Ingredient.findOne({ where: { id: ingredient.id } });

    expect(ingredientInDB).to.not.exist;

  });

  it('Ingredient default scope test: does not include timestamps', async () => {
    
    const ingredient = await dbHandler.models.Ingredient.create({
      organizationId: organization.id,
      createdBy: creator.id,
      updatedBy: creator.id,
      proteins: 1,
      fats: 1,
      carbohydrates: 1,
      calories: 1
    });

    const ingredientInDB = await dbHandler.models.Ingredient.findOne({ where: { id: ingredient.id } });

    expect(ingredientInDB?.createdAt).to.not.exist;
    expect(ingredientInDB?.updatedAt).to.not.exist;

  });

});