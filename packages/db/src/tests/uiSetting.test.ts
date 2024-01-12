import { expect } from 'chai';
import 'mocha';
import { UiSettingTheme } from '@m-market-app/shared-constants';
import { dbHandler } from '../db';
import { createOrgAdminManager, randomEnumValue } from './db_test_helper';



describe('Database UiSetting model tests', () => {

  let organization: InstanceType<typeof dbHandler.models.Organization>;
  let creator: InstanceType<typeof dbHandler.models.User>;

  const pickedComponentGroup = randomEnumValue('UiSettingComponentGroup');
  const pickedTheme = randomEnumValue('UiSettingTheme');

  before(async () => {
    await dbHandler.pingDb();

    ({ creator, organization } = await createOrgAdminManager(dbHandler));
  });

  beforeEach(async () => {
    await dbHandler.models.UiSetting.destroy({ force: true, where: {} });
  });

  after(async () => {
    await dbHandler.models.UiSetting.scope('all').destroy({ force: true, where: {} });
    await dbHandler.models.Organization.destroy({ force: true, where: {} });
    await dbHandler.models.User.destroy({ force: true, where: {} });
  });

  it('UiSetting creation test', async () => {

    const uiSetting = await dbHandler.models.UiSetting.create({
      organizationId: organization.id,
      updatedBy: creator.id,
      name: 'test',
      value: 'test',
      group: pickedComponentGroup,
      theme: pickedTheme
    });

    expect(uiSetting).to.exist;

  });

  it('UiSetting update test', async () => {
    
    const uiSetting = await dbHandler.models.UiSetting.create({
      updatedBy: creator.id,
      name: 'test',
      value: 'test',
      group: pickedComponentGroup,
      theme: pickedTheme
    });

    uiSetting.value = 'test2';

    await uiSetting.save();

    const uiSettingInDB = await dbHandler.models.UiSetting.findOne({ where: { name: 'test' } });

    expect(uiSettingInDB?.value).to.equal('test2');

  });

  it('UiSetting delete test', async () => {
    
    const uiSetting = await dbHandler.models.UiSetting.create({
      updatedBy: creator.id,
      name: 'test',
      value: 'test',
      group: pickedComponentGroup,
      theme: pickedTheme
    });

    await uiSetting.destroy();

    const uiSettingInDB = await dbHandler.models.UiSetting.findOne({ where: { name: 'test' } });

    expect(uiSettingInDB).to.not.exist;

  });

  it('UiSetting default scope test: does not include falsy values', async () => {
    
    await dbHandler.models.UiSetting.create({
      updatedBy: creator.id,
      name: 'test1',
      value: 'test',
      group: pickedComponentGroup,
      theme: UiSettingTheme.Dark
    });

    await dbHandler.models.UiSetting.create({
      updatedBy: creator.id,
      name: 'test2',
      value: 'false',
      group: pickedComponentGroup,
      theme: UiSettingTheme.Light
    });

    await dbHandler.models.UiSetting.create({
      updatedBy: creator.id,
      name: 'test3',
      value: 'true',
      group: pickedComponentGroup,
      theme: UiSettingTheme.Light
    });

    await dbHandler.models.UiSetting.create({
      updatedBy: creator.id,
      name: 'test4',
      value: 'true',
      group: pickedComponentGroup,
      theme: UiSettingTheme.Dark
    });

    const nonFalsyUiSettingsInDB = await dbHandler.models.UiSetting.findAll({});

    expect(nonFalsyUiSettingsInDB).to.have.lengthOf(3);

    const allUiSettingsInDB = await dbHandler.models.UiSetting.scope('all').findAll({});

    expect(allUiSettingsInDB).to.have.lengthOf(4);

    const lightUiSettingsInDB = await dbHandler.models.UiSetting.scope('light').findAll({});

    expect(lightUiSettingsInDB).to.have.lengthOf(1);

    const darkUiSettingsInDB = await dbHandler.models.UiSetting.scope('dark').findAll({});

    expect(darkUiSettingsInDB).to.have.lengthOf(2);

  });

});