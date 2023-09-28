import type { AppDispatch } from '../store';
import type { TFunction } from '../../shared/hooks';
import type { UiSettingDT, SafeyAny } from '@m-cafe-app/utils';
import type { ParsedUiSettings, SettingsState } from '../../shared/reducers';
import { ApplicationError, isUiSettingDT } from '@m-cafe-app/utils';
import { createSlice } from '@reduxjs/toolkit';
import uiSettingService from '../services/uiSetting';
import { handleAxiosError } from '../../utils/errorHandler';
import { notify, sharedSettingsSliceBase } from '../../shared/reducers';
import { Md5 } from 'ts-md5';

type SetDbUiSettingsAction = {
  payload: {
    uiSettings: UiSettingDT[]
  }
};

type UpdUiSettingAction = {
  payload: {
    uiSetting: UiSettingDT,
    uiNode: string
  };
};

export type { SettingsState };

/**
 * Slice taken from shared is appended with admin-specific reducers
 */
const settingsSlice = createSlice({
  ...sharedSettingsSliceBase,
  reducers: {
    setDbUiSettings(state: SettingsState, action: SetDbUiSettingsAction) {
      return { ...state, dbUiSettings: action.payload.uiSettings };
    },
    /**
     * Updates `parsed` ui settings state, does not send anything to backend,
     * does not update dbUiSettings state
     */
    updUiSetting(state: SettingsState, action: UpdUiSettingAction) {
      const uiNode = action.payload.uiNode;
      const newParsedUiSettingsNamespaceState = state.parsedUiSettings[uiNode].map(
        uiSetting => uiSetting.id === action.payload.uiSetting.id ? action.payload.uiSetting : uiSetting
      );
      const updParsedUiSettings = {
        ...state.parsedUiSettings,
        [uiNode]: newParsedUiSettingsNamespaceState
      };
      const parsedUiSettingsHash = Md5.hashStr(JSON.stringify(newParsedUiSettingsNamespaceState));
      return { ...state, parsedUiSettings: updParsedUiSettings, parsedUiSettingsHash };
    },
    ...sharedSettingsSliceBase.reducers
  }
});

export const { setLanguage, setDbUiSettings, updUiSetting, parseUiSettings, setTheme } = settingsSlice.actions;

/**
 * Updates many ui settings in DB
 * 
 * Server response is used to reinit ui settings state
 */
export const sendUpdUiSettings = (parsedUiSettings: ParsedUiSettings, t: TFunction) => {
  return async (dispatch: AppDispatch) => {
    try {
      const updUiSettings = [] as UiSettingDT[];
      for (const uiNode in parsedUiSettings) {
        for (const uiSetting of parsedUiSettings[uiNode]) {
          const dbUiSettingName = uiNode + '.' + uiSetting.name;
          updUiSettings.push({ ...uiSetting, name: dbUiSettingName });
        }
      }
      const uiSettings = await uiSettingService.updateManyUiSettings(updUiSettings);
      if (!Array.isArray(uiSettings)) throw new ApplicationError('Server has sent wrong data', { current: uiSettings });
      for (const uiSetting of uiSettings) {
        if (!isUiSettingDT(uiSetting)) throw new ApplicationError('Server has sent wrong data', { all: uiSettings, current: uiSetting as SafeyAny });
      }
      dispatch(setDbUiSettings({ uiSettings }));
      dispatch(parseUiSettings({ uiSettings }));
      dispatch(notify(t('alert.uiSettingSuccess'), 'success'));
    } catch (e: unknown) {
      dispatch(handleAxiosError(e, t));
    }
  };
};

/**
 * Difference between initUiSettings from shared folder and initAdminUiSettings - 
 * admin's init sets dbUiSettings state in addition to parsed ui settings state
 */
export const initAdminUiSettings = (t: TFunction) => {
  return async (dispatch: AppDispatch) => {
    try {
      const uiSettings = await uiSettingService.getUiSettings();
      if (!Array.isArray(uiSettings)) throw new ApplicationError('Server has sent wrong data', { current: uiSettings });
      for (const uiSetting of uiSettings) {
        if (!isUiSettingDT(uiSetting)) throw new ApplicationError('Server has sent wrong data', { all: uiSettings, current: uiSetting as SafeyAny });
      }
      dispatch(setDbUiSettings({ uiSettings }));
      dispatch(parseUiSettings({ uiSettings }));
    } catch (e: unknown) {
      dispatch(handleAxiosError(e, t));
    }
  };
};

export default settingsSlice.reducer;