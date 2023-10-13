import type { UiSetting, UiSettingDTN, UiSettingS } from '@m-cafe-app/models';
import type { ICRUDRepo } from '../../../utils';

export interface IUiSettingRepo extends ICRUDRepo<UiSetting, UiSettingDTN> {
  getByScope(scope: string): Promise<UiSetting[]>
}

export interface IUiSettingSRepo {
  getAllThemed(theme?: string): Promise<UiSettingS[]>;
  storeAll(uiSettings: UiSetting[]): Promise<void>;
  removeAll(): Promise<void>;
  connect(): Promise<void>;
  ping(): Promise<void>;
  close(): Promise<void>;
}