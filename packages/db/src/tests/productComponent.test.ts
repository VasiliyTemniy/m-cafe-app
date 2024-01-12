import { expect } from 'chai';
import 'mocha';
import { dbHandler } from '../db';
import { createOrgAdminManager, randomEnumValue } from './db_test_helper';



describe('Database ProductComponent model tests', () => {

  let productType: InstanceType<typeof dbHandler.models.ProductType>;
  let organization: InstanceType<typeof dbHandler.models.Organization>;
  let creator: InstanceType<typeof dbHandler.models.User>;
  let product: InstanceType<typeof dbHandler.models.Product>;
  let productAsProductComponent: InstanceType<typeof dbHandler.models.Product>;
  let ingredient: InstanceType<typeof dbHandler.models.Ingredient>;

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

    productAsProductComponent = await dbHandler.models.Product.create({
      organizationId: organization.id,
      createdBy: creator.id,
      updatedBy: creator.id,
      productTypeId: productType.id,
      price: 100,
      currencyCode: pickedCurrencyCode,
      priceCutPermissions: pickedPriceCutPermission,
      displayPriority: 0
    });

    ingredient = await dbHandler.models.Ingredient.create({
      organizationId: organization.id,
      createdBy: creator.id,
      updatedBy: creator.id,
      proteins: 1,
      fats: 1,
      carbohydrates: 1,
      calories: 1
    });
  });

  beforeEach(async () => {
    await dbHandler.models.ProductComponent.destroy({ force: true, where: {} });
  });

  after(async () => {
    await dbHandler.models.Ingredient.destroy({ force: true, where: {} });
    await dbHandler.models.Product.destroy({ force: true, where: {} });
    await dbHandler.models.ProductType.destroy({ force: true, where: {} });
    await dbHandler.models.Organization.destroy({ force: true, where: {} });
    await dbHandler.models.User.destroy({ force: true, where: {} });
  });

  it('ProductComponent creation test', async () => {

    const productComponent = await dbHandler.models.ProductComponent.create({
      createdBy: creator.id,
      updatedBy: creator.id,
      targetProductId: product.id,
      componentId: ingredient.id,
      quantity: 1,
      compositeProduct: false
    });

    expect(productComponent).to.exist;

    const productComponentWithProductAsComponent = await dbHandler.models.ProductComponent.create({
      createdBy: creator.id,
      updatedBy: creator.id,
      targetProductId: product.id,
      componentId: productAsProductComponent.id,
      quantity: 1,
      compositeProduct: true
    });

    expect(productComponentWithProductAsComponent).to.exist;

  });

  it('ProductComponent update test', async () => {
    
    const productComponent = await dbHandler.models.ProductComponent.create({
      createdBy: creator.id,
      updatedBy: creator.id,
      targetProductId: product.id,
      componentId: ingredient.id,
      quantity: 1,
      compositeProduct: false
    });

    productComponent.quantity = 2;
    productComponent.componentId = productAsProductComponent.id;
    productComponent.compositeProduct = true;

    await productComponent.save();

    const productComponentInDB = await dbHandler.models.ProductComponent.findOne({ where: { id: productComponent.id } });

    expect(productComponentInDB?.quantity).to.equal(2);
    expect(productComponentInDB?.compositeProduct).to.equal(true);

  });

  it('ProductComponent delete test', async () => {

    const productComponent = await dbHandler.models.ProductComponent.create({
      createdBy: creator.id,
      updatedBy: creator.id,
      targetProductId: product.id,
      componentId: ingredient.id,
      quantity: 1,
      compositeProduct: false
    });

    await productComponent.destroy();

    const productComponentInDB = await dbHandler.models.ProductComponent.findOne({ where: { id: productComponent.id } });

    expect(productComponentInDB).to.not.exist;

  });

  it('ProductComponent default scope test: does not include timestamps', async () => {
    
    const productComponent = await dbHandler.models.ProductComponent.create({
      createdBy: creator.id,
      updatedBy: creator.id,
      targetProductId: product.id,
      componentId: ingredient.id,
      quantity: 1,
      compositeProduct: false
    });

    const productComponentInDB = await dbHandler.models.ProductComponent.findOne({ where: { id: productComponent.id } });

    expect(productComponentInDB?.createdAt).to.not.exist;
    expect(productComponentInDB?.updatedAt).to.not.exist;

  });

});