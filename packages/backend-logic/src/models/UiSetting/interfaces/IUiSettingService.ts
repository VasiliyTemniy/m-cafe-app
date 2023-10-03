import type { ICRUDService } from '../../../utils';
import type { UiSettingDT } from '../UiSettingDT.js';

export interface IUiSettingService extends ICRUDService<UiSettingDT> {
  getAllByScope(scope: string): Promise<UiSettingDT[]>
}