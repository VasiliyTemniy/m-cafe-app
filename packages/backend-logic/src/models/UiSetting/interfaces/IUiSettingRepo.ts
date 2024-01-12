import type { UiSetting, UiSettingDTN, UiSettingS, UiSettingUniqiePropertiesGroup } from '@m-cafe-app/models';
import type { GenericTransaction, ICRUDRepo, IInmemRepo } from '../../../utils';

export interface IUiSettingRepo extends ICRUDRepo<UiSetting, UiSettingDTN> {
  getByScope(scope: string): Promise<UiSetting[]>
  getByUniqueProperties(properties: UiSettingUniqiePropertiesGroup): Promise<UiSetting | undefined>
  remove(id: number, transaction?: GenericTransaction): Promise<UiSetting>;
}

export interface IUiSettingSRepo extends IInmemRepo<UiSetting, UiSettingS> {
  getMany(theme?: string): Promise<UiSettingS[]>;
}