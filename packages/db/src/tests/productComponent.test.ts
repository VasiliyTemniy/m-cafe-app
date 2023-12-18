import { expect } from 'chai';
import 'mocha';
import { Product, ProductType, ProductComponent, Ingredient } from '../models';
import { dbHandler } from '../db';



describe('Database ProductComponent model tests', () => {

  let productType: ProductType;
  let product: Product;
  let productAsProductComponent: Product;
  let ingredient: Ingredient;

  before(async () => {
    await dbHandler.pingDb();

    productType = await ProductType.create({
    });

    product = await Product.create({
      price: 1,
      productTypeId: productType.id
    });

    productAsProductComponent = await Product.create({
      price: 1,
      productTypeId: productType.id
    });

    ingredient = await Ingredient.create({
      proteins: 1,
      fats: 1,
      carbohydrates: 1,
      calories: 1
    });
  });

  beforeEach(async () => {
    await ProductComponent.destroy({ force: true, where: {} });
  });

  after(async () => {
    await Product.destroy({ force: true, where: {} });
    await ProductType.destroy({ force: true, where: {} });
    await Ingredient.destroy({ force: true, where: {} });
    await ProductComponent.destroy({ force: true, where: {} });
  });

  it('ProductComponent creation test', async () => {

    const productComponent = await ProductComponent.create({
      targetProductId: product.id,
      componentId: ingredient.id,
      quantity: 1,
      compositeProduct: false
    });

    expect(productComponent).to.exist;

    const productComponentWithProductAsComponent = await ProductComponent.create({
      targetProductId: product.id,
      componentId: productAsProductComponent.id,
      quantity: 1,
      compositeProduct: true
    });

    expect(productComponentWithProductAsComponent).to.exist;

  });

  it('ProductComponent update test', async () => {
    
    const productComponent = await ProductComponent.create({
      targetProductId: product.id,
      componentId: ingredient.id,
      quantity: 1,
      compositeProduct: false
    });

    productComponent.quantity = 2;
    productComponent.componentId = productAsProductComponent.id;
    productComponent.compositeProduct = true;

    await productComponent.save();

    const productComponentInDB = await ProductComponent.findOne({ where: { id: productComponent.id } });

    expect(productComponentInDB?.quantity).to.equal(2);
    expect(productComponentInDB?.compositeProduct).to.equal(true);

  });

  it('ProductComponent delete test', async () => {

    const productComponent = await ProductComponent.create({
      targetProductId: product.id,
      componentId: ingredient.id,
      quantity: 1,
      compositeProduct: false
    });

    await productComponent.destroy();

    const productComponentInDB = await ProductComponent.findOne({ where: { id: productComponent.id } });

    expect(productComponentInDB).to.not.exist;

  });

  it('ProductComponent default scope test: does not include timestamps', async () => {
    
    const productComponent = await ProductComponent.create({
      targetProductId: product.id,
      componentId: ingredient.id,
      quantity: 1,
      compositeProduct: false
    });

    const productComponentInDB = await ProductComponent.findOne({ where: { id: productComponent.id } });

    expect(productComponentInDB?.createdAt).to.not.exist;
    expect(productComponentInDB?.updatedAt).to.not.exist;

  });

});