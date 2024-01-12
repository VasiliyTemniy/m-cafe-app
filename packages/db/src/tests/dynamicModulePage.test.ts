import { expect } from 'chai';
import 'mocha';
import { dbHandler } from '../db';
import { createOrgAdminManager, randomEnumValue } from './db_test_helper';
import { DynamicModulePlacementType, DynamicModuleType } from '@m-market-app/shared-constants';



describe('Database DynamicModulePage model tests', () => {

  let dynamicModule: InstanceType<typeof dbHandler.models.DynamicModule>;
  let organization: InstanceType<typeof dbHandler.models.Organization>;
  let creator: InstanceType<typeof dbHandler.models.User>;

  const pickedPageType = randomEnumValue('DynamicModulePageType');

  before(async () => {
    await dbHandler.pingDb();

    ({ creator, organization } = await createOrgAdminManager(dbHandler));

    dynamicModule = await dbHandler.models.DynamicModule.create({
      organizationId: organization.id,
      createdBy: creator.id,
      updatedBy: creator.id,
      moduleType: DynamicModuleType.Text,
      placement: 1,
      placementType: DynamicModulePlacementType.Absolute,
      nestLevel: 0
    });
  });

  beforeEach(async () => {
    await dbHandler.models.DynamicModulePage.destroy({ force: true, where: {} });
  });

  after(async () => {
    await dbHandler.models.DynamicModulePage.destroy({ force: true, where: {} });
    await dbHandler.models.DynamicModule.destroy({ force: true, where: {} });
    await dbHandler.models.Organization.destroy({ force: true, where: {} });
    await dbHandler.models.User.destroy({ force: true, where: {} });
  });

  it('DynamicModulePage creation test', async () => {

    const dynamicModulePage = await dbHandler.models.DynamicModulePage.create({
      dynamicModuleId: dynamicModule.id,
      pageType: pickedPageType
    });

    expect(dynamicModulePage).to.exist;

  });

  // Part of a primary key should not be updated. To update, delete and create new.
  // it('DynamicModulePage update test', async () => {
    
  //   const dynamicModulePage = await dbHandler.models.DynamicModulePage.create({
  //     dynamicModuleId: dynamicModule.id,
  //     pageType: pickedPageType
  //   });

  //   dynamicModulePage.pageType = DynamicModulePageType.About;

  //   await dynamicModulePage.save();

  //   const dynamicModulePageInDB = await dbHandler.models.DynamicModulePage.findAll({ where: {
  //     dynamicModuleId: dynamicModule.id
  //   } });

  //   expect(dynamicModulePageInDB[0]).to.exist;
  //   expect(dynamicModulePageInDB.length).to.equal(1);
  //   expect(dynamicModulePageInDB[0]?.pageType).to.equal(DynamicModulePageType.About);

  // });

  it('DynamicModulePage delete test', async () => {
    
    const dynamicModulePage = await dbHandler.models.DynamicModulePage.create({
      dynamicModuleId: dynamicModule.id,
      pageType: pickedPageType
    });

    await dynamicModulePage.destroy();

    const dynamicModulePageInDB = await dbHandler.models.DynamicModulePage.findOne({ where: {
      dynamicModuleId: dynamicModule.id,
      pageType: pickedPageType
    } });

    expect(dynamicModulePageInDB).to.not.exist;

  });

});