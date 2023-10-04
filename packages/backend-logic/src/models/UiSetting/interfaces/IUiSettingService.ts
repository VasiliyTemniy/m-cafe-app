import type { UiSettingDT, UiSettingDTN } from '@m-cafe-app/models';
import type { ICRUDService } from '../../../utils';

export interface IUiSettingService extends ICRUDService<UiSettingDT, UiSettingDTN> {
  getByScope(scope: string): Promise<UiSettingDT[]>
  initUiSettings(): Promise<void>
  reset(): Promise<UiSettingDT[]>
}