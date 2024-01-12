import { expect } from 'chai';
import 'mocha';
import { dbHandler } from '../db';
import { DeliveryCostCalculationType, MassMeasure, SizingMeasure, VolumeMeasure } from '@m-cafe-app/shared-constants';
import { createOrgAdminManager } from './db_test_helper';



describe('Database DeliveryPolicy model tests', () => {

  let organization: InstanceType<typeof dbHandler.models.Organization>;
  let creator: InstanceType<typeof dbHandler.models.User>;

  before(async () => {
    await dbHandler.pingDb();

    ({ creator, organization } = await createOrgAdminManager(dbHandler));
  });

  beforeEach(async () => {
    await dbHandler.models.DeliveryPolicy.destroy({ force: true, where: {} });
  });

  after(async () => {
    await dbHandler.models.DeliveryPolicy.destroy({ force: true, where: {} });
    await dbHandler.models.Organization.destroy({ force: true, where: {} });
    await dbHandler.models.User.destroy({ force: true, where: {} });
  });

  it('DeliveryPolicy creation test', async () => {

    // Minimal data
    const deliveryPolicy = await dbHandler.models.DeliveryPolicy.create({
      organizationId: organization.id,
      createdBy: creator.id,
      updatedBy: creator.id,
      name: 'FoodDeliveryPolicy',
      description: 'This is a new delivery policy',
      deliveryCostCalculationType: DeliveryCostCalculationType.Fixed
    });

    expect(deliveryPolicy).to.exist;

    // Full data
    const deliveryPolicy2 = await dbHandler.models.DeliveryPolicy.create({
      organizationId: organization.id,
      createdBy: creator.id,
      updatedBy: creator.id,
      name: 'FoodDeliveryPolicy',
      description: 'This is a new delivery policy',
      deliveryCostCalculationType: DeliveryCostCalculationType.Fixed,
      fixedCostAddon: 100,
      distanceStepCost: 10,
      distanceStepQuantity: 1,
      distanceStepMeasure: SizingMeasure.Km,
      massStepCost: 10,
      massStepQuantity: 1,
      massStepMeasure: MassMeasure.Kg,
      volumeStepCost: 10,
      volumeStepQuantity: 1,
      volumeStepMeasure: VolumeMeasure.L,
      startsAt: new Date(),
      endsAt: new Date(),
      isActive: false
    });

    expect(deliveryPolicy2).to.exist;

  });

  it('DeliveryPolicy update test', async () => {
    
    const deliveryPolicy = await dbHandler.models.DeliveryPolicy.create({
      organizationId: organization.id,
      createdBy: creator.id,
      updatedBy: creator.id,
      name: 'FoodDeliveryPolicy',
      description: 'This is a new delivery policy',
      deliveryCostCalculationType: DeliveryCostCalculationType.Fixed
    });

    deliveryPolicy.name = 'UpdatedDeliveryPolicy';

    await deliveryPolicy.save();

    const deliveryPolicyInDB = await dbHandler.models.DeliveryPolicy.findOne({ where: {
      id: deliveryPolicy.id
    } });

    expect(deliveryPolicyInDB).to.exist;
    expect(deliveryPolicyInDB?.name).to.equal('UpdatedDeliveryPolicy');

  });

  it('DeliveryPolicy delete test', async () => {
    
    const deliveryPolicy = await dbHandler.models.DeliveryPolicy.create({
      organizationId: organization.id,
      createdBy: creator.id,
      updatedBy: creator.id,
      name: 'FoodDeliveryPolicy',
      description: 'This is a new delivery policy',
      deliveryCostCalculationType: DeliveryCostCalculationType.Fixed
    });

    await deliveryPolicy.destroy();

    const deliveryPolicyInDB = await dbHandler.models.DeliveryPolicy.findOne({ where: {
      id: deliveryPolicy.id
    } });

    expect(deliveryPolicyInDB).to.not.exist;

  });

});