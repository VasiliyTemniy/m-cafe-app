import { expect } from 'chai';
import 'mocha';
import { DynamicModule } from '../models';
import { dbHandler } from '../db';
import { DynamicModulePlacementType, DynamicModuleType } from '@m-cafe-app/shared-constants';



describe('Database DynamicModule model tests', () => {

  before(async () => {
    await dbHandler.pingDb();
  });

  beforeEach(async () => {
    await DynamicModule.destroy({ force: true, where: {} });
  });

  after(async () => {
    await DynamicModule.destroy({ force: true, where: {} });
  });

  it('DynamicModule creation test', async () => {

    // Minimal data
    const dynamicModule = await DynamicModule.create({
      moduleType: DynamicModuleType.Menu,
      page: 'тест',
      placement: 1,
      placementType: DynamicModulePlacementType.BeforeMenu,
    });

    expect(dynamicModule).to.exist;

    // Full data
    const dynamicModule2 = await DynamicModule.create({
      moduleType: DynamicModuleType.Menu,
      page: 'тест',
      placement: 1,
      placementType: DynamicModulePlacementType.BeforeMenu,
      className: 'тест',
      inlineCss: 'тест',
      url: 'тест'
    });

    expect(dynamicModule2).to.exist;

  });

  it('DynamicModule update test', async () => {
    
    const dynamicModule = await DynamicModule.create({
      moduleType: DynamicModuleType.Menu,
      page: 'тест',
      placement: 1,
      placementType: DynamicModulePlacementType.BeforeMenu,
      className: 'тест',
      inlineCss: 'тест',
      url: 'тест'
    });

    dynamicModule.page = 'тест2';

    await dynamicModule.save();

    const dynamicModuleInDB = await DynamicModule.findOne({ where: { id: dynamicModule.id } });

    expect(dynamicModuleInDB?.page).to.equal('тест2');

  });

  it('DynamicModule delete test', async () => {

    const dynamicModule = await DynamicModule.create({
      moduleType: DynamicModuleType.Menu,
      page: 'тест',
      placement: 1,
      placementType: DynamicModulePlacementType.BeforeMenu,
      className: 'тест',
      inlineCss: 'тест',
      url: 'тест'
    });

    await dynamicModule.destroy();

    const dynamicModuleInDB = await DynamicModule.findByPk(dynamicModule.id);

    expect(dynamicModuleInDB).to.not.exist;

  });

  it('DynamicModule default scope test: does not include timestamps', async () => {
   
    const dynamicModule = await DynamicModule.create({
      moduleType: DynamicModuleType.Menu,
      page: 'тест',
      placement: 1,
      placementType: DynamicModulePlacementType.BeforeMenu,
      className: 'тест',
      inlineCss: 'тест',
      url: 'тест'
    });

    const dynamicModuleInDB = await DynamicModule.findOne({ where: { id: dynamicModule.id } });

    expect(dynamicModuleInDB?.createdAt).to.not.exist;
    expect(dynamicModuleInDB?.updatedAt).to.not.exist;

  });

});