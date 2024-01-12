import { expect } from 'chai';
import 'mocha';
import { dbHandler } from '../db';
import { createOrgAdminManager, randomEnumValue } from './db_test_helper';



describe('Database SaleEvent model tests', () => {

  let organization: InstanceType<typeof dbHandler.models.Organization>;
  let creator: InstanceType<typeof dbHandler.models.User>;

  const pickedCurrencyCode = randomEnumValue('CurrencyCode');

  before(async () => {
    await dbHandler.pingDb();
    
    ({ creator, organization } = await createOrgAdminManager(dbHandler));
  });

  beforeEach(async () => {
    await dbHandler.models.SaleEvent.destroy({ force: true, where: {} });
  });

  after(async () => {
    await dbHandler.models.SaleEvent.destroy({ force: true, where: {} });
    await dbHandler.models.Organization.destroy({ force: true, where: {} });
    await dbHandler.models.User.destroy({ force: true, where: {} });
  });

  it('SaleEvent creation test', async () => {

    const saleEvent = await dbHandler.models.SaleEvent.create({
      organizationId: organization.id,
      createdBy: creator.id,
      updatedBy: creator.id,
      discount: 10,
      usedCount: 0,
      accumulatedPriceCut: 0,
      currencyCode: pickedCurrencyCode,
      isActive: true,
      startsAt: new Date(),
      endsAt: new Date()
    });

    expect(saleEvent).to.exist;

  });

  it('SaleEvent update test', async () => {
    
    const saleEvent = await dbHandler.models.SaleEvent.create({
      organizationId: organization.id,
      createdBy: creator.id,
      updatedBy: creator.id,
      discount: 10,
      usedCount: 0,
      accumulatedPriceCut: 0,
      currencyCode: pickedCurrencyCode,
      isActive: true,
      startsAt: new Date(),
      endsAt: new Date()
    });

    saleEvent.usedCount = 1;

    await saleEvent.save();

    const saleEventInDB = await dbHandler.models.SaleEvent.findOne({ where: {
      id: saleEvent.id
    } });

    expect(saleEventInDB).to.exist;
    expect(saleEventInDB?.usedCount).to.equal(1);

  });

  it('SaleEvent delete test', async () => {
    
    const saleEvent = await dbHandler.models.SaleEvent.create({
      organizationId: organization.id,
      createdBy: creator.id,
      updatedBy: creator.id,
      discount: 10,
      usedCount: 0,
      accumulatedPriceCut: 0,
      currencyCode: pickedCurrencyCode,
      isActive: true,
      startsAt: new Date(),
      endsAt: new Date()
    });

    await saleEvent.destroy();

    const saleEventInDB = await dbHandler.models.SaleEvent.findOne({ where: {
      id: saleEvent.id
    } });

    expect(saleEventInDB).to.not.exist;

  });

});