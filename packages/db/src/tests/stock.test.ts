import { expect } from 'chai';
import 'mocha';
import { Address, Facility, LocString, Stock, Ingredient } from '../models';
import { dbHandler } from '../db';



describe('Database Stock model tests', () => {

  let facilityNameLoc: LocString;
  let facilityDescriptionLoc: LocString;
  let facilityAddress: Address;
  let facility: Facility;
  let ingredientNameLoc: LocString;
  let ingredientStockMeasureLoc: LocString;
  let ingredient: Ingredient;

  before(async () => {
    await dbHandler.pingDb();

    facilityNameLoc = await LocString.create({
      mainStr: 'тест',
      secStr: 'тест',
      altStr: 'тест'
    });

    facilityDescriptionLoc = await LocString.create({
      mainStr: 'тест',
      secStr: 'тест',
      altStr: 'тест'
    });

    facilityAddress = await Address.create({
      city: 'тест',
      street: 'тест'
    });

    facility = await Facility.create({
      nameLocId: facilityNameLoc.id,
      descriptionLocId: facilityDescriptionLoc.id,
      addressId: facilityAddress.id
    });

    ingredientNameLoc = await LocString.create({
      mainStr: 'тест',
      secStr: 'тест',
      altStr: 'тест'
    });

    ingredientStockMeasureLoc = await LocString.create({
      mainStr: 'тест',
      secStr: 'тест',
      altStr: 'тест'
    });

    ingredient = await Ingredient.create({
      nameLocId: ingredientNameLoc.id,
      stockMeasureLocId: ingredientStockMeasureLoc.id
    });
  });

  beforeEach(async () => {
    await Stock.destroy({ force: true, where: {} });
  });

  after(async () => {
    await Facility.destroy({ force: true, where: {} });
    await LocString.destroy({ force: true, where: {} });
    await Address.destroy({ force: true, where: {} });
    await Stock.destroy({ force: true, where: {} });
    await Ingredient.destroy({ force: true, where: {} });
  });

  it('Stock creation test', async () => {

    const stock = await Stock.create({
      facilityId: facility.id,
      ingredientId: ingredient.id,
      quantity: 1
    });

    expect(stock).to.exist;

  });

  it('Stock update test', async () => {
    
    const stock = await Stock.create({
      facilityId: facility.id,
      ingredientId: ingredient.id,
      quantity: 1
    });

    stock.quantity = 2;

    await stock.save();

    const stockInDB = await Stock.findByPk(stock.id);

    expect(stockInDB).to.exist;
    expect(stockInDB?.quantity).to.equal(2);

  });

  it('Stock delete test', async () => {

    const stock = await Stock.create({
      facilityId: facility.id,
      ingredientId: ingredient.id,
      quantity: 1
    });

    await stock.destroy();

    const stockInDB = await Stock.findByPk(stock.id);

    expect(stockInDB).to.not.exist;

  });

  it('Stock default scope test: does not include timestamps', async () => {
    
    const stock = await Stock.create({
      facilityId: facility.id,
      ingredientId: ingredient.id,
      quantity: 1
    });

    const stockInDB = await Stock.findOne({ where: { id: stock.id } });

    expect(stockInDB?.createdAt).to.not.exist;
    expect(stockInDB?.updatedAt).to.not.exist;

  });

});