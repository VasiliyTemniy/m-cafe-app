import { expect } from 'chai';
import 'mocha';
import { Address, Facility, Stock, Ingredient, Product, ProductType } from '../models';
import { dbHandler } from '../db';
import { FacilityType, StockEntityType, StockStatus } from '@m-cafe-app/shared-constants';



describe('Database Stock model tests', () => {

  let facilityAddress: Address;
  let facility: Facility;
  let ingredient: Ingredient;
  let product: Product;

  before(async () => {
    await dbHandler.pingDb();

    facilityAddress = await Address.create({
      city: 'тест',
      street: 'тест'
    });

    facility = await Facility.create({
      addressId: facilityAddress.id,
      facilityType: FacilityType.Catering
    });

    ingredient = await Ingredient.create({
      unitMass: 1,
      unitVolume: 1,
    });

    const productType = await ProductType.create({
    });

    product = await Product.create({
      price: 1,
      productTypeId: productType.id
    });

  });

  beforeEach(async () => {
    await Stock.destroy({ force: true, where: {} });
  });

  after(async () => {
    await Facility.destroy({ force: true, where: {} });
    await Product.destroy({ force: true, where: {} });
    await Address.destroy({ force: true, where: {} });
    await Stock.destroy({ force: true, where: {} });
    await Ingredient.destroy({ force: true, where: {} });
  });

  it('Stock creation test', async () => {

    const stock = await Stock.create({
      facilityId: facility.id,
      entityId: ingredient.id,
      entityType: StockEntityType.Ingredient,
      quantity: 1,
      status: StockStatus.InStock
    });

    expect(stock).to.exist;

    const productStock = await Stock.create({
      facilityId: facility.id,
      entityId: product.id,
      entityType: StockEntityType.Product,
      quantity: 1,
      status: StockStatus.InStock
    });

    expect(productStock).to.exist;

  });

  it('Stock update test', async () => {
    
    const stock = await Stock.create({
      facilityId: facility.id,
      entityId: ingredient.id,
      entityType: StockEntityType.Ingredient,
      quantity: 1,
      status: StockStatus.InStock
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
      entityId: ingredient.id,
      entityType: StockEntityType.Ingredient,
      quantity: 1,
      status: StockStatus.InStock
    });

    await stock.destroy();

    const stockInDB = await Stock.findByPk(stock.id);

    expect(stockInDB).to.not.exist;

  });

  it('Stock default scope test: does not include timestamps', async () => {
    
    const stock = await Stock.create({
      facilityId: facility.id,
      entityId: ingredient.id,
      entityType: StockEntityType.Ingredient,
      quantity: 1,
      status: StockStatus.InStock
    });

    const stockInDB = await Stock.findOne({ where: { id: stock.id } });

    expect(stockInDB?.createdAt).to.not.exist;
    expect(stockInDB?.updatedAt).to.not.exist;

  });

});