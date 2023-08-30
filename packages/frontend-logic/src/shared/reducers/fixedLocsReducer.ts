import { createSlice } from '@reduxjs/toolkit';
import { handleAxiosError } from '../../utils/errorHandler';
import { AppDispatch } from '../store';
import fixedLocService from '../services/fixedLoc';
import { ApplicationError, FixedLocDT, isFixedLocDT, SafeyAny } from '@m-cafe-app/utils';
import { TFunction } from '../hooks/useTranslation';

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
  [key: string]: FixedLocDT[]
};

const initialState: FixedLocState = {};

export const sharedFixedLocSliceBase = {
  name: 'fixedLocs',
  initialState,
  reducers: {
    setFixedLocs(state: FixedLocState, action: SetFixedLocAction) {
      const newState = {} as FixedLocState;
      for (const loc of action.payload.locs) {
        const namespace = loc.name.split('.')[0];
        newState[namespace].push(loc);
      }
      return { ...newState };
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