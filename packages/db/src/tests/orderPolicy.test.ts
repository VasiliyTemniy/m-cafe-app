import { expect } from 'chai';
import 'mocha';
import { dbHandler } from '../db';
import { OrderConfirmationMethod, OrderDistanceAvailability, OrderPaymentMethod } from '@m-market-app/shared-constants';
import { createOrgAdminManager } from './db_test_helper';



describe('Database OrderPolicy model tests', () => {

  let organization: InstanceType<typeof dbHandler.models.Organization>;
  let creator: InstanceType<typeof dbHandler.models.User>;

  before(async () => {
    await dbHandler.pingDb();

    ({ creator, organization } = await createOrgAdminManager(dbHandler));
  });

  beforeEach(async () => {
    await dbHandler.models.OrderPolicy.destroy({ force: true, where: {} });
  });

  after(async () => {
    await dbHandler.models.OrderPolicy.destroy({ force: true, where: {} });
    await dbHandler.models.Organization.destroy({ force: true, where: {} });
    await dbHandler.models.User.destroy({ force: true, where: {} });
  });

  it('OrderPolicy creation test', async () => {

    // Minimal data
    const orderPolicy = await dbHandler.models.OrderPolicy.create({
      organizationId: organization.id,
      createdBy: creator.id,
      updatedBy: creator.id,
      name: 'FoodOrderPolicy',
      description: 'This is a new order policy'
    });

    expect(orderPolicy).to.exist;

    // Full data
    const orderPolicy2 = await dbHandler.models.OrderPolicy.create({
      organizationId: organization.id,
      createdBy: creator.id,
      updatedBy: creator.id,
      name: 'NewFoodOrderPolicy',
      description: 'This is a new order policy',
      paymentMethod: OrderPaymentMethod.Cash,
      confirmationMethod: OrderConfirmationMethod.AutoCall,
      distanceAvailability: OrderDistanceAvailability.SameCity,
      isActive: false,
      startsAt: new Date(),
      endsAt: new Date(),
    });

    expect(orderPolicy2).to.exist;

  });

  it('OrderPolicy update test', async () => {
    
    const orderPolicy = await dbHandler.models.OrderPolicy.create({
      organizationId: organization.id,
      createdBy: creator.id,
      updatedBy: creator.id,
      name: 'FoodOrderPolicy',
      description: 'This is a new order policy'
    });

    orderPolicy.name = 'UpdatedOrderPolicy';

    await orderPolicy.save();

    const orderPolicyInDB = await dbHandler.models.OrderPolicy.findOne({ where: {
      id: orderPolicy.id
    } });

    expect(orderPolicyInDB).to.exist;
    expect(orderPolicyInDB?.name).to.equal('UpdatedOrderPolicy');

  });

  it('OrderPolicy delete test', async () => {
    
    const orderPolicy = await dbHandler.models.OrderPolicy.create({
      organizationId: organization.id,
      createdBy: creator.id,
      updatedBy: creator.id,
      name: 'FoodOrderPolicy',
      description: 'This is a new order policy'
    });

    await orderPolicy.destroy();

    const orderPolicyInDB = await dbHandler.models.OrderPolicy.findOne({ where: {
      id: orderPolicy.id
    } });

    expect(orderPolicyInDB).to.not.exist;

  });

});