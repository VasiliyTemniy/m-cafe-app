import type { UiSetting, UiSettingDT, UiSettingDTN, UiSettingInmemDT } from '@m-cafe-app/models';
import type { IUiSettingService, IUiSettingRepo, IUiSettingInmemRepo } from '../interfaces';
import { ApplicationError } from '@m-cafe-app/utils';
import { UiSettingMapper } from '../infrastructure';
import {
  allowedCSSPropertiesKeys,
  allowedClassNamesUiSettingsReadonly,
  allowedThemesReadonly,
  componentGroupsReadonly,
  specificUiSettingsReadonly,
  uiSettingTypesReadonly
} from '@m-cafe-app/shared-constants';
import { logger } from '@m-cafe-app/utils';

export class UiSettingService implements IUiSettingService {
  constructor(
    readonly dbRepo: IUiSettingRepo,
    readonly inmemRepo: IUiSettingInmemRepo
  ) {}

  async getAll(): Promise<UiSettingDT[]> {
    const uiSettings = await this.dbRepo.getAll();

    const res: UiSettingDT[] =
      uiSettings.map(uiSetting => UiSettingMapper.domainToDT(uiSetting));

    return res;
  }

  async getById(id: number): Promise<UiSettingDT> {
    const uiSetting = await this.dbRepo.getById(id);

    const res: UiSettingDT = UiSettingMapper.domainToDT(uiSetting);

    return res;
  }

  async getByScope(scope: string = 'defaultScope'): Promise<UiSettingDT[]> {
    const uiSettings = await this.dbRepo.getByScope(scope);

    const res: UiSettingDT[] = uiSettings.map(uiSetting => UiSettingMapper.domainToDT(uiSetting));

    return res;
  }

  async create(uiSettingDTN: UiSettingDTN): Promise<UiSettingDT> {
    const savedUiSetting = await this.dbRepo.create(uiSettingDTN);

    await this.storeToInmem([savedUiSetting]);

    const res: UiSettingDT = UiSettingMapper.domainToDT(savedUiSetting);
    
    return res;
  }

  async update(uiSettingDT: UiSettingDT): Promise<UiSettingDT> {
    const updatedUiSetting = await this.dbRepo.update(UiSettingMapper.dtToDomain(uiSettingDT));

    await this.storeToInmem([updatedUiSetting]);

    const res: UiSettingDT = UiSettingMapper.domainToDT(updatedUiSetting);
    
    return res;
  }

  async updateMany(uiSettingsDT: UiSettingDT[]): Promise<UiSettingDT[]> {
    if (!this.dbRepo.updateMany) throw new ApplicationError(`Update many method not implemented for repository ${this.dbRepo.constructor.name}`);
    const updatedUiSettings = await this.dbRepo.updateMany(uiSettingsDT);

    await this.storeToInmem(updatedUiSettings);

    const res: UiSettingDT[] = updatedUiSettings.map(uiSetting => UiSettingMapper.domainToDT(uiSetting));

    return res;
  }

  async remove(id: number): Promise<void> {
    if (process.env.NODE_ENV !== 'test') return;
    await this.dbRepo.remove(id);
    // Maybe add refresh for inmem?
  }

  async removeAll(): Promise<void> {
    if (process.env.NODE_ENV !== 'test') return;
    await this.dbRepo.removeAll();
    // Maybe add refresh for inmem?
  }

  /**
   * Initializes the UI settings by iterating through the component groups,
   * themes, and UI setting types. For each UI setting type, it performs
   * different actions. It adds UI settings to the database based on the
   * UI setting type, component group, and theme.
   *
   * @return {Promise<void>} Promise that resolves once all the UI settings are added to the database
   */
  async initUiSettings(): Promise<void> {
    for (const theme of allowedThemesReadonly) {
      for (const componentGroup of componentGroupsReadonly) {
        for (const uiSettingType of uiSettingTypesReadonly) {

          switch (uiSettingType) {
            case 'classNames':
              for (const className of allowedClassNamesUiSettingsReadonly) {
                await this.create({ name: className, value: 'false', group: componentGroup, theme });
              }
              break;
            case 'specific':
              break;
            case 'baseVariant':
              await this.create({ name: 'baseVariant', value: 'alpha', group: componentGroup, theme });
              break;
            case 'baseColorVariant':
              await this.create({ name: 'baseColorVariant', value: 'alpha-color', group: componentGroup, theme });
              break;
            case 'inlineCSS':
              for (const inlineCSSKey of allowedCSSPropertiesKeys) {
                await this.create({ name: inlineCSSKey, value: 'false', group: componentGroup, theme });
              }
              break;
            default:
              logger.shout('Wrong ui setting type! Check ui settings. Setting ignored', uiSettingType);
              continue;
          }
        }
      }

      try {
        for (const componentGroup in specificUiSettingsReadonly) {
          const specificUiSetting = specificUiSettingsReadonly[componentGroup as keyof typeof specificUiSettingsReadonly];
          for (const specificUiSettingKey in specificUiSetting) {
            const value = specificUiSetting[specificUiSettingKey as keyof typeof specificUiSetting];
            await this.create({ name: specificUiSettingKey, value, group: componentGroup, theme });
          }
        }
      } catch (error) {
        logger.shout('Error adding specific UI settings to database. Check componentGroup name in specificUiSettingsReadonly', error);
      }
    }

    await this.storeToInmem(await this.getAll());
  }

  async reset(): Promise<UiSettingDT[]> {
    await this.dbRepo.removeAll();
    await this.initUiSettings();
    return await this.getAll();
  }

  /**
   * Retrieves all UiSettingInmemDT objects from the in-memory repository.
   *
   * @param {string} theme - The theme to filter the UiSettingInmemDT objects by. Optional.
   * @return {Promise<UiSettingInmemDT[]>} An array of UiSettingInmemDT objects that match the specified theme,
   * or all UiSettingInmemDT objects if no theme is specified.
   */
  async getFromInmem(theme?: string): Promise<UiSettingInmemDT[]> {
    return await this.inmemRepo.getAllThemed(theme);
  }

  async flushInmem(): Promise<void> {
    await this.inmemRepo.removeAll();
  }

  /**
   * Stores all the provided non-falsy `uiSettings` in memory for fast access for non-admin users.
   *
   * @param {UiSetting[]} uiSettings - An array of `UiSetting` objects to be filtered and stored.
   * @return {Promise<void>} A promise that resolves when the operation is complete.
   */
  async storeToInmem(uiSettings: UiSetting[]): Promise<void> {
    const nonFalsyUiSettings = uiSettings.filter(uiSetting => uiSetting.value !== 'false');
    await this.inmemRepo.storeAll(nonFalsyUiSettings);
  }

  async connectInmem(): Promise<void> {
    await this.inmemRepo.connect();
  }

  async pingInmem(): Promise<void> {
    await this.inmemRepo.ping();
  }

  async closeInmem(): Promise<void> {
    await this.inmemRepo.close();
  }

}