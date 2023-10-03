import type { UiSetting } from '../UiSetting.js';
import type { ICRUDRepo } from '../../../utils';

export interface IUiSettingRepo extends ICRUDRepo<UiSetting> {
  getAllByScope(scope: string): Promise<UiSetting[]>
}