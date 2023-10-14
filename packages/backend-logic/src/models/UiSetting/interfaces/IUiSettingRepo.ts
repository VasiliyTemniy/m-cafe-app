import type { UiSetting, UiSettingDTN, UiSettingS } from '@m-cafe-app/models';
import type { ICRUDRepo, IInmemRepo } from '../../../utils';

export interface IUiSettingRepo extends ICRUDRepo<UiSetting, UiSettingDTN> {
  getByScope(scope: string): Promise<UiSetting[]>
}

export interface IUiSettingSRepo extends IInmemRepo<UiSetting, UiSettingS> {
  getMany(theme?: string): Promise<UiSettingS[]>;
  storeMany(uiSettings: UiSetting[]): Promise<void>;
  remove(name: string): Promise<void>;
}