import { createSlice } from '@reduxjs/toolkit';
import { handleAxiosError } from '../../utils/errorHandler';
import { AppDispatch } from '../store';
import fixedLocRouter from '../../shared/services/fixedLoc';
import { RequestOptions } from '../../types';
import { ApplicationError, FixedLocDT, isFixedLocDT, SafeyAny } from '@m-cafe-app/utils';
import { sharedFixedLocSliceBase } from '../../shared/reducers/fixedLocsReducer';
import type { FixedLocState } from '../../shared/reducers/fixedLocsReducer';

type UpdFixedLocAction = {
  payload: {
    loc: FixedLocDT,
  };
};

export type { FixedLocState };

/**
 * Slice taken from shared is appended with admin-specific reducers
 */
const fixedLocSlice = createSlice({
  ...sharedFixedLocSliceBase,
  reducers: {
    updFixedLoc(state: FixedLocState, action: UpdFixedLocAction) {
      const newState = state.map(loc => loc.id === action.payload.loc.id ? action.payload.loc : loc);
      return { ...newState };
    },
    ...sharedFixedLocSliceBase.reducers
  }
});

export const { setFixedLocs, updFixedLoc } = fixedLocSlice.actions;

/**
 * Updates many fixed locs in DB
 */
export const sendUpdFixedLocs = (updLocs: FixedLocDT[], options: RequestOptions) => {
  return async (dispatch: AppDispatch) => {
    try {
      const fixedLocs = await fixedLocRouter.updateManyLocs(updLocs, options);
      if (!Array.isArray(fixedLocs)) throw new ApplicationError('Server has sent wrong data', { current: fixedLocs });
      for (const fixedLoc of fixedLocs) {
        if (!isFixedLocDT(fixedLoc)) throw new ApplicationError('Server has sent wrong data', { all: fixedLocs, current: fixedLoc as SafeyAny });
      }
      dispatch(setFixedLocs({ locs: fixedLocs }));
    } catch (e: unknown) {
      dispatch(handleAxiosError(e));
    }
  };
};

export { initFixedLocs } from '../../shared/reducers/fixedLocsReducer';

export default fixedLocSlice.reducer;