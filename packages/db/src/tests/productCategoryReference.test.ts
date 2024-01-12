import { expect } from 'chai';
import 'mocha';
import { dbHandler } from '../db';
import { createOrgAdminManager, randomEnumValue } from './db_test_helper';



describe('Database ProductCategoryReference model tests', () => {

  let productType: InstanceType<typeof dbHandler.models.ProductType>;
  let organization: InstanceType<typeof dbHandler.models.Organization>;
  let creator: InstanceType<typeof dbHandler.models.User>;
  let product: InstanceType<typeof dbHandler.models.Product>;
  let productCategory: InstanceType<typeof dbHandler.models.ProductCategory>;

  const pickedCurrencyCode = randomEnumValue('CurrencyCode');
  const pickedPriceCutPermission = randomEnumValue('PriceCutPermission');

  before(async () => {
    await dbHandler.pingDb();

    productType = await dbHandler.models.ProductType.create({
      name: 'Food',
    });
    
    ({ creator, organization } = await createOrgAdminManager(dbHandler));

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

    productCategory = await dbHandler.models.ProductCategory.create({
      name: 'burgers',
      productTypeId: productType.id,
      parentCategoryId: null,
      nestLevel: 0,
    });
  });

  beforeEach(async () => {
    await dbHandler.models.ProductCategoryReference.destroy({ force: true, where: {} });
  });

  after(async () => {
    await dbHandler.models.Product.destroy({ force: true, where: {} });
    await dbHandler.models.ProductCategory.destroy({ force: true, where: {} });
    await dbHandler.models.ProductType.destroy({ force: true, where: {} });
    await dbHandler.models.Organization.destroy({ force: true, where: {} });
    await dbHandler.models.User.destroy({ force: true, where: {} });
  });

  it('ProductCategoryReference creation test', async () => {

    const productCategoryReference = await dbHandler.models.ProductCategoryReference.create({
      productId: product.id,
      productCategoryId: productCategory.id
    });

    expect(productCategoryReference).to.exist;

  });

  it('ProductCategoryReference delete test', async () => {

    const productCategoryReference = await dbHandler.models.ProductCategoryReference.create({
      productId: product.id,
      productCategoryId: productCategory.id
    });

    await productCategoryReference.destroy();

    const deletedProductCategoryReference = await dbHandler.models.ProductCategoryReference.findOne({ where: {
      productId: product.id,
      productCategoryId: productCategory.id
    } });

    expect(deletedProductCategoryReference).to.not.exist;
  });

});