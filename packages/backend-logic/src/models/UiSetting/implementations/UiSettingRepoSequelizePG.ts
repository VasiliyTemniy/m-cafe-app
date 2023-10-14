import type { UiSetting, UiSettingDTN } from '@m-cafe-app/models';
import type { IUiSettingRepo } from '../interfaces';
import { DatabaseError } from '@m-cafe-app/utils';
import { UiSettingMapper } from '../infrastructure';
import { UiSetting as UiSettingPG } from '@m-cafe-app/db';

export class UiSettingRepoSequelizePG implements IUiSettingRepo {

  async getAll(): Promise<UiSetting[]> {
    const dbUiSettings = await UiSettingPG.scope('all').findAll();
    return dbUiSettings.map(uiSetting => UiSettingMapper.dbToDomain(uiSetting));
  }

  async getByScope(scope: string = 'defaultScope'): Promise<UiSetting[]> {
    const dbUiSettings = await UiSettingPG.scope(scope).findAll();
    return dbUiSettings.map(uiSetting => UiSettingMapper.dbToDomain(uiSetting));
  }

  async getById(id: number): Promise<UiSetting> {
    const dbUiSetting = await UiSettingPG.scope('all').findByPk(id);
    if (!dbUiSetting) throw new DatabaseError(`No ui setting entry with this id ${id}`);
    return UiSettingMapper.dbToDomain(dbUiSetting);
  }

  async create(uiSettingDTN: UiSettingDTN): Promise<UiSetting> {
    const dbUiSetting = await UiSettingPG.create({
      name: uiSettingDTN.name,
      value: uiSettingDTN.value,
      theme: uiSettingDTN.theme,
      group: uiSettingDTN.group
    });
    return UiSettingMapper.dbToDomain(dbUiSetting);
  }

  async update(uiSetting: UiSetting): Promise<UiSetting> {
    const dbUiSetting = await UiSettingPG.scope('all').findByPk(uiSetting.id);

    // Why did I do this id check? Update of ui settings should be done by admin;
    // Admin _must_ have id on frontend, so why omit it in request body?
    // Delete this some time
    // const dbUiSetting = uiSetting.id
    //   ? await UiSettingPG.scope('all').findByPk(uiSetting.id)
    //   : await UiSettingPG.scope('all').findOne({ where: { name: uiSetting.name, theme: uiSetting.theme, group: uiSetting.group } });

    if (!dbUiSetting) throw new DatabaseError(`No ui setting entry with this id ${uiSetting.id}`);
    dbUiSetting.value = uiSetting.value;
    await dbUiSetting.save();
    return UiSettingMapper.dbToDomain(dbUiSetting);
  }

  async updateMany(uiSettings: UiSetting[]): Promise<UiSetting[]> {
    return await Promise.all(uiSettings.map(uiSetting => this.update(uiSetting)));
  }

  async remove(id: number): Promise<void> {
    const dbUiSetting = await UiSettingPG.scope('all').findByPk(id);
    if (!dbUiSetting) throw new DatabaseError(`No ui setting entry with this id ${id}`);
    await dbUiSetting.destroy();
  }

  async removeAll(): Promise<void> {
    await UiSettingPG.scope('all').destroy({ force: true, where: {} });
  }

}