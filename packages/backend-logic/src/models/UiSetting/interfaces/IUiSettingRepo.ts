import type { UiSetting } from '@m-cafe-app/models';
import type { ICRUDRepo } from '../../../utils';

export interface IUiSettingRepo extends ICRUDRepo<UiSetting> {
  getByScope(scope: string): Promise<UiSetting[]>
  removeAll(): Promise<void>;
}