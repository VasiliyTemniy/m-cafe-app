import { expect } from 'chai';
import 'mocha';
import { Product, ProductType } from '../models';
import { dbHandler } from '../db';



describe('Database Product model tests', () => {

  let productType: ProductType;

  before(async () => {
    await dbHandler.pingDb();

    productType = await ProductType.create({
      // Nothing here - name and description locs are referenced from locs table
    });
  });

  beforeEach(async () => {
    await Product.destroy({ force: true, where: {} });
  });

  after(async () => {
    await Product.destroy({ force: true, where: {} });
    await ProductType.destroy({ force: true, where: {} });
  });

  it('Product creation test', async () => {

    // Minimal data
    const product = await Product.create({
      productTypeId: productType.id,
      price: 1
    });

    expect(product).to.exist;

    // Full data
    const product2 = await Product.create({
      productTypeId: productType.id,
      price: 1,
      totalMass: 2,
      totalVolume: 3,
      boxSizingX: 4,
      boxSizingY: 5,
      boxSizingZ: 6
    });
    
    expect(product2).to.exist;

  });

  it('Product update test', async () => {

    const product = await Product.create({
      productTypeId: productType.id,
      price: 1,
      totalMass: 2,
      totalVolume: 3,
      boxSizingX: 4,
      boxSizingY: 5,
      boxSizingZ: 6
    });

    product.price = 100500;

    await product.save();

    const productInDB = await Product.findByPk(product.id);

    expect(productInDB).to.exist;
    expect(productInDB?.price).to.equal(100500);

  });

  it('Product delete test', async () => {

    const product = await Product.create({
      productTypeId: productType.id,
      price: 1,
      totalMass: 2,
      totalVolume: 3,
      boxSizingX: 4,
      boxSizingY: 5,
      boxSizingZ: 6
    });

    await product.destroy();

    const productInDB = await Product.findByPk(product.id);

    expect(productInDB).to.not.exist;
  });

  it('Product default scope test: does not include timestamps', async () => {
    
    const product = await Product.create({
      productTypeId: productType.id,
      price: 1,
      totalMass: 2,
      totalVolume: 3,
      boxSizingX: 4,
      boxSizingY: 5,
      boxSizingZ: 6
    });

    const productInDB = await Product.findByPk(product.id);

    expect(productInDB).to.exist;
    expect(productInDB?.createdAt).to.not.exist;
    expect(productInDB?.updatedAt).to.not.exist;

  });

});