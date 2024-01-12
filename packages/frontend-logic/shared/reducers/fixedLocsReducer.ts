import type { AppDispatch } from '../store';
import type  { TFunction } from '../hooks';
import type { FixedLocDT, SafeyAny } from '@m-market-app/utils';
import { createSlice } from '@reduxjs/toolkit';
import { handleAxiosError } from '../../utils/errorHandler';
import fixedLocService from '../services/fixedLoc';
import { ApplicationError, hasOwnProperty, isFixedLocDT } from '@m-market-app/utils';
import { Md5 } from 'ts-md5';
import { fixedLocFilter } from '@m-market-app/shared-constants';

type ParseFixedLocsAction = {
  payload: {
    fixedLocs: FixedLocDT[]
  };
};

/**
 * Fixed locs are unnested to namespaces by first part until dot in loc.name
 * key: string is namespace name
 */
export type ParsedFixedLocs = {
  [key: string]: FixedLocDT[]
};

export type FixedLocState = {
  dbFixedLocs: FixedLocDT[],
  parsedFixedLocs: ParsedFixedLocs,
  parsedFixedLocsHash: string;
};

const initialState: FixedLocState = {
  dbFixedLocs: [],
  parsedFixedLocs: {},
  parsedFixedLocsHash: ''
};

export const sharedFixedLocSliceBase = {
  name: 'fixedLocs',
  initialState,
  reducers: {
    parseFixedLocs(state: FixedLocState, action: ParseFixedLocsAction) {
      const parsedFixedLocs = {} as { [key: string]: FixedLocDT[] };
      for (const fixedLoc of action.payload.fixedLocs) {
        // For admin module, fixed locs filter is not applied to preserve falsy settings in state
        if (fixedLoc.locString.mainStr === fixedLocFilter && !process.env.FRONTEND_MODULE_ADMIN) continue;
        const firstDotIndex = fixedLoc.name.indexOf('.');
        const namespace = fixedLoc.name.slice(0, firstDotIndex);
        const shortLocName = fixedLoc.name.slice(firstDotIndex + 1);
        const parsedFixedLoc = { ...fixedLoc, name: shortLocName };
        if (hasOwnProperty(parsedFixedLocs, namespace))
          parsedFixedLocs[namespace] = [ ...parsedFixedLocs[namespace], parsedFixedLoc ];
        else
          parsedFixedLocs[namespace] = [ parsedFixedLoc ];
      }
      const parsedFixedLocsHash = Md5.hashStr(JSON.stringify(parsedFixedLocs));
      return { ...state, parsedFixedLocs, parsedFixedLocsHash };
    }
  }
};

const fixedLocSlice = createSlice({
  ...sharedFixedLocSliceBase
});

export const { parseFixedLocs } = fixedLocSlice.actions;

export const initFixedLocs = (t: TFunction) => {
  return async (dispatch: AppDispatch) => {
    try {
      const fixedLocs = await fixedLocService.getLocs();
      if (!Array.isArray(fixedLocs)) throw new ApplicationError('Server has sent wrong data', { current: fixedLocs });
      for (const fixedLoc of fixedLocs) {
        if (!isFixedLocDT(fixedLoc)) throw new ApplicationError('Server has sent wrong data', { all: fixedLocs, current: fixedLoc as SafeyAny });
      }
      dispatch(parseFixedLocs({ fixedLocs }));
    } catch (e: unknown) {
      dispatch(handleAxiosError(e, t));
    }
  };
};

export default fixedLocSlice.reducer;