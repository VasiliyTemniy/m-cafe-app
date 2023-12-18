import { expect } from 'chai';
import 'mocha';
import { ProductType } from '../models';
import { dbHandler } from '../db';



describe('Database ProductType model tests', () => {

  before(async () => {
    await dbHandler.pingDb();
  });

  beforeEach(async () => {
    await ProductType.destroy({ force: true, where: {} });
  });

  after(async () => {
    await ProductType.destroy({ force: true, where: {} });
  });

  it('ProductType creation test', async () => {

    const productType = await ProductType.create({
      // Nothing here - name and description locs are referenced from locs table
    });

    expect(productType).to.exist;

  });

  it('ProductType delete test', async () => {

    const productType = await ProductType.create({
    });

    await productType.destroy();

    const productTypeInDB = await ProductType.findOne({ where: { id: productType.id } });

    expect(productTypeInDB).to.not.exist;

  });

  it('ProductType default scope test: does not include timestamps', async () => {
    
    const productType = await ProductType.create({
    });

    const productTypeInDB = await ProductType.findOne({ where: { id: productType.id } });

    expect(productTypeInDB?.createdAt).to.not.exist;
    expect(productTypeInDB?.updatedAt).to.not.exist;

  });

});