import { expect } from 'chai';
import 'mocha';
import { dbHandler } from '../db';
import { createOrgAdminManager, randomEnumValue } from './db_test_helper';



describe('Database ApiRequestHeader model tests', () => {

  let organization: InstanceType<typeof dbHandler.models.Organization>;
  let creator: InstanceType<typeof dbHandler.models.User>;
  let apiRequest: InstanceType<typeof dbHandler.models.ApiRequest>;

  const pickedReason = randomEnumValue('ApiRequestReason');
  const pickedMethod = randomEnumValue('ApiRequestMethod');
  const pickedExpectedResponseDataPlacementKey = randomEnumValue('ApiRequestExpectedResponseDataPlacementKey');
  const pickedExpectedResponseDataType = randomEnumValue('ApiRequestExpectedResponseDataType');
  
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
    await dbHandler.models.ApiRequestHeader.destroy({ force: true, where: {} });
  });

  after(async () => {
    await dbHandler.models.ApiRequestHeader.destroy({ force: true, where: {} });
    await dbHandler.models.ApiRequest.destroy({ force: true, where: {} });
    await dbHandler.models.Organization.destroy({ force: true, where: {} });
    await dbHandler.models.User.destroy({ force: true, where: {} });
  });

  it('ApiRequestHeader creation test', async () => {

    const apiRequestHeader = await dbHandler.models.ApiRequestHeader.create({
      apiRequestId: apiRequest.id,
      key: 'test',
      value: 'test',
    });

    expect(apiRequestHeader).to.exist;

  });

  it('ApiRequestHeader update test', async () => {
    
    const apiRequestHeader = await dbHandler.models.ApiRequestHeader.create({
      apiRequestId: apiRequest.id,
      key: 'test',
      value: 'test',
    });

    apiRequestHeader.key = 'test2';

    await apiRequestHeader.save();

    const apiRequestHeaderInDB = await dbHandler.models.ApiRequestHeader.findOne({ where: {
      id: apiRequestHeader.id
    } });

    expect(apiRequestHeaderInDB).to.exist;
    expect(apiRequestHeaderInDB?.key).to.equal('test2');

  });

  it('ApiRequestHeader delete test', async () => {
    
    const apiRequestHeader = await dbHandler.models.ApiRequestHeader.create({
      apiRequestId: apiRequest.id,
      key: 'test',
      value: 'test',
    });

    await apiRequestHeader.destroy();

    const apiRequestHeaderInDB = await dbHandler.models.ApiRequestHeader.findOne({ where: {
      id: apiRequestHeader.id
    } });

    expect(apiRequestHeaderInDB).to.not.exist;

  });

});