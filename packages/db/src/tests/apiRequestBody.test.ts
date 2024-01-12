import { expect } from 'chai';
import 'mocha';
import { dbHandler } from '../db';
import { createOrgAdminManager, randomEnumValue } from './db_test_helper';



describe('Database ApiRequestBodyPart model tests', () => {

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
    await dbHandler.models.ApiRequestBodyPart.destroy({ force: true, where: {} });
  });

  after(async () => {
    await dbHandler.models.ApiRequestBodyPart.destroy({ force: true, where: {} });
    await dbHandler.models.ApiRequest.destroy({ force: true, where: {} });
    await dbHandler.models.Organization.destroy({ force: true, where: {} });
    await dbHandler.models.User.destroy({ force: true, where: {} });
  });

  it('ApiRequestBodyPart creation test', async () => {

    const apiRequestBodyPart = await dbHandler.models.ApiRequestBodyPart.create({
      apiRequestId: apiRequest.id,
      key: 'test',
      subjectKey: 'test',
    });

    expect(apiRequestBodyPart).to.exist;

  });

  it('ApiRequestBodyPart update test', async () => {
    
    const apiRequestBodyPart = await dbHandler.models.ApiRequestBodyPart.create({
      apiRequestId: apiRequest.id,
      key: 'test',
      subjectKey: 'test',
    });

    apiRequestBodyPart.key = 'test2';

    await apiRequestBodyPart.save();

    const apiRequestBodyPartInDB = await dbHandler.models.ApiRequestBodyPart.findOne({ where: {
      id: apiRequestBodyPart.id
    } });

    expect(apiRequestBodyPartInDB).to.exist;
    expect(apiRequestBodyPartInDB?.key).to.equal('test2');

  });

  it('ApiRequestBodyPart delete test', async () => {
    
    const apiRequestBodyPart = await dbHandler.models.ApiRequestBodyPart.create({
      apiRequestId: apiRequest.id,
      key: 'test',
      subjectKey: 'test',
    });

    await apiRequestBodyPart.destroy();

    const apiRequestBodyPartInDB = await dbHandler.models.ApiRequestBodyPart.findOne({ where: {
      id: apiRequestBodyPart.id
    } });

    expect(apiRequestBodyPartInDB).to.not.exist;

  });

});