import { expect } from 'chai';
import 'mocha';
import { dbHandler } from '../db';
import { randomEnumValue } from './db_test_helper';



describe('Database View model tests', () => {

  const pickedParentType = randomEnumValue('ViewParentType');

  before(async () => {
    await dbHandler.pingDb();
  });

  beforeEach(async () => {
    await dbHandler.models.View.destroy({ force: true, where: {} });
  });

  after(async () => {
    await dbHandler.models.View.destroy({ force: true, where: {} });
  });

  it('View creation test', async () => {

    const view = await dbHandler.models.View.create({
      userIp: '127.0.0.1',
      parentId: 1,
      parentType: pickedParentType,
      count: 1
    });

    expect(view).to.exist;

  });

  it('View update test', async () => {
    
    const view = await dbHandler.models.View.create({
      userIp: '127.0.0.1',
      parentId: 1,
      parentType: pickedParentType,
      count: 1
    });

    view.count = 2;

    await view.save();

    const viewInDB = await dbHandler.models.View.findOne({ where: {
      userIp: '127.0.0.1',
      parentId: 1,
      parentType: pickedParentType
    } });

    expect(viewInDB).to.exist;
    expect(viewInDB?.count).to.equal(2);

  });

  it('View delete test', async () => {
    
    const view = await dbHandler.models.View.create({
      userIp: '127.0.0.1',
      parentId: 1,
      parentType: pickedParentType,
      count: 1
    });

    await view.destroy();

    const viewInDB = await dbHandler.models.View.findOne({ where: {
      userIp: '127.0.0.1',
      parentId: 1,
      parentType: pickedParentType
    } });

    expect(viewInDB).to.not.exist;

  });

});