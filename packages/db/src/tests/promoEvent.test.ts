import { expect } from 'chai';
import 'mocha';
import { dbHandler } from '../db';
import { createOrgAdminManager, randomEnumValue } from './db_test_helper';



describe('Database PromoEvent model tests', () => {

  let organization: InstanceType<typeof dbHandler.models.Organization>;
  let creator: InstanceType<typeof dbHandler.models.User>;

  const pickedCurrencyCode = randomEnumValue('CurrencyCode');

  before(async () => {
    await dbHandler.pingDb();
    
    ({ creator, organization } = await createOrgAdminManager(dbHandler));
  });

  beforeEach(async () => {
    await dbHandler.models.PromoEvent.destroy({ force: true, where: {} });
  });

  after(async () => {
    await dbHandler.models.PromoEvent.destroy({ force: true, where: {} });
    await dbHandler.models.Organization.destroy({ force: true, where: {} });
    await dbHandler.models.User.destroy({ force: true, where: {} });
  });

  it('PromoEvent creation test', async () => {

    const promoEvent = await dbHandler.models.PromoEvent.create({
      organizationId: organization.id,
      createdBy: creator.id,
      updatedBy: creator.id,
      accumulatedPriceCut: 10,
      currencyCode: pickedCurrencyCode,
      isActive: true,
      startsAt: null,
      endsAt: null
    });

    expect(promoEvent).to.exist;

  });

  it('PromoEvent update test', async () => {
    
    const promoEvent = await dbHandler.models.PromoEvent.create({
      organizationId: organization.id,
      createdBy: creator.id,
      updatedBy: creator.id,
      accumulatedPriceCut: 10,
      currencyCode: pickedCurrencyCode,
      isActive: true,
      startsAt: null,
      endsAt: null
    });

    promoEvent.accumulatedPriceCut = 11;

    await promoEvent.save();

    const promoEventInDB = await dbHandler.models.PromoEvent.findOne({ where: {
      id: promoEvent.id
    } });

    expect(promoEventInDB).to.exist;
    expect(promoEventInDB?.accumulatedPriceCut).to.equal(11);

  });

  it('PromoEvent delete test', async () => {
    
    const promoEvent = await dbHandler.models.PromoEvent.create({
      organizationId: organization.id,
      createdBy: creator.id,
      updatedBy: creator.id,
      accumulatedPriceCut: 10,
      currencyCode: pickedCurrencyCode,
      isActive: true,
      startsAt: null,
      endsAt: null
    });

    await promoEvent.destroy();

    const promoEventInDB = await dbHandler.models.PromoEvent.findOne({ where: {
      id: promoEvent.id
    } });

    expect(promoEventInDB).to.not.exist;

  });

});