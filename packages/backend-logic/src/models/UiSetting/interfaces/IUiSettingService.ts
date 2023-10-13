import type { UiSetting, UiSettingDT, UiSettingDTN, UiSettingDTS } from '@m-cafe-app/models';
import type { ICRUDService } from '../../../utils';

export interface IUiSettingService extends ICRUDService<UiSettingDT, UiSettingDTN> {
  getByScope(scope: string): Promise<UiSettingDT[]>;
  initUiSettings(): Promise<void>;
  reset(): Promise<UiSettingDT[]>;
  getFromInmem(theme?: string): Promise<UiSettingDTS[]>;
  storeToInmem(uiSettings: UiSetting[]): Promise<void>;
  flushInmem(): Promise<void>;
  connectInmem(): Promise<void>;
  pingInmem(): Promise<void>;
  closeInmem(): Promise<void>;
}