import { expect } from 'chai';
import 'mocha';
import { dbHandler } from '../db';
import { UserRights } from '@m-cafe-app/shared-constants';



describe('Database Semantics model tests', () => {

  let appAdmin: InstanceType<typeof dbHandler.models.User>;

  before(async () => {
    await dbHandler.pingDb();

    appAdmin = await dbHandler.models.User.create({
      username: 'testAppAdmin',
      phonenumber: '12312312329',
      email: 'test@testAppAdmin.com',
      birthdate: new Date(),
      rights: UserRights.AppAdmin,
      lookupHash: 'testlonger2',
      lookupNoise: 3
    });
  });

  beforeEach(async () => {
    await dbHandler.models.Semantics.destroy({ force: true, where: {} });
  });

  after(async () => {
    await dbHandler.models.Semantics.destroy({ force: true, where: {} });
    await dbHandler.models.User.destroy({ force: true, where: {} });
  });

  it('Semantics creation test', async () => {

    const semantics = await dbHandler.models.Semantics.create({
      approvedBy: appAdmin.id,
      technicalName: 'test'
    });

    expect(semantics).to.exist;

  });

  it('Semantics update test', async () => {
    
    const semantics = await dbHandler.models.Semantics.create({
      approvedBy: appAdmin.id,
      technicalName: 'test'
    });

    semantics.technicalName = 'test2';

    await semantics.save();

    const semanticsInDB = await dbHandler.models.Semantics.findOne({ where: {
      id: semantics.id
    } });

    expect(semanticsInDB).to.exist;
    expect(semanticsInDB?.technicalName).to.equal('test2');

  });

  it('Semantics delete test', async () => {
    
    const semantics = await dbHandler.models.Semantics.create({
      approvedBy: appAdmin.id,
      technicalName: 'test'
    });

    await semantics.destroy();

    const semanticsInDB = await dbHandler.models.Semantics.findOne({ where: {
      id: semantics.id
    } });

    expect(semanticsInDB).to.not.exist;

  });

});