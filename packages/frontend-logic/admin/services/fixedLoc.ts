import axios from 'axios';
import type { NewFixedLocBody, EditFixedLocBody, FixedLocDT, EditManyFixedLocBody } from '@m-cafe-app/utils';
import { apiBaseUrl } from '@m-cafe-app/shared-constants';
import sharedFixedLocService from '../../shared/services/fixedLoc';

/**
 * Should not ever be used. FixedLocs are fixed, only updatable. Delete this?
 */
const createLoc = async (newLoc: NewFixedLocBody) => {

  const reqBody: NewFixedLocBody = newLoc;

  const config = { headers: {'Content-Type': 'application/json'}, withCredentials: true };
  const { data: fixedLoc } = await axios.post<JSON>(
    `${apiBaseUrl}/api/fixed-loc`,
    JSON.stringify(reqBody),
    config
  );

  return fixedLoc;
};

/**
 * Not recommended, better to update many at once
 */
const updateLoc = async (updLoc: EditFixedLocBody, locId: number) => {

  const reqBody: EditFixedLocBody = updLoc;

  const config = { headers: {'Content-Type': 'application/json'}, withCredentials: true };
  const { data: fixedLoc } = await axios.put<JSON>(
    `${apiBaseUrl}/api/fixed-loc/${locId}`,
    JSON.stringify(reqBody),
    config
  );

  return fixedLoc;
};

/**
 * Recommended to update fixed locs
 */
const updateManyLocs = async (updLocs: FixedLocDT[]) => {

  const reqBody: EditManyFixedLocBody = { updLocs };

  const config = { headers: {'Content-Type': 'application/json'}, withCredentials: true };
  const { data: fixedLocs } = await axios.put<JSON>(
    `${apiBaseUrl}/api/fixed-loc/all`,
    JSON.stringify(reqBody),
    config
  );

  return fixedLocs;
};

/**
 * Should not ever be used? Delete this?
 */
const deleteLoc = async (locId: number) => {

  const config = { withCredentials: true };
  await axios.delete<JSON>(
    `${apiBaseUrl}/api/fixed-loc/${locId}`,
    config
  );

};

export default { createLoc, updateLoc, updateManyLocs, deleteLoc, ...sharedFixedLocService };