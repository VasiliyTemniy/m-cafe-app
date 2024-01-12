import { expect } from 'chai';
import 'mocha';
import { dbHandler } from '../db';
import { randomEnumValue } from './db_test_helper';



describe('Database Coverage model tests', () => {

  const pickedParentType = randomEnumValue('CoverageParentType');
  const pickedEntityType = randomEnumValue('CoverageEntityType');

  before(async () => {
    await dbHandler.pingDb();
  });

  beforeEach(async () => {
    await dbHandler.models.Coverage.destroy({ force: true, where: {} });
  });

  after(async () => {
    await dbHandler.models.Coverage.destroy({ force: true, where: {} });
  });

  it('Coverage creation test', async () => {

    const coverage = await dbHandler.models.Coverage.create({
      parentId: 0, // not exists
      parentType: pickedParentType,
      entityType: pickedEntityType,
      entityId: 0, // not exists
    });

    expect(coverage).to.exist;

  });

  // All model fields are parts of a primary key, so update cannot happen
  // it('Coverage update test', async () => {
    
  //   const coverage = await dbHandler.models.Coverage.create({
  //     parentId: 0, // not exists
  //     parentType: pickedParentType,
  //     entityType: pickedEntityType,
  //     entityId: 0, // not exists
  //   });

  //   coverage.entityId = 1;

  //   await coverage.save();

  //   const coverageInDB = await dbHandler.models.Coverage.findOne({ where: {

  //   } });

  //   expect(coverageInDB).to.exist;
  //   expect(coverageInDB?.entityId).to.equal(1);

  // });

  it('Coverage delete test', async () => {
    
    const coverage = await dbHandler.models.Coverage.create({
      parentId: 0, // not exists
      parentType: pickedParentType,
      entityType: pickedEntityType,
      entityId: 0, // not exists
    });

    await coverage.destroy();

    const coverageInDB = await dbHandler.models.Coverage.findOne({ where: {
      parentId: 0,
      parentType: pickedParentType,
      entityType: pickedEntityType,
      entityId: 0,
    } });

    expect(coverageInDB).to.not.exist;

  });

});