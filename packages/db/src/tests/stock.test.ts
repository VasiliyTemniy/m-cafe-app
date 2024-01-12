import { expect } from 'chai';
import 'mocha';
import { dbHandler } from '../db';
import { StockEntityType } from '@m-cafe-app/shared-constants';
import { createAddress, createOrgAdminManager, randomEnumValue } from './db_test_helper';



describe('Database Stock model tests', () => {

  let facilityAddress: InstanceType<typeof dbHandler.models.Address>;
  let organization: InstanceType<typeof dbHandler.models.Organization>;
  let creator: InstanceType<typeof dbHandler.models.User>;
  let facility: InstanceType<typeof dbHandler.models.Facility>;
  let ingredient: InstanceType<typeof dbHandler.models.Ingredient>;
  let product: InstanceType<typeof dbHandler.models.Product>;

  const pickedFacilityType = randomEnumValue('FacilityType');
  const pickedCurrencyCode = randomEnumValue('CurrencyCode');
  const pickedPriceCutPermission = randomEnumValue('PriceCutPermission');
  const pickedStockStatus = randomEnumValue('StockStatus');

  before(async () => {
    await dbHandler.pingDb();

    ({ address: facilityAddress } = await createAddress(dbHandler));

    ({ creator, organization } = await createOrgAdminManager(dbHandler));

    facility = await dbHandler.models.Facility.create({
      organizationId: organization.id,
      createdBy: creator.id,
      updatedBy: creator.id,
      addressId: facilityAddress.id,
      facilityType: pickedFacilityType
    });

    ingredient = await dbHandler.models.Ingredient.create({
      organizationId: organization.id,
      createdBy: creator.id,
      updatedBy: creator.id,
      currencyCode: pickedCurrencyCode,
      unitMass: 1,
      unitVolume: 1,
    });

    const productType = await dbHandler.models.ProductType.create({
      name: 'Food',
    });

    product = await dbHandler.models.Product.create({
      organizationId: organization.id,
      createdBy: creator.id,
      updatedBy: creator.id,
      productTypeId: productType.id,
      price: 100,
      currencyCode: pickedCurrencyCode,
      priceCutPermissions: pickedPriceCutPermission,
      displayPriority: 0
    });

  });

  beforeEach(async () => {
    await dbHandler.models.Stock.destroy({ force: true, where: {} });
  });

  after(async () => {
    await dbHandler.models.Stock.destroy({ force: true, where: {} });
    await dbHandler.models.Ingredient.destroy({ force: true, where: {} });
    await dbHandler.models.Product.destroy({ force: true, where: {} });
    await dbHandler.models.ProductCategory.destroy({ force: true, where: {} });
    await dbHandler.models.ProductType.destroy({ force: true, where: {} });
    await dbHandler.models.Organization.destroy({ force: true, where: {} });
    await dbHandler.models.User.destroy({ force: true, where: {} });
  });

  it('Stock creation test', async () => {

    const stock = await dbHandler.models.Stock.create({
      facilityId: facility.id,
      createdBy: creator.id,
      updatedBy: creator.id,
      entityId: ingredient.id,
      entityType: StockEntityType.Ingredient,
      quantity: 1,
      status: pickedStockStatus
    });

    expect(stock).to.exist;

    const productStock = await dbHandler.models.Stock.create({
      facilityId: facility.id,
      createdBy: creator.id,
      updatedBy: creator.id,
      entityId: product.id,
      entityType: StockEntityType.Product,
      quantity: 1,
      status: pickedStockStatus
    });

    expect(productStock).to.exist;

  });

  it('Stock update test', async () => {
    
    const stock = await dbHandler.models.Stock.create({
      facilityId: facility.id,
      createdBy: creator.id,
      updatedBy: creator.id,
      entityId: ingredient.id,
      entityType: StockEntityType.Ingredient,
      quantity: 1,
      status: pickedStockStatus
    });

    stock.quantity = 2;

    await stock.save();

    const stockInDB = await dbHandler.models.Stock.findByPk(stock.id);

    expect(stockInDB).to.exist;
    expect(stockInDB?.quantity).to.equal(2);

  });

  it('Stock delete test', async () => {

    const stock = await dbHandler.models.Stock.create({
      facilityId: facility.id,
      createdBy: creator.id,
      updatedBy: creator.id,
      entityId: ingredient.id,
      entityType: StockEntityType.Ingredient,
      quantity: 1,
      status: pickedStockStatus
    });

    await stock.destroy();

    const stockInDB = await dbHandler.models.Stock.findByPk(stock.id);

    expect(stockInDB).to.not.exist;

  });

  it('Stock default scope test: does not include timestamps', async () => {
    
    const stock = await dbHandler.models.Stock.create({
      facilityId: facility.id,
      createdBy: creator.id,
      updatedBy: creator.id,
      entityId: ingredient.id,
      entityType: StockEntityType.Ingredient,
      quantity: 1,
      status: pickedStockStatus
    });

    const stockInDB = await dbHandler.models.Stock.findOne({ where: { id: stock.id } });

    expect(stockInDB?.createdAt).to.not.exist;
    expect(stockInDB?.updatedAt).to.not.exist;

  });

});