import { createSlice } from '@reduxjs/toolkit';
import { handleAxiosError } from '../../utils/errorHandler';
import { AppDispatch } from '../store';
import fixedLocRouter from '@m-cafe-app/frontend-services/src/fixedLoc';
import { RequestOptions } from '@m-cafe-app/frontend-services/src/types/requestOptions';
import { ApplicationError, FixedLocDT, isFixedLocDT, SafeyAny } from '@m-cafe-app/utils';

type SetFixedLocAction = {
  payload: {
    locs: FixedLocDT[],
  };
};

type FixedLocState = {
  locs: FixedLocDT[]
};

const initialState: FixedLocState = {
  locs: []
};

const fixedLocSlice = createSlice({
  name: 'fixedLocs',
  initialState,
  reducers: {
    setFixedLocs(state: FixedLocState, action: SetFixedLocAction) {
      return { ...action.payload };
    },
    hideFixedLocs(state: FixedLocState) {
      return { ...state, timeoutId: 0 };
    },
    clearFixedLocs() {
      return { ...initialState };
    }
  },
});

export const { setFixedLocs, hideFixedLocs, clearFixedLocs } = fixedLocSlice.actions;

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