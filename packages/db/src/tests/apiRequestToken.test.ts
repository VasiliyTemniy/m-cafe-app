import { expect } from 'chai';
import 'mocha';
import { dbHandler } from '../db';
import { createOrgAdminManager, randomEnumValue } from './db_test_helper';



describe('Database ApiRequestToken model tests', () => {

  let organization: InstanceType<typeof dbHandler.models.Organization>;
  let creator: InstanceType<typeof dbHandler.models.User>;
  let apiRequest: InstanceType<typeof dbHandler.models.ApiRequest>;

  const pickedReason = randomEnumValue('ApiRequestReason');
  const pickedMethod = randomEnumValue('ApiRequestMethod');
  const pickedExpectedResponseDataPlacementKey = randomEnumValue('ApiRequestExpectedResponseDataPlacementKey');
  const pickedExpectedResponseDataType = randomEnumValue('ApiRequestExpectedResponseDataType');
  const pickedTokenPlacement = randomEnumValue('ApiRequestTokenPlacement');
  
  before(async () => {
    await dbHandler.pingDb();

    ({ creator, organization } = await createOrgAdminManager(dbHandler));

    apiRequest = await dbHandler.models.ApiRequest.create({
      organizationId: organization.id,
      createdBy: creator.id,
      updatedBy: creator.id,
      name: 'test',
      description: 'test',
      reason: pickedReason,
      host: 'test',
      port: 80,
      method: pickedMethod,
      pathBeforeQuery: 'test',
      expectedResponseStatusCode: 1,
      expectedResponseDataPlacementKey: pickedExpectedResponseDataPlacementKey,
      expectedResponseDataType: pickedExpectedResponseDataType,
    });
  });

  beforeEach(async () => {
    await dbHandler.models.ApiRequestToken.destroy({ force: true, where: {} });
  });

  after(async () => {
    await dbHandler.models.ApiRequestToken.destroy({ force: true, where: {} });
    await dbHandler.models.ApiRequest.destroy({ force: true, where: {} });
    await dbHandler.models.Organization.destroy({ force: true, where: {} });
    await dbHandler.models.User.destroy({ force: true, where: {} });
  });

  it('ApiRequestToken creation test', async () => {

    const apiRequestToken = await dbHandler.models.ApiRequestToken.create({
      apiRequestId: apiRequest.id,
      key: 'test',
      value: 'test',
      placement: pickedTokenPlacement,
      prefix: null
    });

    expect(apiRequestToken).to.exist;

  });

  it('ApiRequestToken update test', async () => {
    
    const apiRequestToken = await dbHandler.models.ApiRequestToken.create({
      apiRequestId: apiRequest.id,
      key: 'test',
      value: 'test',
      placement: pickedTokenPlacement,
      prefix: null
    });

    apiRequestToken.key = 'test2';

    await apiRequestToken.save();

    const apiRequestTokenInDB = await dbHandler.models.ApiRequestToken.findOne({ where: {
      id: apiRequestToken.id
    } });

    expect(apiRequestTokenInDB).to.exist;
    expect(apiRequestTokenInDB?.key).to.equal('test2');

  });

  it('ApiRequestToken delete test', async () => {
    
    const apiRequestToken = await dbHandler.models.ApiRequestToken.create({
      apiRequestId: apiRequest.id,
      key: 'test',
      value: 'test',
      placement: pickedTokenPlacement,
      prefix: null
    });

    await apiRequestToken.destroy();

    const apiRequestTokenInDB = await dbHandler.models.ApiRequestToken.findOne({ where: {
      id: apiRequestToken.id
    } });

    expect(apiRequestTokenInDB).to.not.exist;

  });

});