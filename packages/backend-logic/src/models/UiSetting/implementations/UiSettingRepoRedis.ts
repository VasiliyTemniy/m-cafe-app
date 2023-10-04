// import type { UiSetting } from './UiSetting';
// import type { UiSettingRepo } from './UiSettingRepo';
// import type { UiSettingDTN } from './UiSettingDT';
// import { DatabaseError } from '@m-cafe-app/utils';
// import { UiSettingMapper } from './UiSettingMapper';
// // Change import path to Redis imitator!
// import { UiSetting as UiSettingRedis } from '@m-cafe-app/db';

// export class UiSettingRepoSequelizeRedis implements UiSettingRepo {

//   async getAll(): Promise<UiSetting[]> {
//     const dbUiSettings = await UiSettingRedis.scope('all').findAll();
//     return dbUiSettings.map(uiSetting => UiSettingMapper.dbToDomain(uiSetting));
//   }

//   async getByScope(scope: string = 'defaultScope'): Promise<UiSetting[]> {
//     const dbUiSettings = await UiSettingRedis.scope(scope).findAll();
//     return dbUiSettings.map(uiSetting => UiSettingMapper.dbToDomain(uiSetting));
//   }

//   async getById(id: number): Promise<UiSetting> {
//     const dbUiSetting = await UiSettingRedis.scope('all').findByPk(id);
//     if (!dbUiSetting) throw new DatabaseError(`No ui setting entry with this id ${id}`);
//     return UiSettingMapper.dbToDomain(dbUiSetting);
//   }

//   async create(uiSettingDT: UiSettingDTN): Promise<UiSetting> {
//     const dbUiSetting = await UiSettingRedis.create({
//       name: uiSettingDT.name,
//       value: uiSettingDT.value,
//       theme: uiSettingDT.theme,
//       group: uiSettingDT.group
//     });
//     return UiSettingMapper.dbToDomain(dbUiSetting);
//   }

//   async update(uiSettingDT: UiSettingDTN): Promise<UiSetting> {
//     const dbUiSetting = uiSettingDT.id
//       ? await UiSettingRedis.findByPk(uiSettingDT.id)
//       : await UiSettingRedis.findOne({ where: { name: uiSettingDT.name, theme: uiSettingDT.theme, group: uiSettingDT.group } });
//     if (!dbUiSetting) throw new DatabaseError(`No ui setting entry with this id ${uiSettingDT.id}`);
//     dbUiSetting.value = uiSettingDT.value;
//     await dbUiSetting.save();
//     return UiSettingMapper.dbToDomain(dbUiSetting);
//   }

//   async updateMany(uiSettingDTs: UiSettingDTN[]): Promise<UiSetting[]> {
//     return await Promise.all(uiSettingDTs.map(uiSettingDT => this.update(uiSettingDT)));
//   }

//   async remove(id: number): Promise<void> {
//     const dbUiSetting = await UiSettingRedis.scope('all').findByPk(id);
//     if (!dbUiSetting) throw new DatabaseError(`No ui setting entry with this id ${id}`);
//     await dbUiSetting.destroy();
//   }

// }