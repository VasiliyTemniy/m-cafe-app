import type { UiSetting, UiSettingDT, UiSettingDTN, UiSettingDTS } from '@m-cafe-app/models';
import type { ICRUDService, IHasInmemRepoService } from '../../../utils';

export interface IUiSettingService extends ICRUDService<UiSettingDT, UiSettingDTN>, IHasInmemRepoService {
  getByScope(scope: string): Promise<UiSettingDT[]>;
  initUiSettings(): Promise<void>;
  reset(): Promise<UiSettingDT[]>;
  getFromInmem(theme?: string): Promise<UiSettingDTS[]>;
  storeToInmem(uiSettings: UiSetting[]): Promise<void>;
}