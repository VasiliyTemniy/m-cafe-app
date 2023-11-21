import type { UiSetting, UiSettingDTN, UiSettingS, UiSettingUniqiePropertiesGroup } from '@m-cafe-app/models';
import type { ICRUDRepo, IInmemRepo } from '../../../utils';

export interface IUiSettingRepo extends ICRUDRepo<UiSetting, UiSettingDTN> {
  getByScope(scope: string): Promise<UiSetting[]>
  getByUniqueProperties(properties: UiSettingUniqiePropertiesGroup): Promise<UiSetting | undefined>
}

export interface IUiSettingSRepo extends IInmemRepo<UiSetting, UiSettingS> {
  getMany(theme?: string): Promise<UiSettingS[]>;
}