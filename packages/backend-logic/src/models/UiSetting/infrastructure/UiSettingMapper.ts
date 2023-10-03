import type { EntityDBMapper, EntityHttpMapper } from '../../../utils';
import type { UiSettingDT } from '@m-cafe-app/models';
import { UiSetting } from '@m-cafe-app/models';
import { UiSetting as UiSettingPG } from '@m-cafe-app/db';


export class UiSettingMapper implements EntityDBMapper<UiSetting, UiSettingPG>, EntityHttpMapper<UiSetting, UiSettingDT> {

  public static domainToDb(domainUiSetting: UiSetting): UiSettingPG {
    const dbUiSetting = new UiSettingPG(domainUiSetting);
    return dbUiSetting;
  }

  domainToDb(domainUiSetting: UiSetting): UiSettingPG {
    return UiSettingMapper.domainToDb(domainUiSetting);
  }

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

  public static httpToDomain(httpUiSetting: UiSettingDT): UiSetting {
    return httpUiSetting;
  }
  
  httpToDomain(httpUiSetting: UiSettingDT): UiSetting {
    return UiSettingMapper.httpToDomain(httpUiSetting);
  }

  public static domainToHttp(domainUiSetting: UiSetting): UiSettingDT {
    const httpUiSetting: UiSettingDT = {
      id: domainUiSetting.id,
      name: domainUiSetting.name,
      value: domainUiSetting.value,
      theme: domainUiSetting.theme,
      group: domainUiSetting.group
    };
    return httpUiSetting;
  }

  domainToHttp(domainUiSetting: UiSetting): UiSetting {
    return UiSettingMapper.domainToHttp(domainUiSetting);
  }

}