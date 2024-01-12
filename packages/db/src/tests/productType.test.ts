import { expect } from 'chai';
import 'mocha';
import { dbHandler } from '../db';



describe('Database ProductType model tests', () => {

  before(async () => {
    await dbHandler.pingDb();
  });

  beforeEach(async () => {
    await dbHandler.models.ProductType.destroy({ force: true, where: {} });
  });

  after(async () => {
    await dbHandler.models.ProductType.destroy({ force: true, where: {} });
  });

  it('ProductType creation test', async () => {

    const productType = await dbHandler.models.ProductType.create({
      name: 'Food',
    });

    expect(productType).to.exist;

  });

  it('ProductType update test', async () => {

    const productType = await dbHandler.models.ProductType.create({
      name: 'Food',
    });

    productType.name = 'Electronics';

    await productType.save();

    const productTypeInDB = await dbHandler.models.ProductType.findOne({ where: { id: productType.id } });

    expect(productTypeInDB?.name).to.equal('Electronics');

  });

  it('ProductType delete test', async () => {

    const productType = await dbHandler.models.ProductType.create({
      name: 'Food',
    });

    await productType.destroy();

    const productTypeInDB = await dbHandler.models.ProductType.findOne({ where: { id: productType.id } });

    expect(productTypeInDB).to.not.exist;

  });

  it('ProductType default scope test: does not include timestamps', async () => {
    
    const productType = await dbHandler.models.ProductType.create({
      name: 'Food',
    });

    const productTypeInDB = await dbHandler.models.ProductType.findOne({ where: { id: productType.id } });

    expect(productTypeInDB?.createdAt).to.not.exist;
    expect(productTypeInDB?.updatedAt).to.not.exist;

  });

});