import type { UiSettingDT } from '@m-cafe-app/models';
import type { ICRUDService } from '../../../utils';

export interface IUiSettingService extends ICRUDService<UiSettingDT> {
  getByScope(scope: string): Promise<UiSettingDT[]>
  initUiSettings(): Promise<void>
  reset(): Promise<UiSettingDT[]>
}