import { createSlice } from '@reduxjs/toolkit';
import { handleAxiosError } from '../../utils/errorHandler';
import { AppDispatch } from '../store';
import fixedLocRouter from '../../services/fixedLoc';
import { RequestOptions } from '../../types';
import { ApplicationError, FixedLocDT, isFixedLocDT, SafeyAny } from '@m-cafe-app/utils';

type SetFixedLocAction = {
  payload: {
    locs: FixedLocDT[],
  };
};

export type FixedLocState = FixedLocDT[];

const initialState: FixedLocState = [];

export const customerFixedLocSliceBase = {
  name: 'fixedLocs',
  initialState,
  reducers: {
    setFixedLocs(state: FixedLocState, action: SetFixedLocAction) {
      return { ...action.payload.locs };
    }
  }
};

const fixedLocSlice = createSlice({
  ...customerFixedLocSliceBase
});

export const { setFixedLocs } = fixedLocSlice.actions;

export const initFixedLocs = (options: RequestOptions) => {
  return async (dispatch: AppDispatch) => {
    try {
      const fixedLocs = await fixedLocRouter.getLocs(options);
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

export default fixedLocSlice.reducer;