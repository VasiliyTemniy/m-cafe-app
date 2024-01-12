import type { UiSetting, UiSettingDTN, UiSettingUniqiePropertiesGroup } from '@m-market-app/models';
import type { IUiSettingRepo } from '../interfaces';
import type { Transaction } from 'sequelize';
import { DatabaseError } from '@m-market-app/utils';
import { UiSettingMapper } from '../infrastructure';
import { UiSetting as UiSettingPG } from '@m-market-app/db';

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

  async getByUniqueProperties(properties: UiSettingUniqiePropertiesGroup): Promise<UiSetting | undefined> {
    const dbUiSetting = await UiSettingPG.scope('all').findOne({ where: properties });
    if (!dbUiSetting) return undefined;
    return UiSettingMapper.dbToDomain(dbUiSetting);
  }

  async create(uiSettingDTN: UiSettingDTN, transaction?: Transaction): Promise<UiSetting> {
    const dbUiSetting = await UiSettingPG.create({
      name: uiSettingDTN.name,
      value: uiSettingDTN.value,
      theme: uiSettingDTN.theme,
      group: uiSettingDTN.group
    }, {
      transaction
    });

    return UiSettingMapper.dbToDomain(dbUiSetting);
  }

  async update(uiSetting: UiSetting, transaction?: Transaction): Promise<UiSetting> {
    const [ count, updated ] = await UiSettingPG.scope('all').update({
      value: uiSetting.value
    }, {
      where: {
        id: uiSetting.id
      },
      transaction,
      returning: true
    });

    if (count === 0) {
      throw new DatabaseError(`No ui setting entry with this id ${uiSetting.id}`);
    }

    return UiSettingMapper.dbToDomain(updated[0]);
  }

  async updateMany(uiSettings: UiSetting[], transaction?: Transaction): Promise<UiSetting[]> {
    return await Promise.all(uiSettings.map(uiSetting => this.update(uiSetting, transaction)));
  }

  async remove(id: number, transaction?: Transaction): Promise<UiSetting> {
    const dbUiSetting = await UiSettingPG.scope('all').findByPk(id);
    if (!dbUiSetting) throw new DatabaseError(`No ui setting entry with this id ${id}`);
    await dbUiSetting.destroy({ transaction });
    return UiSettingMapper.dbToDomain(dbUiSetting);
  }

  async removeAll(): Promise<void> {
    await UiSettingPG.scope('all').destroy({ force: true, where: {} });
  }

}