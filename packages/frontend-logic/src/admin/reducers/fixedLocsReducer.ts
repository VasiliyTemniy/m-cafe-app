import { createSlice } from '@reduxjs/toolkit';
import { handleAxiosError } from '../../utils/errorHandler';
import { AppDispatch } from '../store';
import fixedLocRouter from '../../services/fixedLoc';
import { RequestOptions } from '../../types';
import { ApplicationError, EditFixedLocBody, FixedLocDT, isFixedLocDT, SafeyAny } from '@m-cafe-app/utils';
import { customerFixedLocSliceBase } from '../../customer/reducers/fixedLocsReducer';
import type { FixedLocState } from '../../customer/reducers/fixedLocsReducer';

type UpdFixedLocAction = {
  payload: {
    loc: FixedLocDT,
  };
};

export type { FixedLocState };

/**
 * Slice taken from customer is appended with admin-specific reducers
 */
const fixedLocSlice = createSlice({
  ...customerFixedLocSliceBase,
  reducers: {
    updFixedLoc(state: FixedLocState, action: UpdFixedLocAction) {
      const newState = state.map(loc => loc.id === action.payload.loc.id ? action.payload.loc : loc);
      return { ...newState };
    },
    ...customerFixedLocSliceBase.reducers
  }
});

export const { setFixedLocs, updFixedLoc } = fixedLocSlice.actions;

export const sendUpdFixedLoc = (updLoc: EditFixedLocBody, locId: number, options: RequestOptions) => {
  return async (dispatch: AppDispatch) => {
    try {
      const fixedLocs = await fixedLocRouter.updateLoc(updLoc, locId, options);
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

export { initFixedLocs } from '../../customer/reducers/fixedLocsReducer';

export default fixedLocSlice.reducer;