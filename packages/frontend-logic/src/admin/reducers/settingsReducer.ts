import { ApplicationError, isUiSettingDT, SafeyAny, UiSettingDT } from '@m-cafe-app/utils';
import { createSlice } from '@reduxjs/toolkit';
import { RequestOptions } from '../../types';
import { AppDispatch } from '../store';
import uiSettingRouter from '../../shared/services/uiSetting';
import { handleAxiosError } from '../../utils/errorHandler';
import { sharedSettingsSliceBase } from '../../shared/reducers/settingsReducer';
import type { SettingsState } from '../../shared/reducers/settingsReducer';

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
      const newUiSettings = state.uiSettings.map(uiSetting => uiSetting.id === action.payload.uiSetting.id ? action.payload.uiSetting : uiSetting);
      return { ...state, uiSettings: newUiSettings };
    },
    ...sharedSettingsSliceBase.reducers
  }
});

export const { setLanguage, setUiSettings, updUiSetting } = settingsSlice.actions;

/**
 * Updates many ui settings in DB
 */
export const sendUpdUiSettings = (updUiSettings: UiSettingDT[], options: RequestOptions) => {
  return async (dispatch: AppDispatch) => {
    try {
      const uiSettings = await uiSettingRouter.updateManyUiSettings(updUiSettings, options);
      if (!Array.isArray(uiSettings)) throw new ApplicationError('Server has sent wrong data', { current: uiSettings });
      for (const uiSetting of uiSettings) {
        if (!isUiSettingDT(uiSetting)) throw new ApplicationError('Server has sent wrong data', { all: uiSettings, current: uiSetting as SafeyAny });
      }
      dispatch(setUiSettings({ uiSettings }));
    } catch (e: unknown) {
      dispatch(handleAxiosError(e));
    }
  };
};

export { initUiSettings } from '../../shared/reducers/settingsReducer';

export default settingsSlice.reducer;