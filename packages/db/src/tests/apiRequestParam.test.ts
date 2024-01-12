import { expect } from 'chai';
import 'mocha';
import { dbHandler } from '../db';
import { createOrgAdminManager, randomEnumValue } from './db_test_helper';



describe('Database ApiRequestParam model tests', () => {

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
    await dbHandler.models.ApiRequestParam.destroy({ force: true, where: {} });
  });

  after(async () => {
    await dbHandler.models.ApiRequestParam.destroy({ force: true, where: {} });
    await dbHandler.models.ApiRequest.destroy({ force: true, where: {} });
    await dbHandler.models.Organization.destroy({ force: true, where: {} });
    await dbHandler.models.User.destroy({ force: true, where: {} });
  });

  it('ApiRequestParam creation test', async () => {

    // declare apiRequestId: ForeignKey<ApiRequest['id']>;
    // declare orderNumber: number;
    // declare subjectKey: string;
    // declare pathPostfix: string | null;
    // declare approvedBy: ForeignKey<User['id']> | null;

    const apiRequestParam = await dbHandler.models.ApiRequestParam.create({
      apiRequestId: apiRequest.id,
      orderNumber: 1,
      subjectKey: 'test',
      pathPostfix: null,
      approvedBy: null
    });

    expect(apiRequestParam).to.exist;

  });

  it('ApiRequestParam update test', async () => {
    
    const apiRequestParam = await dbHandler.models.ApiRequestParam.create({
      apiRequestId: apiRequest.id,
      orderNumber: 1,
      subjectKey: 'test',
      pathPostfix: null,
      approvedBy: null
    });

    apiRequestParam.orderNumber = 2;

    await apiRequestParam.save();

    const apiRequestParamInDB = await dbHandler.models.ApiRequestParam.findOne({ where: {
      id: apiRequestParam.id
    } });

    expect(apiRequestParamInDB).to.exist;
    expect(apiRequestParamInDB?.orderNumber).to.equal(2);

  });

  it('ApiRequestParam delete test', async () => {
    
    const apiRequestParam = await dbHandler.models.ApiRequestParam.create({
      apiRequestId: apiRequest.id,
      orderNumber: 1,
      subjectKey: 'test',
      pathPostfix: null,
      approvedBy: null
    });

    await apiRequestParam.destroy();

    const apiRequestParamInDB = await dbHandler.models.ApiRequestParam.findOne({ where: {
      id: apiRequestParam.id
    } });

    expect(apiRequestParamInDB).to.not.exist;

  });

});