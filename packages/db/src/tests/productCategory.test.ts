import { expect } from 'chai';
import 'mocha';
import { ProductCategory, ProductType } from '../models';
import { dbHandler } from '../db';



describe('Database ProductCategory model tests', () => {

  let productType: ProductType;

  before(async () => {
    await dbHandler.pingDb();

    productType = await ProductType.create({
      // Nothing here - name and description locs are referenced from locs table
    });
  });

  beforeEach(async () => {
    await ProductCategory.destroy({ force: true, where: {} });
  });

  after(async () => {
    await ProductCategory.destroy({ force: true, where: {} });
    await ProductType.destroy({ force: true, where: {} });
  });

  it('ProductCategory creation test', async () => {

    const productCategory = await ProductCategory.create({
      productTypeId: productType.id,
      parentCategoryId: null,
      nestLevel: 0,
    });

    expect(productCategory).to.exist;

  });

  it('ProductCategory update test', async () => {
    
    const productCategory = await ProductCategory.create({
      productTypeId: productType.id,
      parentCategoryId: null,
      nestLevel: 0,
    });

    productCategory.nestLevel = 1;

    await productCategory.save();

    const updatedProductCategory = await ProductCategory.findByPk(productCategory.id);

    expect(updatedProductCategory).to.exist;
    expect(updatedProductCategory?.nestLevel).to.equal(1);

  });

  it('ProductCategory delete test', async () => {
    
    const productCategory = await ProductCategory.create({
      productTypeId: productType.id,
      parentCategoryId: null,
      nestLevel: 0,
    });

    await productCategory.destroy();

    const deletedProductCategory = await ProductCategory.findByPk(productCategory.id);

    expect(deletedProductCategory).to.not.exist;

  });

  it('ProductCategory default scope test: does not include timestamps', async () => {

    const productCategory = await ProductCategory.create({
      productTypeId: productType.id,
      parentCategoryId: null,
      nestLevel: 0,
    });

    const productCategories = await ProductCategory.findByPk(productCategory.id);

    expect(productCategories).to.exist;
    expect(productCategories?.createdAt).to.not.exist;
    expect(productCategories?.updatedAt).to.not.exist;

  });

  it('ProductCategory nested creation and associated retrieval test', async () => {

    const productCategory = await ProductCategory.create({
      productTypeId: productType.id,
      parentCategoryId: null,
      nestLevel: 0,
    });

    const nestedProductCategoryOne = await ProductCategory.create({
      productTypeId: productType.id,
      parentCategoryId: productCategory.id,
      nestLevel: 1,
    });

    const nestedProductCategoryTwo = await ProductCategory.create({
      productTypeId: productType.id,
      parentCategoryId: productCategory.id,
      nestLevel: 1,
    });
    
    const deepNestedProductCategory = await ProductCategory.create({
      productTypeId: productType.id,
      parentCategoryId: nestedProductCategoryOne.id,
      nestLevel: 2,
    });
    
    const productCategoriesInDB = await ProductCategory.findAll({
      include: [
        {
          model: ProductCategory,
          as: 'childCategories',
        },
        {
          model: ProductCategory,
          as: 'parentCategory',
        }
      ]
    });

    const foundProductCategory = productCategoriesInDB.find(productCategoryInDB => productCategoryInDB.id === productCategory.id);
    expect(foundProductCategory).to.exist;
    expect(foundProductCategory?.childCategories?.length).to.equal(2);

    const foundNestedProductCategoryOne
      = productCategoriesInDB.find(productCategoryInDB => productCategoryInDB.id === nestedProductCategoryOne.id);

    expect(foundNestedProductCategoryOne).to.exist;
    expect(foundNestedProductCategoryOne?.parentCategory?.id).to.equal(productCategory.id);
    expect(foundNestedProductCategoryOne?.childCategories?.length).to.equal(1);
    expect(foundNestedProductCategoryOne?.childCategories?.[0].id).to.equal(deepNestedProductCategory.id);

    const foundNestedProductCategoryTwo
      = productCategoriesInDB.find(productCategoryInDB => productCategoryInDB.id === nestedProductCategoryTwo.id);

    expect(foundNestedProductCategoryTwo).to.exist;
    expect(foundNestedProductCategoryTwo?.parentCategory?.id).to.equal(productCategory.id);
    expect(foundNestedProductCategoryTwo?.childCategories?.length).to.equal(0);

  });


});