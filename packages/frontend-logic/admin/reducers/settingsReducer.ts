import { ApplicationError, isUiSettingDT, SafeyAny, UiSettingDT } from '@m-cafe-app/utils';
import { createSlice } from '@reduxjs/toolkit';
import { AppDispatch } from '../store';
import uiSettingService from '../services/uiSetting';
import { handleAxiosError } from '../../utils/errorHandler';
import { sharedSettingsSliceBase } from '../../shared/reducers';
import type { SettingsState } from '../../shared/reducers';
import { TFunction } from '../../shared/hooks';

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
    updUiSetting(state: SettingsState, action: UpdUiSettingAction) {
      const namespace = action.payload.uiSetting.name.split('.')[0];
      const newNamespaceState = state.uiSettings[namespace].map(
        uiSetting => uiSetting.id === action.payload.uiSetting.id ? action.payload.uiSetting : uiSetting
      );
      const newState = {
        ...state,
        uiSettings: {
          [namespace]: newNamespaceState,
          ...state.uiSettings
        },
      };
      return { ...newState };
    },
    ...sharedSettingsSliceBase.reducers
  }
});

export const { setLanguage, setUiSettings, updUiSetting } = settingsSlice.actions;

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
    } catch (e: unknown) {
      dispatch(handleAxiosError(e, t));
    }
  };
};

export { initUiSettings } from '../../shared/reducers/settingsReducer';

export default settingsSlice.reducer;