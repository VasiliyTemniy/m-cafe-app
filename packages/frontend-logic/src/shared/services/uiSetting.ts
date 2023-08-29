import axios from 'axios';
import { NewUiSettingBody, EditUiSettingBody, EditManyUiSettingBody, UiSettingDT } from '@m-cafe-app/utils';
import { RequestOptions } from '../../types/requestOptions';

/**
 * Should not be used. All ui settings must be initialized on backend and only updated by admin
 */
const createUiSetting = async (newUiSetting: NewUiSettingBody, options: RequestOptions) => {

  const reqBody: NewUiSettingBody = newUiSetting;

  const config = { headers: {'Content-Type': 'application/json'}, withCredentials: true };
  const { data: fixedUiSetting } = await axios.post<JSON>(
    `${options.apiBaseUrl}/api/ui-setting`,
    JSON.stringify(reqBody),
    config
  );

  return fixedUiSetting;
};

/**
 * Not recommended, better to update many at once
 */
const updateUiSetting = async (updUiSetting: EditUiSettingBody, locId: number, options: RequestOptions) => {

  const reqBody: EditUiSettingBody = updUiSetting;

  const config = { headers: {'Content-Type': 'application/json'}, withCredentials: true };
  const { data: fixedUiSetting } = await axios.put<JSON>(
    `${options.apiBaseUrl}/api/ui-setting/${locId}`,
    JSON.stringify(reqBody),
    config
  );

  return fixedUiSetting;
};

/**
 * Recommended to update ui settings
 */
const updateManyUiSettings = async (updUiSettings: UiSettingDT[], options: RequestOptions) => {

  const reqBody: EditManyUiSettingBody = { updUiSettings };

  const config = { headers: {'Content-Type': 'application/json'}, withCredentials: true };
  const { data: fixedUiSetting } = await axios.put<JSON>(
    `${options.apiBaseUrl}/api/ui-setting/all`,
    JSON.stringify(reqBody),
    config
  );

  return fixedUiSetting;
};

const getUiSettings = async (options: RequestOptions) => {

  const { data: fixedUiSettings } = await axios.get<JSON>(
    `${options.apiBaseUrl}/api/ui-setting`
  );

  return fixedUiSettings;
};

/**
 * Should not be used. Though, the only harm will be potential ui bugs
 */
const deleteUiSetting = async (locId: number, options: RequestOptions) => {

  const config = { withCredentials: true };
  await axios.delete<JSON>(
    `${options.apiBaseUrl}/api/ui-setting/${locId}`,
    config
  );

};

export default { createUiSetting, updateUiSetting, updateManyUiSettings, getUiSettings, deleteUiSetting };