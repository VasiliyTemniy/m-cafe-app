import { ApplicationError, isUiSettingDT, SafeyAny, UiSettingDT } from '@m-cafe-app/utils';
import { createSlice } from '@reduxjs/toolkit';
import { AppDispatch } from '../store';
import uiSettingService from '../services/uiSetting';
import { handleAxiosError } from '../../utils/errorHandler';
import { sharedSettingsSliceBase } from '../../shared/reducers';
import type { SettingsState } from '../../shared/reducers';
import { TFunction } from '../../shared/hooks';
import { Md5 } from 'ts-md5';

type UpdUiSettingAction = {
  payload: {
    uiSetting: UiSettingDT,
  };
};

export type { SettingsState };

/**
 * Slice taken from shared is appended with admin-specific reducers
 */
const settingsSlice = createSlice({
  ...sharedSettingsSliceBase,
  reducers: {
    /**
     * @param {UpdUiSettingAction} action
     * payload UiSettingDT with full name without separation to namespace
     */
    updUiSetting(state: SettingsState, action: UpdUiSettingAction) {
      const nameParts = action.payload.uiSetting.name.split('.');
      const namespace = nameParts[0];
      const uiSettingName = nameParts[1] ? nameParts[1] : '';
      const actualUiSetting: UiSettingDT = {
        ...action.payload.uiSetting,
        name: uiSettingName
      };
      const newActualUiSettingsState = state.actualUiSettings[namespace].map(
        uiSetting => uiSetting.id === action.payload.uiSetting.id ? actualUiSetting : uiSetting
      );
      const newDbUiSettingsState = state.dbUiSettings.map(
        uiSetting => uiSetting.id === action.payload.uiSetting.id ? action.payload.uiSetting : uiSetting
      );
      const uiSettingsHash = Md5.hashStr(JSON.stringify(newActualUiSettingsState));
      const newState = {
        ...state,
        dbUiSettings: newDbUiSettingsState,
        actualUiSettings: {
          [namespace]: newActualUiSettingsState,
          ...state.actualUiSettings
        },
        uiSettingsHash
      };
      return { ...newState };
    },
    ...sharedSettingsSliceBase.reducers
  }
});

export const { setLanguage, setUiSettings, updUiSetting, parseUiSettings, setTheme } = settingsSlice.actions;

/**
 * Updates many ui settings in DB
 */
export const sendUpdUiSettings = (updUiSettings: UiSettingDT[], t: TFunction) => {
  return async (dispatch: AppDispatch) => {
    try {
      const uiSettings = await uiSettingService.updateManyUiSettings(updUiSettings);
      if (!Array.isArray(uiSettings)) throw new ApplicationError('Server has sent wrong data', { current: uiSettings });
      for (const uiSetting of uiSettings) {
        if (!isUiSettingDT(uiSetting)) throw new ApplicationError('Server has sent wrong data', { all: uiSettings, current: uiSetting as SafeyAny });
      }
      dispatch(setUiSettings({ uiSettings }));
      dispatch(parseUiSettings({ uiSettings }));
    } catch (e: unknown) {
      dispatch(handleAxiosError(e, t));
    }
  };
};

export { initUiSettings } from '../../shared/reducers/settingsReducer';

export default settingsSlice.reducer;