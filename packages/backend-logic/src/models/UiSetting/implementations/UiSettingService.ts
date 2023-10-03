import type { UiSettingDT, UiSettingDTNU } from '../UiSettingDT.js';
import type { IUiSettingService, IUiSettingRepo } from '../interfaces';
import { ApplicationError } from '@m-cafe-app/utils';
import { UiSettingMapper } from '../UiSettingMapper';
import {
  allowedCSSPropertiesKeys,
  allowedClassNamesUiSettingsReadonly,
  allowedThemesReadonly,
  componentGroupsReadonly,
  specificUiSettingsReadonly,
  uiSettingTypesReadonly
} from '@m-cafe-app/shared-constants';
import logger from '../../../utils/logger.js';

export class UiSettingService implements IUiSettingService {
  constructor( readonly dbRepo: IUiSettingRepo ) {}

  async getAll() {
    const uiSettings = await this.dbRepo.getAll();

    const res: UiSettingDT[] =
      uiSettings.map(uiSetting => UiSettingMapper.domainToHttp(uiSetting));

    return res;
  }

  async getById(id: number) {
    const uiSetting = await this.dbRepo.getById(id);

    const res: UiSettingDT = UiSettingMapper.domainToHttp(uiSetting);

    return res;
  }

  async getByScope(scope: string = 'defaultScope') {
    const uiSettings = await this.dbRepo.getByScope(scope);

    const res: UiSettingDT[] = uiSettings.map(uiSetting => UiSettingMapper.domainToHttp(uiSetting));

    return res;
  }

  async create(uiSettingDTNU: UiSettingDTNU) {
    const savedUiSetting = await this.dbRepo.create(uiSettingDTNU);

    const res: UiSettingDT = UiSettingMapper.domainToHttp(savedUiSetting);
    
    return res;
  }

  async update(uiSettingDTNU: UiSettingDTNU) {
    const updatedUiSetting = await this.dbRepo.update(uiSettingDTNU);

    const res: UiSettingDT = UiSettingMapper.domainToHttp(updatedUiSetting);
    
    return res;
  }

  async updateMany(uiSettingsDTNU: UiSettingDTNU[]) {
    if (!this.dbRepo.updateMany) throw new ApplicationError(`Update many method not implemented for repository ${this.dbRepo.constructor.name}`);
    const updatedUiSettings = await this.dbRepo.updateMany(uiSettingsDTNU);

    const res: UiSettingDT[] = updatedUiSettings.map(uiSetting => UiSettingMapper.domainToHttp(uiSetting));

    return res;
  }

  async remove(id: number) {
    if (process.env.NODE_ENV !== 'test') return;
    await this.dbRepo.remove(id);
  }

  async removeAll() {
    if (process.env.NODE_ENV !== 'test') return;
    await this.dbRepo.removeAll();
  }

  /**
   * Initializes the UI settings by iterating through the component groups,
   * themes, and UI setting types. For each UI setting type, it performs
   * different actions. It adds UI settings to the database based on the
   * UI setting type, component group, and theme.
   *
   * @return {Promise<void>} Promise that resolves once all the UI settings are added to the database
   */
  async initUiSettings() {
    for (const theme of allowedThemesReadonly) {
      for (const componentGroup of componentGroupsReadonly) {
        for (const uiSettingType of uiSettingTypesReadonly) {

          switch (uiSettingType) {
            case 'classNames':
              for (const className of allowedClassNamesUiSettingsReadonly) {
                await this.create({ name: className, value: 'false', group: componentGroup, theme});
              }
              break;
            case 'specific':
              break;
            case 'baseVariant':
              await this.create({ name: 'baseVariant', value: 'alpha', group: componentGroup, theme});
              break;
            case 'baseColorVariant':
              await this.create({ name: 'baseColorVariant', value: 'alpha-color', group: componentGroup, theme});
              break;
            case 'inlineCSS':
              for (const inlineCSSKey of allowedCSSPropertiesKeys) {
                await this.create({ name: inlineCSSKey, value: 'false', group: componentGroup, theme});
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
            await this.create({ name: specificUiSettingKey, value, group: componentGroup, theme});
          }
        }
      } catch (error) {
        logger.shout('Error adding specific UI settings to database. Check componentGroup name in specificUiSettingsReadonly', error);
      }
    }
  }

  async reset() {
    await this.dbRepo.removeAll();
    await this.initUiSettings();
    return await this.getAll();
  }

}