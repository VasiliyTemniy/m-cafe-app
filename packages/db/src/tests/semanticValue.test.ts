import { expect } from 'chai';
import 'mocha';
import { dbHandler } from '../db';
import { UserRights } from '@m-market-app/shared-constants';



describe('Database SemanticValue model tests', () => {

  let appAdmin: InstanceType<typeof dbHandler.models.User>;
  let semantics: InstanceType<typeof dbHandler.models.Semantics>;

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

    semantics = await dbHandler.models.Semantics.create({
      approvedBy: appAdmin.id,
      technicalName: 'test'
    });
  });

  beforeEach(async () => {
    await dbHandler.models.SemanticValue.destroy({ force: true, where: {} });
  });

  after(async () => {
    await dbHandler.models.SemanticValue.destroy({ force: true, where: {} });
    await dbHandler.models.Semantics.destroy({ force: true, where: {} });
    await dbHandler.models.User.destroy({ force: true, where: {} });
  });

  it('SemanticValue creation test', async () => {

    const semanticValue = await dbHandler.models.SemanticValue.create({
      semanticId: semantics.id,
      approvedBy: appAdmin.id,
      technicalValue: 'test'
    });

    expect(semanticValue).to.exist;

  });

  it('SemanticValue update test', async () => {
    
    const semanticValue = await dbHandler.models.SemanticValue.create({
      semanticId: semantics.id,
      approvedBy: appAdmin.id,
      technicalValue: 'test'
    });

    semanticValue.technicalValue = 'test2';

    await semanticValue.save();

    const semanticValueInDB = await dbHandler.models.SemanticValue.findOne({ where: {
      id: semanticValue.id
    } });

    expect(semanticValueInDB).to.exist;
    expect(semanticValueInDB?.technicalValue).to.equal('test2');

  });

  it('SemanticValue delete test', async () => {
    
    const semanticValue = await dbHandler.models.SemanticValue.create({
      semanticId: semantics.id,
      approvedBy: appAdmin.id,
      technicalValue: 'test'
    });

    await semanticValue.destroy();

    const semanticValueInDB = await dbHandler.models.SemanticValue.findOne({ where: {
      id: semanticValue.id
    } });

    expect(semanticValueInDB).to.not.exist;

  });

});