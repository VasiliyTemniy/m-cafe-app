import {
  UiSettingControllerExpressHttp,
  UiSettingRepoSequelizePG,
  UiSettingService
} from '@m-cafe-app/backend-logic';


export const uiSettingController =
  new UiSettingControllerExpressHttp(
    new UiSettingService(
      new UiSettingRepoSequelizePG()
    )
  );