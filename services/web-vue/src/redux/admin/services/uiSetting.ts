import axios from 'axios';
import type {
  NewUiSettingBody,
  EditUiSettingBody,
  EditManyUiSettingBody,
  UiSettingDT
} from '@m-cafe-app/utils';
import { apiBaseUrl } from '@m-cafe-app/shared-constants';
import sharedUiSettingsService from '../../shared/services/uiSetting';

/**
 * Should not be used. All ui settings must be initialized on backend and only updated by admin
 */
const createUiSetting = async (newUiSetting: NewUiSettingBody) => {

  const reqBody: NewUiSettingBody = newUiSetting;

  const config = { headers: {'Content-Type': 'application/json'}, withCredentials: true };
  const { data: fixedUiSetting } = await axios.post<JSON>(
    `${apiBaseUrl}/ui-setting`,
    JSON.stringify(reqBody),
    config
  );

  return fixedUiSetting;
};

/**
 * Not recommended, better to update many at once
 */
const updateUiSetting = async (updUiSetting: EditUiSettingBody, locId: number) => {

  const reqBody: EditUiSettingBody = updUiSetting;

  const config = { headers: {'Content-Type': 'application/json'}, withCredentials: true };
  const { data: fixedUiSetting } = await axios.put<JSON>(
    `${apiBaseUrl}/ui-setting/${locId}`,
    JSON.stringify(reqBody),
    config
  );

  return fixedUiSetting;
};

/**
 * Recommended to update ui settings
 */
const updateManyUiSettings = async (updUiSettings: UiSettingDT[]) => {

  const reqBody: EditManyUiSettingBody = { updUiSettings };

  const config = { headers: {'Content-Type': 'application/json'}, withCredentials: true };
  const { data: fixedUiSetting } = await axios.put<JSON>(
    `${apiBaseUrl}/ui-setting/all`,
    JSON.stringify(reqBody),
    config
  );

  return fixedUiSetting;
};

/**
 * Should not be used. Though, the only harm will be potential ui bugs
 */
const deleteUiSetting = async (locId: number) => {

  const config = { withCredentials: true };
  await axios.delete<JSON>(
    `${apiBaseUrl}/ui-setting/${locId}`,
    config
  );

};


export default { createUiSetting, updateUiSetting, updateManyUiSettings, deleteUiSetting, ...sharedUiSettingsService };