import { createSlice } from '@reduxjs/toolkit';
import { handleAxiosError } from '../../utils/errorHandler';
import { AppDispatch } from '../store';
import fixedLocService from '../services/fixedLoc';
import { ApplicationError, FixedLocDT, isFixedLocDT, SafeyAny } from '@m-cafe-app/utils';
import { sharedFixedLocSliceBase } from '../../shared/reducers';
import type { FixedLocState } from '../../shared/reducers';
import { TFunction } from '../../shared/hooks';

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
      const namespace = action.payload.loc.name.split('.')[0];
      const newNamespaceState = state[namespace].map(loc => loc.id === action.payload.loc.id ? action.payload.loc : loc);
      const newState = {
        ...state,
        [namespace]: newNamespaceState,
      };
      return { ...newState };
    },
    ...sharedFixedLocSliceBase.reducers
  }
});

export const { setFixedLocs, updFixedLoc } = fixedLocSlice.actions;

/**
 * Updates many fixed locs in DB
 */
export const sendUpdFixedLocs = (updLocsState: FixedLocState, t: TFunction) => {
  return async (dispatch: AppDispatch) => {
    try {
      const updLocs = [] as FixedLocDT[];
      for (const namespace in updLocsState) {
        for (const loc of updLocsState[namespace]) {
          updLocs.push(loc);
        }
      }
      const fixedLocs = await fixedLocService.updateManyLocs(updLocs);
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

export { initFixedLocs } from '../../shared/reducers/fixedLocsReducer';

export default fixedLocSlice.reducer;