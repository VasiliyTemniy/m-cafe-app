import { CurrencyCode } from '@m-cafe-app/shared-constants';
import { expect } from 'chai';
import 'mocha';
import { dbHandler } from '../db';



describe('Database CurrencyConversion model tests', () => {

  before(async () => {
    await dbHandler.pingDb();
  });

  beforeEach(async () => {
    await dbHandler.models.CurrencyConversion.destroy({ force: true, where: {} });
  });

  after(async () => {
    await dbHandler.models.CurrencyConversion.destroy({ force: true, where: {} });
  });

  it('CurrencyConversion creation test', async () => {

    const currencyConversion = await dbHandler.models.CurrencyConversion.create({
      sourceCurrencyCode: CurrencyCode.RUB,
      targetCurrencyCode: CurrencyCode.USD,
      rate: 2.1231
    });

    expect(currencyConversion).to.exist;

  });

  it('CurrencyConversion update test', async () => {
    
    const currencyConversion = await dbHandler.models.CurrencyConversion.create({
      sourceCurrencyCode: CurrencyCode.RUB,
      targetCurrencyCode: CurrencyCode.USD,
      rate: 2.1231
    });

    currencyConversion.rate = 2.9231;

    await currencyConversion.save();

    const currencyConversionInDB = await dbHandler.models.CurrencyConversion.findOne({ where: {

    } });

    expect(currencyConversionInDB).to.exist;
    expect(currencyConversionInDB?.rate).to.equal(2.9231);

  });

  it('CurrencyConversion delete test', async () => {
    
    const currencyConversion = await dbHandler.models.CurrencyConversion.create({
      sourceCurrencyCode: CurrencyCode.RUB,
      targetCurrencyCode: CurrencyCode.USD,
      rate: 2.1231
    });

    await currencyConversion.destroy();

    const currencyConversionInDB = await dbHandler.models.CurrencyConversion.findOne({ where: {

    } });

    expect(currencyConversionInDB).to.not.exist;

  });

  it('CurrencyConversion default scope test: does not include timestamps', async () => {
    
    await dbHandler.models.CurrencyConversion.create({
      sourceCurrencyCode: CurrencyCode.RUB,
      targetCurrencyCode: CurrencyCode.USD,
      rate: 2.1231
    });

    const currencyConversionInDB = await dbHandler.models.CurrencyConversion.findOne({ where: {

    } });

    expect(currencyConversionInDB?.createdAt).to.not.exist;
    expect(currencyConversionInDB?.updatedAt).to.not.exist;

  });

});