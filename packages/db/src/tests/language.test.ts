import { expect } from 'chai';
import 'mocha';
import { Language } from '../models';
import { dbHandler } from '../db';



describe('Database Language model tests', () => {

  before(async () => {
    await dbHandler.pingDb();
  });

  beforeEach(async () => {
    await Language.destroy({ force: true, where: {} });
  });

  after(async () => {
    await Language.destroy({ force: true, where: {} });
  });

  it('Language creation test', async () => {
    
    const language = await Language.create({
      name: 'тест',
      code: 'тест'
    });

    expect(language).to.exist;

  });

  it('Language update test', async () => {
    
    const language = await Language.create({
      name: 'тест',
      code: 'тест'
    });

    language.name = 'тест2';

    await language.save();

    const languageInDB = await Language.findByPk(language.id);

    expect(languageInDB).to.exist;
    expect(languageInDB?.name).to.equal('тест2');

  });

  it('Language delete test', async () => {

    const language = await Language.create({
      name: 'тест',
      code: 'тест'
    });

    await language.destroy();

    const languageInDB = await Language.findByPk(language.id);

    expect(languageInDB).to.not.exist;

  });

});