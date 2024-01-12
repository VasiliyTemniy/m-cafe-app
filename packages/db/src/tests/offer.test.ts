import { expect } from 'chai';
import 'mocha';
import { dbHandler } from '../db';
import { createCustomer, createOrgAdminManager, randomEnumValue } from './db_test_helper';



describe('Database Offer model tests', () => {

  let organization: InstanceType<typeof dbHandler.models.Organization>;
  let manager: InstanceType<typeof dbHandler.models.User>;
  let customer: InstanceType<typeof dbHandler.models.User>;

  const pickedOfferType = randomEnumValue('OfferType');
  const pickedOfferGrantMethod = randomEnumValue('OfferGrantMethod');
  const pickedCurrencyCode = randomEnumValue('CurrencyCode');

  before(async () => {
    await dbHandler.pingDb();

    ({ creator: manager, organization } = await createOrgAdminManager(dbHandler));

    ({ customer } = await createCustomer(dbHandler));
  });

  beforeEach(async () => {
    await dbHandler.models.Offer.destroy({ force: true, where: {} });
  });

  after(async () => {
    await dbHandler.models.Offer.destroy({ force: true, where: {} });
    await dbHandler.models.Organization.destroy({ force: true, where: {} });
    await dbHandler.models.User.destroy({ force: true, where: {} });
  });

  it('Offer creation test', async () => {

    // Minimal data
    const offer = await dbHandler.models.Offer.create({
      organizationId: organization.id,
      userId: customer.id,
      type: pickedOfferType,
      grantMethod: pickedOfferGrantMethod,
      name: 'NewOffer',
      description: 'Description',
      code: 'CODE',
      discount: 10,
      bonusToCurrencyRate: 1,
      bonusGainMultiplier: 1,
      deliveryFreeThreshold: 100,
      currencyCode: pickedCurrencyCode,
      lastUsedAt: new Date(),
      availableAt: new Date(),
    });

    expect(offer).to.exist;

    // Delete offer because of orgId / userId is unique pair
    await offer.destroy();

    // Full data
    const offer2 = await dbHandler.models.Offer.create({
      organizationId: organization.id,
      userId: customer.id,
      type: pickedOfferType,
      grantMethod: pickedOfferGrantMethod,
      name: 'NewOffer',
      description: 'Description',
      code: 'CODE',
      discount: 10,
      bonusToCurrencyRate: 1,
      bonusGainMultiplier: 1,
      deliveryFreeThreshold: 100,
      currencyCode: pickedCurrencyCode,
      lastUsedAt: new Date(),
      availableAt: new Date(),
      unusedToDeactivateDiscountMs: 100,
      bonusExpiracyMs: 100,
      bonusAvailableAtDelayMs: 100,
      grantedBy: manager.id,
      updatedBy: manager.id,
    });

    expect(offer2).to.exist;

  });

  it('Offer update test', async () => {
    
    const offer = await dbHandler.models.Offer.create({
      organizationId: organization.id,
      userId: customer.id,
      type: pickedOfferType,
      grantMethod: pickedOfferGrantMethod,
      name: 'NewOffer',
      description: 'Description',
      code: 'CODE',
      discount: 10,
      bonusToCurrencyRate: 1,
      bonusGainMultiplier: 1,
      deliveryFreeThreshold: 100,
      currencyCode: pickedCurrencyCode,
      lastUsedAt: new Date(),
      availableAt: new Date(),
    });

    offer.discount = 55;

    await offer.save();

    const offerInDB = await dbHandler.models.Offer.findOne({ where: {
      id: offer.id
    } });

    expect(offerInDB).to.exist;
    expect(offerInDB?.discount).to.equal(55);

  });

  it('Offer delete test', async () => {
    
    const offer = await dbHandler.models.Offer.create({
      organizationId: organization.id,
      userId: customer.id,
      type: pickedOfferType,
      grantMethod: pickedOfferGrantMethod,
      name: 'NewOffer',
      description: 'Description',
      code: 'CODE',
      discount: 10,
      bonusToCurrencyRate: 1,
      bonusGainMultiplier: 1,
      deliveryFreeThreshold: 100,
      currencyCode: pickedCurrencyCode,
      lastUsedAt: new Date(),
      availableAt: new Date(),
    });

    await offer.destroy();

    const offerInDB = await dbHandler.models.Offer.findOne({ where: {
      id: offer.id
    } });

    expect(offerInDB).to.not.exist;

  });

  it('Offer default scope test: does not include timestamps', async () => {
    
    const offer = await dbHandler.models.Offer.create({
      organizationId: organization.id,
      userId: customer.id,
      type: pickedOfferType,
      grantMethod: pickedOfferGrantMethod,
      name: 'NewOffer',
      description: 'Description',
      code: 'CODE',
      discount: 10,
      bonusToCurrencyRate: 1,
      bonusGainMultiplier: 1,
      deliveryFreeThreshold: 100,
      currencyCode: pickedCurrencyCode,
      lastUsedAt: new Date(),
      availableAt: new Date(),
    });

    const offerInDB = await dbHandler.models.Offer.findOne({ where: {
      id: offer.id
    } });

    expect(offerInDB?.createdAt).to.not.exist;
    expect(offerInDB?.updatedAt).to.not.exist;

  });

});