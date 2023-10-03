import type { UiSetting } from '../UiSetting.js';
import type { IUiSettingRepo } from '../interfaces';
import type { UiSettingDTNU } from '../UiSettingDT.js';
import { DatabaseError } from '@m-cafe-app/utils';
import { UiSettingMapper } from '../UiSettingMapper';
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

  async create(uiSettingDT: UiSettingDTNU): Promise<UiSetting> {
    const dbUiSetting = await UiSettingPG.create({
      name: uiSettingDT.name,
      value: uiSettingDT.value,
      theme: uiSettingDT.theme,
      group: uiSettingDT.group
    });
    return UiSettingMapper.dbToDomain(dbUiSetting);
  }

  async update(uiSettingDT: UiSettingDTNU): Promise<UiSetting> {
    const dbUiSetting = uiSettingDT.id
      ? await UiSettingPG.scope('all').findByPk(uiSettingDT.id)
      : await UiSettingPG.scope('all').findOne({ where: { name: uiSettingDT.name, theme: uiSettingDT.theme, group: uiSettingDT.group } });
    if (!dbUiSetting) throw new DatabaseError(`No ui setting entry with this id ${uiSettingDT.id}`);
    dbUiSetting.value = uiSettingDT.value;
    await dbUiSetting.save();
    return UiSettingMapper.dbToDomain(dbUiSetting);
  }

  async updateMany(uiSettingDTs: UiSettingDTNU[]): Promise<UiSetting[]> {
    return await Promise.all(uiSettingDTs.map(uiSettingDT => this.update(uiSettingDT)));
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