import { expect } from 'chai';
import 'mocha';
import { dbHandler } from '../db';
import { DynamicModulePlacementType, DynamicModuleType } from '@m-cafe-app/shared-constants';
import { createOrgAdminManager, randomEnumValue } from './db_test_helper';
import { QueryTypes } from 'sequelize';



describe('Database DynamicModule model tests', () => {

  let organization: InstanceType<typeof dbHandler.models.Organization>;
  let creator: InstanceType<typeof dbHandler.models.User>;

  const pickedDMType = randomEnumValue('DynamicModuleType');
  const pickedDMPlacementType = randomEnumValue('DynamicModulePlacementType');
  const pickedDMPreset = randomEnumValue('DynamicModulePreset');

  before(async () => {
    await dbHandler.pingDb();

    ({ creator, organization } = await createOrgAdminManager(dbHandler));
  });

  beforeEach(async () => {
    await dbHandler.models.DynamicModule.destroy({ force: true, where: {} });
  });

  after(async () => {
    await dbHandler.models.DynamicModule.destroy({ force: true, where: {} });
    await dbHandler.models.Organization.destroy({ force: true, where: {} });
    await dbHandler.models.User.destroy({ force: true, where: {} });
  });

  it('DynamicModule creation test', async () => {

    // Minimal data
    const dynamicModule = await dbHandler.models.DynamicModule.create({
      createdBy: creator.id,
      updatedBy: creator.id,
      moduleType: pickedDMType,
      placement: 1,
      placementType: pickedDMPlacementType,
      nestLevel: 0
    });

    expect(dynamicModule).to.exist;

    // Full data
    const dynamicModule2 = await dbHandler.models.DynamicModule.create({
      organizationId: organization.id,
      createdBy: creator.id,
      updatedBy: creator.id,
      moduleType: pickedDMType,
      placement: 1,
      placementType: pickedDMPlacementType,
      nestLevel: 0,
      preset: pickedDMPreset,
      className: 'тест',
      inlineCss: 'тест',
      url: 'тест',
      parentDynamicModuleId: null
    });

    expect(dynamicModule2).to.exist;

  });

  it('DynamicModule update test', async () => {
    
    const dynamicModule = await dbHandler.models.DynamicModule.create({
      organizationId: organization.id,
      createdBy: creator.id,
      updatedBy: creator.id,
      moduleType: pickedDMType,
      placement: 1,
      placementType: pickedDMPlacementType,
      nestLevel: 0,
      preset: pickedDMPreset,
      className: 'тест',
      inlineCss: 'тест',
      url: 'тест',
      parentDynamicModuleId: null
    });

    dynamicModule.moduleType = DynamicModuleType.Picture;

    await dynamicModule.save();

    const dynamicModuleInDB = await dbHandler.models.DynamicModule.findOne({ where: { id: dynamicModule.id } });

    expect(dynamicModuleInDB?.moduleType).to.equal(DynamicModuleType.Picture);

  });

  it('DynamicModule delete test', async () => {

    const dynamicModule = await dbHandler.models.DynamicModule.create({
      organizationId: organization.id,
      createdBy: creator.id,
      updatedBy: creator.id,
      moduleType: DynamicModuleType.Text,
      placement: 1,
      placementType: DynamicModulePlacementType.BeforeMenu,
      nestLevel: 0,
      className: 'тест',
      inlineCss: 'тест',
      url: 'тест'
    });

    await dynamicModule.destroy();

    const dynamicModuleInDB = await dbHandler.models.DynamicModule.findByPk(dynamicModule.id);

    expect(dynamicModuleInDB).to.not.exist;

  });

  it('DynamicModule default scope test: does not include timestamps', async () => {
   
    const dynamicModule = await dbHandler.models.DynamicModule.create({
      organizationId: organization.id,
      createdBy: creator.id,
      updatedBy: creator.id,
      moduleType: DynamicModuleType.Text,
      placement: 1,
      placementType: DynamicModulePlacementType.BeforeMenu,
      nestLevel: 0,
      className: 'тест',
      inlineCss: 'тест',
      url: 'тест'
    });

    const dynamicModuleInDB = await dbHandler.models.DynamicModule.findOne({ where: { id: dynamicModule.id } });

    expect(dynamicModuleInDB?.createdAt).to.not.exist;
    expect(dynamicModuleInDB?.updatedAt).to.not.exist;

  });

  it('DynamicModule nested creation and associated retrieval test', async () => {

    const dynamicModule = await dbHandler.models.DynamicModule.create({
      organizationId: organization.id,
      createdBy: creator.id,
      updatedBy: creator.id,
      moduleType: DynamicModuleType.Page,
      placement: 1,
      placementType: DynamicModulePlacementType.Absolute,
      nestLevel: 0,
      className: 'тест',
      inlineCss: 'тест',
      url: 'тест',
      parentDynamicModuleId: null
    });

    const nestedDynamicModuleOne = await dbHandler.models.DynamicModule.create({
      organizationId: organization.id,
      createdBy: creator.id,
      updatedBy: creator.id,
      moduleType: DynamicModuleType.Menu,
      placement: 1,
      placementType: DynamicModulePlacementType.StickyTop,
      nestLevel: 1,
      className: 'тест',
      inlineCss: 'тест',
      url: 'тест',
      parentDynamicModuleId: dynamicModule.id
    });

    const nestedDynamicModuleTwo = await dbHandler.models.DynamicModule.create({
      organizationId: organization.id,
      createdBy: creator.id,
      updatedBy: creator.id,
      moduleType: DynamicModuleType.Footer,
      placement: 1,
      placementType: DynamicModulePlacementType.StickyBottom,
      nestLevel: 1,
      className: 'тест',
      inlineCss: 'тест',
      url: 'тест',
      parentDynamicModuleId: dynamicModule.id
    });
    
    const deepNestedDynamicModule = await dbHandler.models.DynamicModule.create({
      organizationId: organization.id,
      createdBy: creator.id,
      updatedBy: creator.id,
      moduleType: DynamicModuleType.Text,
      placement: 1,
      placementType: DynamicModulePlacementType.Top,
      nestLevel: 2,
      className: 'тест',
      inlineCss: 'тест',
      url: 'тест',
      parentDynamicModuleId: nestedDynamicModuleOne.id
    });

    const anotherNotConnectedDynamicModule = await dbHandler.models.DynamicModule.create({
      organizationId: organization.id,
      createdBy: creator.id,
      updatedBy: creator.id,
      moduleType: DynamicModuleType.Text,
      placement: 1,
      placementType: DynamicModulePlacementType.Top,
      nestLevel: 0,
      className: 'тест',
      inlineCss: 'тест',
      url: 'тест',
      parentDynamicModuleId: null
    });
    
    const dynamicModulesInDB = await dbHandler.models.DynamicModule.findAll({
      include: [
        {
          model: dbHandler.models.DynamicModule,
          as: 'childDynamicModules',
        },
        {
          model: dbHandler.models.DynamicModule,
          as: 'parentDynamicModule',
        }
      ]
    });

    const foundDynamicModule = dynamicModulesInDB.find(dynamicModuleInDB => dynamicModuleInDB.id === dynamicModule.id);
    expect(foundDynamicModule).to.exist;
    expect(foundDynamicModule?.childDynamicModules?.length).to.equal(2);

    const foundNestedDynamicModuleOne
      = dynamicModulesInDB.find(dynamicModuleInDB => dynamicModuleInDB.id === nestedDynamicModuleOne.id);

    expect(foundNestedDynamicModuleOne).to.exist;
    expect(foundNestedDynamicModuleOne?.parentDynamicModule?.id).to.equal(dynamicModule.id);
    expect(foundNestedDynamicModuleOne?.childDynamicModules?.length).to.equal(1);
    expect(foundNestedDynamicModuleOne?.childDynamicModules?.[0].id).to.equal(deepNestedDynamicModule.id);

    const foundNestedDynamicModuleTwo
      = dynamicModulesInDB.find(dynamicModuleInDB => dynamicModuleInDB.id === nestedDynamicModuleTwo.id);

    expect(foundNestedDynamicModuleTwo).to.exist;
    expect(foundNestedDynamicModuleTwo?.parentDynamicModule?.id).to.equal(dynamicModule.id);
    expect(foundNestedDynamicModuleTwo?.childDynamicModules?.length).to.equal(0);

    
    // Recursive query test

    const dynamicModuleTree = await dbHandler.dbInstance?.query(`
      WITH RECURSIVE recursive_dynamic_modules AS (
        SELECT
          id,
          organization_id,
          created_by,
          updated_by,
          module_type,
          placement,
          placement_type,
          nest_level,
          class_name,
          inline_css,
          url,
          preset,
          parent_dynamic_module_id
        FROM dynamic_modules
        WHERE id = ${dynamicModule.id}

        UNION ALL

        SELECT
          dynamic_modules.id,
          dynamic_modules.organization_id,
          dynamic_modules.created_by,
          dynamic_modules.updated_by,
          dynamic_modules.module_type,
          dynamic_modules.placement,
          dynamic_modules.placement_type,
          dynamic_modules.nest_level,
          dynamic_modules.class_name,
          dynamic_modules.inline_css,
          dynamic_modules.url,
          dynamic_modules.preset,
          dynamic_modules.parent_dynamic_module_id
        FROM dynamic_modules
          JOIN recursive_dynamic_modules
            ON recursive_dynamic_modules.id = dynamic_modules.parent_dynamic_module_id
      )
      SELECT * FROM recursive_dynamic_modules
      ORDER BY
        nest_level ASC,
        placement ASC;
    `, {
      type: QueryTypes.SELECT,
    }) as InstanceType<typeof dbHandler.models.DynamicModule>[];

    expect(dynamicModuleTree?.length).to.equal(4);

    const selectedIds = dynamicModuleTree?.map(dynamicModule => dynamicModule.id);

    expect(selectedIds.includes(dynamicModule.id)).to.be.true;
    expect(selectedIds.includes(nestedDynamicModuleOne.id)).to.be.true;
    expect(selectedIds.includes(nestedDynamicModuleTwo.id)).to.be.true;
    expect(selectedIds.includes(deepNestedDynamicModule.id)).to.be.true;
    expect(selectedIds.includes(anotherNotConnectedDynamicModule.id)).to.be.false;


    const partialDynamicModuleTree = await dbHandler.dbInstance?.query(`
      WITH RECURSIVE recursive_dynamic_modules AS (
        SELECT
          id,
          organization_id,
          created_by,
          updated_by,
          module_type,
          placement,
          placement_type,
          nest_level,
          class_name,
          inline_css,
          url,
          preset,
          parent_dynamic_module_id
        FROM dynamic_modules
        WHERE id = ${nestedDynamicModuleOne.id}

        UNION ALL

        SELECT
          dynamic_modules.id,
          dynamic_modules.organization_id,
          dynamic_modules.created_by,
          dynamic_modules.updated_by,
          dynamic_modules.module_type,
          dynamic_modules.placement,
          dynamic_modules.placement_type,
          dynamic_modules.nest_level,
          dynamic_modules.class_name,
          dynamic_modules.inline_css,
          dynamic_modules.url,
          dynamic_modules.preset,
          dynamic_modules.parent_dynamic_module_id
        FROM dynamic_modules
          JOIN recursive_dynamic_modules
            ON recursive_dynamic_modules.id = dynamic_modules.parent_dynamic_module_id
      )
      SELECT * FROM recursive_dynamic_modules
      ORDER BY
        nest_level ASC,
        placement ASC;
    `, {
      type: QueryTypes.SELECT
    }) as InstanceType<typeof dbHandler.models.DynamicModule>[];

    expect(partialDynamicModuleTree?.length).to.equal(2);

    const selectedPartialIds = partialDynamicModuleTree?.map(dynamicModule => dynamicModule.id);

    expect(selectedPartialIds.includes(dynamicModule.id)).to.be.false;
    expect(selectedPartialIds.includes(nestedDynamicModuleOne.id)).to.be.true;
    expect(selectedPartialIds.includes(nestedDynamicModuleTwo.id)).to.be.false;
    expect(selectedPartialIds.includes(deepNestedDynamicModule.id)).to.be.true;
    expect(selectedPartialIds.includes(anotherNotConnectedDynamicModule.id)).to.be.false;

  });

});