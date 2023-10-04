import type { UiSetting, UiSettingDTN } from '@m-cafe-app/models';
import type { ICRUDRepo } from '../../../utils';

export interface IUiSettingRepo extends ICRUDRepo<UiSetting, UiSettingDTN> {
  getByScope(scope: string): Promise<UiSetting[]>
  removeAll(): Promise<void>;
}