import type { EntityDBMapper, EntityDTMapper } from '../../../utils';
import type { UiSettingDT } from '@m-cafe-app/models';
import { UiSetting } from '@m-cafe-app/models';
import { UiSetting as UiSettingPG } from '@m-cafe-app/db';


export class UiSettingMapper implements EntityDBMapper<UiSetting, UiSettingPG>, EntityDTMapper<UiSetting, UiSettingDT> {

  public static dbToDomain(dbUiSetting: UiSettingPG): UiSetting {
    const domainUiSetting = new UiSetting(
      dbUiSetting.id,
      dbUiSetting.name,
      dbUiSetting.value,
      dbUiSetting.group,
      dbUiSetting.theme
    );
    return domainUiSetting;
  }

  dbToDomain(dbUiSetting: UiSettingPG): UiSetting {
    return UiSettingMapper.dbToDomain(dbUiSetting);
  }

  public static dtToDomain(uiSettingDT: UiSettingDT): UiSetting {
    return uiSettingDT;
  }
  
  dtToDomain(uiSettingDT: UiSettingDT): UiSetting {
    return UiSettingMapper.dtToDomain(uiSettingDT);
  }

  public static domainToDT(domainUiSetting: UiSetting): UiSettingDT {
    const uiSettingDT: UiSettingDT = {
      id: domainUiSetting.id,
      name: domainUiSetting.name,
      value: domainUiSetting.value,
      theme: domainUiSetting.theme,
      group: domainUiSetting.group
    };
    return uiSettingDT;
  }

  domainToDT(domainUiSetting: UiSetting): UiSettingDT {
    return UiSettingMapper.domainToDT(domainUiSetting);
  }

}