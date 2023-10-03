import type { UiSetting } from '../UiSetting.js';
import type { ICRUDRepo } from '../../../utils';

export interface IUiSettingRepo extends ICRUDRepo<UiSetting> {
  getByScope(scope: string): Promise<UiSetting[]>
  removeAll(): Promise<void>;
}