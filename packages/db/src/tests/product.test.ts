import { expect } from 'chai';
import 'mocha';
import { dbHandler } from '../db';
import { createOrgAdminManager, randomEnumValue } from './db_test_helper';



describe('Database Product model tests', () => {

  let productType: InstanceType<typeof dbHandler.models.ProductType>;
  let organization: InstanceType<typeof dbHandler.models.Organization>;
  let creator: InstanceType<typeof dbHandler.models.User>;

  const pickedCurrencyCode = randomEnumValue('CurrencyCode');
  const pickedPriceCutPermission = randomEnumValue('PriceCutPermission');
  const pickedSizingMeasure = randomEnumValue('SizingMeasure');
  const pickedMassMeasure = randomEnumValue('MassMeasure');
  const pickedVolumeMeasure = randomEnumValue('VolumeMeasure');

  before(async () => {
    await dbHandler.pingDb();

    productType = await dbHandler.models.ProductType.create({
      name: 'Food',
    });

    ({ creator, organization } = await createOrgAdminManager(dbHandler));
  });

  beforeEach(async () => {
    await dbHandler.models.Product.destroy({ force: true, where: {} });
  });

  after(async () => {
    await dbHandler.models.Product.destroy({ force: true, where: {} });
    await dbHandler.models.ProductType.destroy({ force: true, where: {} });
    await dbHandler.models.Organization.destroy({ force: true, where: {} });
    await dbHandler.models.User.destroy({ force: true, where: {} });
  });

  it('Product creation test', async () => {

    // Minimal data
    const product = await dbHandler.models.Product.create({
      organizationId: organization.id,
      createdBy: creator.id,
      updatedBy: creator.id,
      productTypeId: productType.id,
      price: 100,
      currencyCode: pickedCurrencyCode,
      priceCutPermissions: pickedPriceCutPermission,
      displayPriority: 0
    });

    expect(product).to.exist;

    // Full data
    const product2 = await dbHandler.models.Product.create({
      organizationId: organization.id,
      createdBy: creator.id,
      updatedBy: creator.id,
      productTypeId: productType.id,
      price: 100,
      currencyCode: pickedCurrencyCode,
      priceCutPermissions: pickedPriceCutPermission,
      displayPriority: 0,
      isFeatured: true,
      isAvailable: true,
      isActive: true,
      showComponents: true,
      totalDownloads: 0,
      pricePrefix: 'test',
      pricePostfix: 'test',
      bonusGainRate: 0,
      maxDiscountCutAbsolute: 0,
      maxDiscountCutRelative: 0,
      maxBonusCutAbsolute: 0,
      maxBonusCutRelative: 0,
      maxEventCutAbsolute: 0,
      maxEventCutRelative: 0,
      maxTotalCutAbsolute: 0,
      maxTotalCutRelative: 0,
      totalMass: 0,
      massMeasure: pickedMassMeasure,
      totalVolume: 0,
      volumeMeasure: pickedVolumeMeasure,
      boxSizingX: 0,
      boxSizingY: 0,
      boxSizingZ: 0,
      sizingMeasure: pickedSizingMeasure
    });
    
    expect(product2).to.exist;

  });

  it('Product update test', async () => {

    const product = await dbHandler.models.Product.create({
      organizationId: organization.id,
      createdBy: creator.id,
      updatedBy: creator.id,
      productTypeId: productType.id,
      price: 100,
      currencyCode: pickedCurrencyCode,
      priceCutPermissions: pickedPriceCutPermission,
      displayPriority: 0
    });

    product.price = 100500;

    await product.save();

    const productInDB = await dbHandler.models.Product.findByPk(product.id);

    expect(productInDB).to.exist;
    expect(Number(productInDB?.price)).to.equal(100500);

  });

  it('Product delete test', async () => {

    const product = await dbHandler.models.Product.create({
      organizationId: organization.id,
      createdBy: creator.id,
      updatedBy: creator.id,
      productTypeId: productType.id,
      price: 100,
      currencyCode: pickedCurrencyCode,
      priceCutPermissions: pickedPriceCutPermission,
      displayPriority: 0
    });

    await product.destroy();

    const productInDB = await dbHandler.models.Product.findByPk(product.id);

    expect(productInDB).to.not.exist;
  });

  it('Product default scope test: does not include timestamps', async () => {
    
    const product = await dbHandler.models.Product.create({
      organizationId: organization.id,
      createdBy: creator.id,
      updatedBy: creator.id,
      productTypeId: productType.id,
      price: 100,
      currencyCode: pickedCurrencyCode,
      priceCutPermissions: pickedPriceCutPermission,
      displayPriority: 0
    });

    const productInDB = await dbHandler.models.Product.findByPk(product.id);

    expect(productInDB).to.exist;
    expect(productInDB?.createdAt).to.not.exist;
    expect(productInDB?.updatedAt).to.not.exist;

  });

});