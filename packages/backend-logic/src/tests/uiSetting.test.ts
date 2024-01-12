import { expect } from 'chai';
import 'mocha';
import { UiSettingRepoRedis, UiSettingRepoSequelizePG, UiSettingService } from '../models/UiSetting';
import { dbHandler } from '@m-market-app/db';
import { redisUiSettingsClient } from '../config';
import { TransactionHandlerSequelizePG } from '../utils';


// No mocking, no unit testing for this package. Only integration tests ->
// If tests fail after dependency injection, change dependencies accordingly
// in these tests

describe('UiSettingService implementation tests', () => {

  let uiSettingService: UiSettingService;
  
  before(async () => {
    await dbHandler.pingDb();

    uiSettingService = new UiSettingService(
      new UiSettingRepoSequelizePG(),
      new TransactionHandlerSequelizePG(
        dbHandler
      ),
      new UiSettingRepoRedis(redisUiSettingsClient)
    );

    await uiSettingService.connectInmem();
    await uiSettingService.pingInmem();
  });
  
  beforeEach(async () => {
    await uiSettingService.removeAll();
  });

  it('should initialize ui settings properly, store them in db and redis', async () => {

    await uiSettingService.initUiSettings();

    const uiSettings = await uiSettingService.getAll();

    expect(uiSettings.length).to.be.above(0);

    const inmemUiSettings = await uiSettingService.getFromInmem();

    expect(inmemUiSettings.length).to.be.above(0);

    expect(uiSettings.length).to.be.above(inmemUiSettings.length);

    const filteredUiSettings = uiSettings.filter(uiSetting => uiSetting.value !== 'false');

    const inmemUiSettingsSet = new Set(inmemUiSettings.map(uiSetting => uiSetting.name));

    const uiSettingsArraysDiff = filteredUiSettings.filter(uiSetting => !inmemUiSettingsSet.has(uiSetting.name));

    expect(uiSettingsArraysDiff.length).to.equal(0);

  });

  it('should update ui settings in both redis and db', async () => {

    await uiSettingService.initUiSettings();

    const uiSettings = await uiSettingService.getAll();

    const randomUiSetting = uiSettings[Math.floor(Math.random() * (uiSettings.length - 1))];

    await uiSettingService.update({
      id: randomUiSetting.id,
      theme: randomUiSetting.theme,
      group: randomUiSetting.group,
      name: randomUiSetting.name,
      value: 'candybober'
    });

    const updUiSetting = await uiSettingService.getById(randomUiSetting.id);

    const updInmemUiSettings = await uiSettingService.getFromInmem();

    const foundInInmemUiSetting = updInmemUiSettings.find(uiSetting => uiSetting.name === updUiSetting.name);
    if (!foundInInmemUiSetting) return expect(true).to.equal(false);

    expect(updUiSetting.value).to.equal('candybober');
    expect(foundInInmemUiSetting.value).to.equal('candybober');

  });

  it('should update only values of ui settings, never other properties', async () => {

    await uiSettingService.initUiSettings();

    const uiSettings = await uiSettingService.getAll();

    const randomUiSetting = uiSettings[Math.floor(Math.random() * (uiSettings.length - 1))];

    await uiSettingService.update({
      id: randomUiSetting.id,
      theme: 'test',
      group: 'test',
      name: 'test',
      value: 'candybober'
    });

    const updUiSetting = await uiSettingService.getById(randomUiSetting.id);

    expect(updUiSetting.theme).to.not.equal('test');
    expect(updUiSetting.group).to.not.equal('test');
    expect(updUiSetting.name).to.not.equal('test');
    expect(updUiSetting.value).to.equal('candybober');

  });

});