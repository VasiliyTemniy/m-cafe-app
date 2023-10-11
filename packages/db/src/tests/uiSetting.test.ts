import { expect } from 'chai';
import 'mocha';
import { UiSetting } from '../models';
import { allowedThemes, componentGroups } from '@m-cafe-app/shared-constants';
import { dbHandler } from '../db';



describe('Database UiSetting model tests', () => {

  before(async () => {
    await dbHandler.pingDb();
  });

  beforeEach(async () => {
    await UiSetting.destroy({ force: true, where: {} });
  });

  after(async () => {
    await UiSetting.destroy({ force: true, where: {} });
  });

  it('UiSetting creation test', async () => {

    const randomComponentGroup = componentGroups[Math.floor(Math.random() * componentGroups.length)];
    const randomAllowedTheme = allowedThemes[Math.floor(Math.random() * allowedThemes.length)];

    const uiSetting = await UiSetting.create({
      name: 'test',
      value: 'test',
      group: randomComponentGroup,
      theme: randomAllowedTheme
    });

    expect(uiSetting).to.exist;

  });

  it('UiSetting update test', async () => {

    const randomComponentGroup = componentGroups[Math.floor(Math.random() * componentGroups.length)];
    const randomAllowedTheme = allowedThemes[Math.floor(Math.random() * allowedThemes.length)];
    
    const uiSetting = await UiSetting.create({
      name: 'test',
      value: 'test',
      group: randomComponentGroup,
      theme: randomAllowedTheme
    });

    uiSetting.value = 'test2';

    await uiSetting.save();

    const uiSettingInDB = await UiSetting.findOne({ where: { name: 'test' } });

    expect(uiSettingInDB?.value).to.equal('test2');

  });

  it('UiSetting delete test', async () => {

    const randomComponentGroup = componentGroups[Math.floor(Math.random() * componentGroups.length)];
    const randomAllowedTheme = allowedThemes[Math.floor(Math.random() * allowedThemes.length)];
    
    const uiSetting = await UiSetting.create({
      name: 'test',
      value: 'test',
      group: randomComponentGroup,
      theme: randomAllowedTheme
    });

    await uiSetting.destroy();

    const uiSettingInDB = await UiSetting.findOne({ where: { name: 'test' } });

    expect(uiSettingInDB).to.not.exist;

  });

  it('UiSetting default scope test: does not include falsy values', async () => {

    const randomComponentGroup = componentGroups[Math.floor(Math.random() * componentGroups.length)];
    
    await UiSetting.create({
      name: 'test1',
      value: 'test',
      group: randomComponentGroup,
      theme: 'dark'
    });

    await UiSetting.create({
      name: 'test2',
      value: 'false',
      group: randomComponentGroup,
      theme: 'light'
    });

    await UiSetting.create({
      name: 'test3',
      value: 'true',
      group: randomComponentGroup,
      theme: 'light'
    });

    await UiSetting.create({
      name: 'test4',
      value: 'true',
      group: randomComponentGroup,
      theme: 'dark'
    });

    const nonFalsyUiSettingsInDB = await UiSetting.findAll({});

    expect(nonFalsyUiSettingsInDB).to.have.lengthOf(3);

    const allUiSettingsInDB = await UiSetting.scope('all').findAll({});

    expect(allUiSettingsInDB).to.have.lengthOf(4);

    const lightUiSettingsInDB = await UiSetting.scope('light').findAll({});

    expect(lightUiSettingsInDB).to.have.lengthOf(1);

    const darkUiSettingsInDB = await UiSetting.scope('dark').findAll({});

    expect(darkUiSettingsInDB).to.have.lengthOf(2);

  });

});