import { expect } from 'chai';
import 'mocha';
import { dbHandler } from '../db';



describe('Database FixedEnum model tests', () => {

  before(async () => {
    await dbHandler.pingDb();
  });

  beforeEach(async () => {
    await dbHandler.models.FixedEnum.destroy({ force: true, where: {} });
  });

  after(async () => {
    await dbHandler.models.FixedEnum.destroy({ force: true, where: {} });
  });

  it('FixedEnum creation test', async () => {

    const fixedEnum = await dbHandler.models.FixedEnum.create({
      name: 'test',
      key: 'test',
      value: 'test'
    });

    expect(fixedEnum).to.exist;

  });

  it('FixedEnum update test', async () => {
    
    const fixedEnum = await dbHandler.models.FixedEnum.create({
      name: 'test',
      key: 'test',
      value: 'test'
    });

    fixedEnum.value = 'test2';

    await fixedEnum.save();

    const fixedEnumInDB = await dbHandler.models.FixedEnum.findOne({ where: {

    } });

    expect(fixedEnumInDB).to.exist;
    expect(fixedEnumInDB?.value).to.equal('test2');

  });

  it('FixedEnum delete test', async () => {
    
    const fixedEnum = await dbHandler.models.FixedEnum.create({
      name: 'test',
      key: 'test',
      value: 'test'
    });

    await fixedEnum.destroy();

    const fixedEnumInDB = await dbHandler.models.FixedEnum.findOne({ where: {

    } });

    expect(fixedEnumInDB).to.not.exist;

  });

});