import type { AppDispatch } from '../store';
import type { TFunction } from '../../shared/hooks';
import type { FixedLocDT, SafeyAny } from '@m-market-app/utils';
import type { FixedLocState, ParsedFixedLocs } from '../../shared/reducers';
import { createSlice } from '@reduxjs/toolkit';
import { handleAxiosError } from '../../utils/errorHandler';
import fixedLocService from '../services/fixedLoc';
import { ApplicationError, isFixedLocDT } from '@m-market-app/utils';
import { notify, sharedFixedLocSliceBase } from '../../shared/reducers';
import { Md5 } from 'ts-md5';

type SetDbFixedLocsAction = {
  payload: {
    fixedLocs: FixedLocDT[],
  };
};

type UpdDbFixedLocAction = {
  payload: {
    fixedLoc: FixedLocDT
  };
};

type UpdParsedFixedLocAction = {
  payload: {
    fixedLoc: FixedLocDT,
    namespace: string
  };
};

export type { FixedLocState };

/**
 * Slice taken from shared is appended with admin-specific reducers
 */
const fixedLocSlice = createSlice({
  ...sharedFixedLocSliceBase,
  reducers: {
    setDbFixedLocs(state: FixedLocState, action: SetDbFixedLocsAction) {
      return { ...state, dbFixedLocs: action.payload.fixedLocs };
    },
    /**
     * Updates `db` fixedLocs state, does not send anything to backend,
     * does not update parsedFixedLocs state
     */
    updDbFixedLoc(state: FixedLocState, action: UpdDbFixedLocAction) {
      const updDbFixedLocs = state.dbFixedLocs.map(
        fixedLoc => fixedLoc.id === action.payload.fixedLoc.id ? action.payload.fixedLoc : fixedLoc
      );
      return { ...state, dbFixedLocs: updDbFixedLocs };
    },
    /**
     * Updates `parsed` fixedLocs state, does not send anything to backend,
     * does not update dbFixedLocs state
     */
    updParsedFixedLoc(state: FixedLocState, action: UpdParsedFixedLocAction) {
      const namespace = action.payload.namespace;
      const newFixedLocsNamespaceState = state.parsedFixedLocs[namespace].map(
        fixedLoc => fixedLoc.id === action.payload.fixedLoc.id ? action.payload.fixedLoc : fixedLoc
      );
      const updParsedFixedLocs = {
        ...state.parsedFixedLocs,
        [namespace]: newFixedLocsNamespaceState
      };
      const locsHash = Md5.hashStr(JSON.stringify(updParsedFixedLocs));
      return { ...state, parsedFixedLocs: updParsedFixedLocs, locsHash };
    },
    ...sharedFixedLocSliceBase.reducers
  }
});

export const { setDbFixedLocs, parseFixedLocs, updDbFixedLoc, updParsedFixedLoc } = fixedLocSlice.actions;

/**
 * Updates many fixed locs in DB
 * 
 * Server response is used to reinit fixed locs state
 */
export const sendUpdFixedLocs = (parsedFixedLocs: ParsedFixedLocs, t: TFunction) => {
  return async (dispatch: AppDispatch) => {
    try {
      const updFixedLocs = [] as FixedLocDT[];
      for (const namespace in parsedFixedLocs) {
        for (const fixedLoc of parsedFixedLocs[namespace]) {
          const dbFixedLocName = namespace + '.' + fixedLoc.name;
          updFixedLocs.push({ ...fixedLoc, name: dbFixedLocName });
        }
      }
      const fixedLocs = await fixedLocService.updateManyLocs(updFixedLocs);
      if (!Array.isArray(fixedLocs)) throw new ApplicationError('Server has sent wrong data', { current: fixedLocs });
      for (const fixedLoc of fixedLocs) {
        if (!isFixedLocDT(fixedLoc)) throw new ApplicationError('Server has sent wrong data', { all: fixedLocs, current: fixedLoc as SafeyAny });
      }
      dispatch(setDbFixedLocs({ fixedLocs }));
      dispatch(parseFixedLocs({ fixedLocs }));
      dispatch(notify(t('alert.fixedLocSuccess'), 'success'));
    } catch (e: unknown) {
      dispatch(handleAxiosError(e, t));
    }
  };
};

/**
 * Sends a request to reset the fixed localizations.
 */
export const sendResetFixedLocs = (t: TFunction) => {
  return async (dispatch: AppDispatch) => {
    try {
      const fixedLocs = await fixedLocService.resetLocs();
      if (!Array.isArray(fixedLocs)) throw new ApplicationError('Server has sent wrong data', { current: fixedLocs });
      for (const fixedLoc of fixedLocs) {
        if (!isFixedLocDT(fixedLoc)) throw new ApplicationError('Server has sent wrong data', { all: fixedLocs, current: fixedLoc as SafeyAny });
      }
      dispatch(setDbFixedLocs({ fixedLocs }));
      dispatch(parseFixedLocs({ fixedLocs }));
      dispatch(notify(t('alert.fixedLocSuccess'), 'success'));
    } catch (e: unknown) {
      dispatch(handleAxiosError(e, t));
    }
  };
};

export const sendReserveFixedLoc = (id: number, t: TFunction) => {
  return async (dispatch: AppDispatch) => {
    try {
      const fixedLoc = await fixedLocService.reserveLoc(id);
      if (!isFixedLocDT(fixedLoc)) throw new ApplicationError('Server has sent wrong data', { current: fixedLoc });
      dispatch(updDbFixedLoc({ fixedLoc }));
      const firstDotIndex = fixedLoc.name.indexOf('.');
      const namespace = fixedLoc.name.slice(0, firstDotIndex);
      const shortLocName = fixedLoc.name.slice(firstDotIndex + 1);
      const parsedFixedLoc = { ...fixedLoc, name: shortLocName };
      dispatch(updParsedFixedLoc({ fixedLoc: parsedFixedLoc, namespace }));
      dispatch(notify(t('alert.fixedLocSuccess'), 'success'));
    } catch (e: unknown) {
      dispatch(handleAxiosError(e, t));
    }
  };
};

/**
 * Difference between initFixedLocs from shared folder and initAdminFixedLocs - 
 * admin's init sets dbFixedLocs state in addition to parsed fixed locs state
 */
export const initAdminFixedLocs = (t: TFunction) => {
  return async (dispatch: AppDispatch) => {
    try {
      const fixedLocs = await fixedLocService.getLocs();
      if (!Array.isArray(fixedLocs)) throw new ApplicationError('Server has sent wrong data', { current: fixedLocs });
      for (const fixedLoc of fixedLocs) {
        if (!isFixedLocDT(fixedLoc)) throw new ApplicationError('Server has sent wrong data', { all: fixedLocs, current: fixedLoc as SafeyAny });
      }
      dispatch(setDbFixedLocs({ fixedLocs }));
      dispatch(parseFixedLocs({ fixedLocs }));
    } catch (e: unknown) {
      dispatch(handleAxiosError(e, t));
    }
  };
};

export default fixedLocSlice.reducer;