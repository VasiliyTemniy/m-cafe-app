import type { UiSetting, UiSettingDTN, UiSettingInmem } from '@m-cafe-app/models';
import type { ICRUDRepo } from '../../../utils';

export interface IUiSettingRepo extends ICRUDRepo<UiSetting, UiSettingDTN> {
  getByScope(scope: string): Promise<UiSetting[]>
}

export interface IUiSettingInmemRepo {
  getAllThemed(theme?: string): Promise<UiSettingInmem[]>;
  storeAll(uiSettings: UiSetting[]): Promise<void>;
  removeAll(): Promise<void>;
  connect(): Promise<void>;
  ping(): Promise<void>;
  close(): Promise<void>;
}