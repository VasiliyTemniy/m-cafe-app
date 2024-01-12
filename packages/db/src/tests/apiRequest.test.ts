import { expect } from 'chai';
import 'mocha';
import { dbHandler } from '../db';
import { createOrgAdminManager, randomEnumValue } from './db_test_helper';



describe('Database ApiRequest model tests', () => {

  let organization: InstanceType<typeof dbHandler.models.Organization>;
  let creator: InstanceType<typeof dbHandler.models.User>;

  const pickedReason = randomEnumValue('ApiRequestReason');
  const pickedMethod = randomEnumValue('ApiRequestMethod');
  const pickedExpectedResponseDataPlacementKey = randomEnumValue('ApiRequestExpectedResponseDataPlacementKey');
  const pickedExpectedResponseDataType = randomEnumValue('ApiRequestExpectedResponseDataType');
  const pickedProtocol = randomEnumValue('ApiRequestProtocol');

  before(async () => {
    await dbHandler.pingDb();

    ({ creator, organization } = await createOrgAdminManager(dbHandler));
  });

  beforeEach(async () => {
    await dbHandler.models.ApiRequest.destroy({ force: true, where: {} });
  });

  after(async () => {
    await dbHandler.models.ApiRequest.destroy({ force: true, where: {} });
    await dbHandler.models.Organization.destroy({ force: true, where: {} });
    await dbHandler.models.User.destroy({ force: true, where: {} });
  });

  it('ApiRequest creation test', async () => {

    // Minimal data
    const apiRequest = await dbHandler.models.ApiRequest.create({
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

    expect(apiRequest).to.exist;

    // Full data
    const apiRequest2 = await dbHandler.models.ApiRequest.create({
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
      auth: 'test',
      defaultPort: 808,
      family: 1,
      hints: 2,
      insecureHttpParser: true,
      joinDuplicateHeaders: true,
      localAddress: 'test',
      localPort: 8080,
      maxHeaderSize: 1,
      protocol: pickedProtocol,
      setHost: true,
      socketPath: true,
      timeout: 1,
      approvedBy: creator.id,
    });

    expect(apiRequest2).to.exist;

  });

  it('ApiRequest update test', async () => {
    
    const apiRequest = await dbHandler.models.ApiRequest.create({
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

    apiRequest.host = 'test2';

    await apiRequest.save();

    const apiRequestInDB = await dbHandler.models.ApiRequest.findOne({ where: {
      id: apiRequest.id
    } });

    expect(apiRequestInDB).to.exist;
    expect(apiRequestInDB?.host).to.equal('test2');

  });

  it('ApiRequest delete test', async () => {
    
    const apiRequest = await dbHandler.models.ApiRequest.create({
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

    await apiRequest.destroy();

    const apiRequestInDB = await dbHandler.models.ApiRequest.findOne({ where: {
      id: apiRequest.id
    } });

    expect(apiRequestInDB).to.not.exist;

  });

});