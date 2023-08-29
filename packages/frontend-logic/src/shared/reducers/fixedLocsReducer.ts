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

export type FixedLocState = FixedLocDT[];

const initialState: FixedLocState = [];

export const sharedFixedLocSliceBase = {
  name: 'fixedLocs',
  initialState,
  reducers: {
    setFixedLocs(state: FixedLocState, action: SetFixedLocAction) {
      return { ...action.payload.locs };
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