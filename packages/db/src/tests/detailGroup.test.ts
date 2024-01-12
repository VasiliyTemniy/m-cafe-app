import { expect } from 'chai';
import 'mocha';
import { dbHandler } from '../db';
import { createOrgAdminManager, randomEnumValue } from './db_test_helper';
import { DetailGroupParentType } from '@m-market-app/shared-constants';



describe('Database DetailGroup model tests', () => {

  let creator: InstanceType<typeof dbHandler.models.User>;

  const pickedParentType = randomEnumValue('DetailGroupParentType');

  before(async () => {
    await dbHandler.pingDb();

    ({ creator } = await createOrgAdminManager(dbHandler));
  });

  beforeEach(async () => {
    await dbHandler.models.DetailGroup.destroy({ force: true, where: {} });
  });

  after(async () => {
    await dbHandler.models.DetailGroup.destroy({ force: true, where: {} });
    await dbHandler.models.Organization.destroy({ force: true, where: {} });
    await dbHandler.models.User.destroy({ force: true, where: {} });
  });

  it('DetailGroup creation test', async () => {

    const detailGroup = await dbHandler.models.DetailGroup.create({
      parentId: 0,
      parentType: pickedParentType,
      createdBy: creator.id,
      updatedBy: creator.id
    });

    expect(detailGroup).to.exist;

  });

  it('DetailGroup update test', async () => {
    
    const detailGroup = await dbHandler.models.DetailGroup.create({
      parentId: 0,
      parentType: pickedParentType,
      createdBy: creator.id,
      updatedBy: creator.id
    });

    detailGroup.parentType = DetailGroupParentType.Product;

    await detailGroup.save();

    const detailGroupInDB = await dbHandler.models.DetailGroup.findOne({ where: {
      id: detailGroup.id
    } });

    expect(detailGroupInDB).to.exist;
    expect(detailGroupInDB?.parentType).to.equal(DetailGroupParentType.Product);

  });

  it('DetailGroup delete test', async () => {
    
    const detailGroup = await dbHandler.models.DetailGroup.create({
      parentId: 0,
      parentType: pickedParentType,
      createdBy: creator.id,
      updatedBy: creator.id
    });

    await detailGroup.destroy();

    const detailGroupInDB = await dbHandler.models.DetailGroup.findOne({ where: {

    } });

    expect(detailGroupInDB).to.not.exist;

  });

});