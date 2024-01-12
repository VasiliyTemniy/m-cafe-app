import { expect } from 'chai';
import 'mocha';
import { dbHandler } from '../db';
import { QueryTypes } from 'sequelize';



describe('Database ProductCategory model tests', () => {

  let productType: InstanceType<typeof dbHandler.models.ProductType>;

  before(async () => {
    await dbHandler.pingDb();

    productType = await dbHandler.models.ProductType.create({
      name: 'Food',
    });
  });

  beforeEach(async () => {
    await dbHandler.models.ProductCategory.destroy({ force: true, where: {} });
  });

  after(async () => {
    await dbHandler.models.ProductCategory.destroy({ force: true, where: {} });
    await dbHandler.models.ProductType.destroy({ force: true, where: {} });
  });

  it('ProductCategory creation test', async () => {

    const productCategory = await dbHandler.models.ProductCategory.create({
      name: 'burgers',
      productTypeId: productType.id,
      parentCategoryId: null,
      nestLevel: 0,
    });

    expect(productCategory).to.exist;

  });

  it('ProductCategory update test', async () => {
    
    const productCategory = await dbHandler.models.ProductCategory.create({
      name: 'burgers',
      productTypeId: productType.id,
      parentCategoryId: null,
      nestLevel: 0,
    });

    productCategory.nestLevel = 1;

    await productCategory.save();

    const updatedProductCategory = await dbHandler.models.ProductCategory.findByPk(productCategory.id);

    expect(updatedProductCategory).to.exist;
    expect(updatedProductCategory?.nestLevel).to.equal(1);

  });

  it('ProductCategory delete test', async () => {
    
    const productCategory = await dbHandler.models.ProductCategory.create({
      name: 'burgers',
      productTypeId: productType.id,
      parentCategoryId: null,
      nestLevel: 0,
    });

    await productCategory.destroy();

    const deletedProductCategory = await dbHandler.models.ProductCategory.findByPk(productCategory.id);

    expect(deletedProductCategory).to.not.exist;

  });

  it('ProductCategory default scope test: does not include timestamps', async () => {

    const productCategory = await dbHandler.models.ProductCategory.create({
      name: 'burgers',
      productTypeId: productType.id,
      parentCategoryId: null,
      nestLevel: 0,
    });

    const productCategories = await dbHandler.models.ProductCategory.findByPk(productCategory.id);

    expect(productCategories).to.exist;
    expect(productCategories?.createdAt).to.not.exist;
    expect(productCategories?.updatedAt).to.not.exist;

  });

  it('ProductCategory nested creation and associated retrieval test', async () => {

    const productCategory = await dbHandler.models.ProductCategory.create({
      name: 'fastfood',
      productTypeId: productType.id,
      parentCategoryId: null,
      nestLevel: 0,
    });

    const nestedProductCategoryOne = await dbHandler.models.ProductCategory.create({
      name: 'burgers',
      productTypeId: productType.id,
      parentCategoryId: productCategory.id,
      nestLevel: 1,
    });

    const nestedProductCategoryTwo = await dbHandler.models.ProductCategory.create({
      name: 'sandwiches',
      productTypeId: productType.id,
      parentCategoryId: productCategory.id,
      nestLevel: 1,
    });
    
    const deepNestedProductCategory = await dbHandler.models.ProductCategory.create({
      name: 'triple',
      productTypeId: productType.id,
      parentCategoryId: nestedProductCategoryOne.id,
      nestLevel: 2,
    });

    const anotherNotConnectedCategory = await dbHandler.models.ProductCategory.create({
      name: 'furniture',
      productTypeId: productType.id,
      parentCategoryId: null,
      nestLevel: 0,
    });
    
    const productCategoriesInDB = await dbHandler.models.ProductCategory.findAll({
      include: [
        {
          model: dbHandler.models.ProductCategory,
          as: 'childCategories',
        },
        {
          model: dbHandler.models.ProductCategory,
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

    // Recursive query test

    const productCategoryTree = await dbHandler.dbInstance?.query(`
      WITH RECURSIVE recursive_categories AS (
        SELECT
          id,
          name,
          parent_category_id,
          nest_level
        FROM product_categories
        WHERE id = ${productCategory.id}

        UNION ALL

        SELECT
          product_categories.id,
          product_categories.name,
          product_categories.parent_category_id,
          product_categories.nest_level
        FROM product_categories
          JOIN recursive_categories
            ON recursive_categories.id = product_categories.parent_category_id
      )
      SELECT * FROM recursive_categories
      ORDER BY
        nest_level ASC;
    `, {
      type: QueryTypes.SELECT,
    }) as InstanceType<typeof dbHandler.models.ProductCategory>[];

    expect(productCategoryTree?.length).to.equal(4);

    const selectedIds = productCategoryTree?.map(productCategory => productCategory.id);

    expect(selectedIds.includes(productCategory.id)).to.be.true;
    expect(selectedIds.includes(nestedProductCategoryOne.id)).to.be.true;
    expect(selectedIds.includes(nestedProductCategoryTwo.id)).to.be.true;
    expect(selectedIds.includes(deepNestedProductCategory.id)).to.be.true;
    expect(selectedIds.includes(anotherNotConnectedCategory.id)).to.be.false;


    const partialProductCategoryTree = await dbHandler.dbInstance?.query(`
      WITH RECURSIVE recursive_categories AS (
        SELECT
          id,
          name,
          parent_category_id,
          nest_level
        FROM product_categories
        WHERE id = ${nestedProductCategoryOne.id}

        UNION ALL

        SELECT
          product_categories.id,
          product_categories.name,
          product_categories.parent_category_id,
          product_categories.nest_level
        FROM product_categories
          JOIN recursive_categories
            ON recursive_categories.id = product_categories.parent_category_id
      )
      SELECT * FROM recursive_categories
      ORDER BY
        nest_level ASC;
    `, {
      type: QueryTypes.SELECT
    }) as InstanceType<typeof dbHandler.models.ProductCategory>[];

    expect(partialProductCategoryTree?.length).to.equal(2);

    const selectedPartialIds = partialProductCategoryTree?.map(productCategory => productCategory.id);

    expect(selectedPartialIds.includes(productCategory.id)).to.be.false;
    expect(selectedPartialIds.includes(nestedProductCategoryOne.id)).to.be.true;
    expect(selectedPartialIds.includes(nestedProductCategoryTwo.id)).to.be.false;
    expect(selectedPartialIds.includes(deepNestedProductCategory.id)).to.be.true;
    expect(selectedPartialIds.includes(anotherNotConnectedCategory.id)).to.be.false;

  });

});