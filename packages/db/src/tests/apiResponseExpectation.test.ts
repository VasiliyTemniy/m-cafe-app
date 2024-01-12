import { expect } from 'chai';
import 'mocha';
import { dbHandler } from '../db';
import { createOrgAdminManager, randomEnumValue } from './db_test_helper';



describe('Database ApiResponseExpectation model tests', () => {

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
    await dbHandler.models.ApiResponseExpectation.destroy({ force: true, where: {} });
  });

  after(async () => {
    await dbHandler.models.ApiResponseExpectation.destroy({ force: true, where: {} });
    await dbHandler.models.ApiRequest.destroy({ force: true, where: {} });
    await dbHandler.models.Organization.destroy({ force: true, where: {} });
    await dbHandler.models.User.destroy({ force: true, where: {} });
  });

  it('ApiResponseExpectation creation test', async () => {

    const apiResponseExpectation = await dbHandler.models.ApiResponseExpectation.create({
      apiRequestId: apiRequest.id,
      key: 'test',
      subjectKey: 'test',
      approvedBy: null
    });

    expect(apiResponseExpectation).to.exist;

  });

  it('ApiResponseExpectation update test', async () => {
    
    const apiResponseExpectation = await dbHandler.models.ApiResponseExpectation.create({
      apiRequestId: apiRequest.id,
      key: 'test',
      subjectKey: 'test',
      approvedBy: null
    });

    apiResponseExpectation.key = 'test2';

    await apiResponseExpectation.save();

    const apiResponseExpectationInDB = await dbHandler.models.ApiResponseExpectation.findOne({ where: {
      id: apiResponseExpectation.id
    } });

    expect(apiResponseExpectationInDB).to.exist;
    expect(apiResponseExpectationInDB?.key).to.equal('test2');

  });

  it('ApiResponseExpectation delete test', async () => {
    
    const apiResponseExpectation = await dbHandler.models.ApiResponseExpectation.create({
      apiRequestId: apiRequest.id,
      key: 'test',
      subjectKey: 'test',
      approvedBy: null
    });

    await apiResponseExpectation.destroy();

    const apiResponseExpectationInDB = await dbHandler.models.ApiResponseExpectation.findOne({ where: {
      id: apiResponseExpectation.id
    } });

    expect(apiResponseExpectationInDB).to.not.exist;

  });

});