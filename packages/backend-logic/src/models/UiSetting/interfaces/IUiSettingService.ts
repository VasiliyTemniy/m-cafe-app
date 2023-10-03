import type { ICRUDService } from '../../../utils';
import type { UiSettingDT } from '../UiSettingDT.js';

export interface IUiSettingService extends ICRUDService<UiSettingDT> {
  getByScope(scope: string): Promise<UiSettingDT[]>
  initUiSettings(): Promise<void>
  reset(): Promise<UiSettingDT[]>
}