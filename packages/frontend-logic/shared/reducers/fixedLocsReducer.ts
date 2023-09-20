import type { AppDispatch } from '../store';
import type  { TFunction } from '../hooks';
import type { FixedLocDT, SafeyAny } from '@m-cafe-app/utils';
import { createSlice } from '@reduxjs/toolkit';
import { handleAxiosError } from '../../utils/errorHandler';
import fixedLocService from '../services/fixedLoc';
import { ApplicationError, hasOwnProperty, isFixedLocDT } from '@m-cafe-app/utils';
import { Md5 } from 'ts-md5';

type SetFixedLocAction = {
  payload: {
    locs: FixedLocDT[],
  };
};

/**
 * Fixed locs are unnested to namespaces by first part until dot in loc.name
 * key: string is namespace name
 */
export type FixedLocState = {
  locs: {
    [key: string]: FixedLocDT[]
  },
  locsHash: string;
};

const initialState: FixedLocState = { locs: {}, locsHash: '' };

export const sharedFixedLocSliceBase = {
  name: 'fixedLocs',
  initialState,
  reducers: {
    setFixedLocs(state: FixedLocState, action: SetFixedLocAction) {
      const newState = { locs: {}, locsHash: '' } as FixedLocState;
      for (const loc of action.payload.locs) {
        const namespace = loc.name.split('.')[0];
        if (hasOwnProperty(newState.locs, namespace))
          newState.locs = { ...newState.locs, [namespace]: [...newState.locs[namespace], loc] };
        else
          newState.locs = { ...newState.locs, [namespace]: [loc] };
      }
      const locsHash = Md5.hashStr(JSON.stringify(newState.locs));
      return { ...newState, locsHash };
    }
  }
};

const fixedLocSlice = createSlice({
  ...sharedFixedLocSliceBase
});

export const { setFixedLocs } = fixedLocSlice.actions;

export const initFixedLocs = (t: TFunction) => {
  return async (dispatch: AppDispatch) => {
    try {
      const fixedLocs = await fixedLocService.getLocs();
      if (!Array.isArray(fixedLocs)) throw new ApplicationError('Server has sent wrong data', { current: fixedLocs });
      for (const fixedLoc of fixedLocs) {
        if (!isFixedLocDT(fixedLoc)) throw new ApplicationError('Server has sent wrong data', { all: fixedLocs, current: fixedLoc as SafeyAny });
      }
      dispatch(setFixedLocs({ locs: fixedLocs }));
    } catch (e: unknown) {
      dispatch(handleAxiosError(e, t));
    }
  };
};

export default fixedLocSlice.reducer;