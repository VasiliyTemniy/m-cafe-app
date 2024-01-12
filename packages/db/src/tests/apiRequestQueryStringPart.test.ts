import { expect } from 'chai';
import 'mocha';
import { dbHandler } from '../db';
import { createOrgAdminManager, randomEnumValue } from './db_test_helper';



describe('Database ApiRequestQueryStringPart model tests', () => {

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
    await dbHandler.models.ApiRequestQueryStringPart.destroy({ force: true, where: {} });
  });

  after(async () => {
    await dbHandler.models.ApiRequestQueryStringPart.destroy({ force: true, where: {} });
    await dbHandler.models.ApiRequest.destroy({ force: true, where: {} });
    await dbHandler.models.Organization.destroy({ force: true, where: {} });
    await dbHandler.models.User.destroy({ force: true, where: {} });
  });

  it('ApiRequestQueryStringPart creation test', async () => {

    const apiRequestQueryStringPart = await dbHandler.models.ApiRequestQueryStringPart.create({
      apiRequestId: apiRequest.id,
      orderNumber: 1,
      key: 'test',
      subjectKey: 'test',
      separator: null,
      approvedBy: null
    });

    expect(apiRequestQueryStringPart).to.exist;

  });

  it('ApiRequestQueryStringPart update test', async () => {
    
    const apiRequestQueryStringPart = await dbHandler.models.ApiRequestQueryStringPart.create({
      apiRequestId: apiRequest.id,
      orderNumber: 1,
      key: 'test',
      subjectKey: 'test',
      separator: null,
      approvedBy: null
    });

    apiRequestQueryStringPart.key = 'test2';

    await apiRequestQueryStringPart.save();

    const apiRequestQueryStringPartInDB = await dbHandler.models.ApiRequestQueryStringPart.findOne({ where: {
      id: apiRequestQueryStringPart.id
    } });

    expect(apiRequestQueryStringPartInDB).to.exist;
    expect(apiRequestQueryStringPartInDB?.key).to.equal('test2');

  });

  it('ApiRequestQueryStringPart delete test', async () => {
    
    const apiRequestQueryStringPart = await dbHandler.models.ApiRequestQueryStringPart.create({
      apiRequestId: apiRequest.id,
      orderNumber: 1,
      key: 'test',
      subjectKey: 'test',
      separator: null,
      approvedBy: null
    });

    await apiRequestQueryStringPart.destroy();

    const apiRequestQueryStringPartInDB = await dbHandler.models.ApiRequestQueryStringPart.findOne({ where: {
      id: apiRequestQueryStringPart.id
    } });

    expect(apiRequestQueryStringPartInDB).to.not.exist;

  });

});