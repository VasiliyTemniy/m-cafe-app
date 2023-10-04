import {
  UiSettingControllerExpressHttp,
  UiSettingRepoSequelizePG,
  UiSettingService,
  UserControllerExpressHttp,
  UserService,
  UserRepoSequelizePG
} from '@m-cafe-app/backend-logic';


export const uiSettingController =
  new UiSettingControllerExpressHttp(
    new UiSettingService(
      new UiSettingRepoSequelizePG()
    )
  );

export const userController =
  new UserControllerExpressHttp(
    new UserService(
      new UserRepoSequelizePG()
    )
  );