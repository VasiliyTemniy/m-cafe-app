import { ApplicationError, isUiSettingDT, SafeyAny, UiSettingDT } from '@m-cafe-app/utils';
import { createSlice } from '@reduxjs/toolkit';
import { RequestOptions } from '../../types';
import { AppDispatch } from '../store';
import uiSettingRouter from '../services/uiSetting';
import { handleAxiosError } from '../../utils/errorHandler';


type SettingsActionSetLanguage = { payload: { language: 'main' | 'sec' | 'alt' } };

type SettingsActionSetUiSettings = { payload: { uiSettings: UiSettingDT[] } };


export type SettingsState = { uiSettings: UiSettingDT[], language: 'main' | 'sec' | 'alt' };

const initialState: SettingsState = { uiSettings: [], language: 'main' };

export const sharedSettingsSliceBase = {
  name: 'settings',
  initialState,
  reducers: {
    setLanguage: (state: SettingsState, action: SettingsActionSetLanguage): SettingsState => {
      return { ...state, language: action.payload.language};
    },
    setUiSettings: (state: SettingsState, action: SettingsActionSetUiSettings): SettingsState => {
      return { ...state, uiSettings: action.payload.uiSettings };
    }
  },  
};

const settingsSlice = createSlice({
  ...sharedSettingsSliceBase
});

export const { setLanguage, setUiSettings } = settingsSlice.actions;

export const initUiSettings = (options: RequestOptions) => {
  return async (dispatch: AppDispatch) => {
    try {
      const uiSettings = await uiSettingRouter.getUiSettings(options);
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

export default settingsSlice.reducer;