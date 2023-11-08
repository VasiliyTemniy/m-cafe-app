import type { UiSetting, UiSettingDTN } from '@m-cafe-app/models';
import type { IUiSettingRepo } from '../interfaces';
import type { IDatabaseConnectionHandler } from '@m-cafe-app/db';
import type { Sequelize } from 'sequelize';
import { DatabaseError } from '@m-cafe-app/utils';
import { UiSettingMapper } from '../infrastructure';
import { UiSetting as UiSettingPG } from '@m-cafe-app/db';

export class UiSettingRepoSequelizePG implements IUiSettingRepo {

  private dbInstance: Sequelize;

  constructor(
    readonly dbHandler: IDatabaseConnectionHandler,
  ) {
    if (!dbHandler.dbInstance) {
      throw new DatabaseError('No database connection');
    }
    this.dbInstance = dbHandler.dbInstance;
  }

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
    const createdUiSetting = await this.dbInstance.transaction(async (t) => {
      try {
        const dbUiSetting = await UiSettingPG.create({
          name: uiSettingDTN.name,
          value: uiSettingDTN.value,
          theme: uiSettingDTN.theme,
          group: uiSettingDTN.group
        }, {
          transaction: t
        });

        return UiSettingMapper.dbToDomain(dbUiSetting);
      } catch (err) {
        await t.rollback();
        throw err;
      }
    });

    return createdUiSetting;
  }

  async update(uiSetting: UiSetting): Promise<UiSetting> {
    const updatedUiSetting = await this.dbInstance.transaction(async (t) => {
      
      const [ count, updated ] = await UiSettingPG.update({
        value: uiSetting.value
      }, {
        where: {
          id: uiSetting.id
        },
        transaction: t,
        returning: true
      });

      if (count === 0) {
        await t.rollback();
        throw new DatabaseError(`No ui setting entry with this id ${uiSetting.id}`);
      }

      return UiSettingMapper.dbToDomain(updated[0]);
    });

    return updatedUiSetting;
  }

  async updateMany(uiSettings: UiSetting[]): Promise<UiSetting[]> {
    // Maybe add top-level transaction to prevent partial updating?
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