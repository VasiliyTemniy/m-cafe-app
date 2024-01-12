import type { NewFixedLocBody, EditFixedLocBody, FixedLocDT, EditManyFixedLocBody } from '@m-market-app/utils';
import axios from 'axios';
import { apiBaseUrl } from '@m-market-app/shared-constants';
import sharedFixedLocService from '../../shared/services/fixedLoc';

/**
 * Should not ever be used. FixedLocs are fixed, only updatable. Delete this?
 */
const createLoc = async (newLoc: NewFixedLocBody) => {

  const reqBody: NewFixedLocBody = newLoc;

  const config = { headers: {'Content-Type': 'application/json'}, withCredentials: true };
  const { data: fixedLoc } = await axios.post<JSON>(
    `${apiBaseUrl}/fixed-loc`,
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
    `${apiBaseUrl}/fixed-loc/${locId}`,
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
    `${apiBaseUrl}/fixed-loc/all`,
    JSON.stringify(reqBody),
    config
  );

  return fixedLocs;
};

const resetLocs = async () => {

  const config = { withCredentials: true };
  const { data: fixedLocs } = await axios.get<JSON>(
    `${apiBaseUrl}/admin/fixed-loc/reset`,
    config
  );

  return fixedLocs;
};

const reserveLoc = async (id: number) => {
  
  const config = { withCredentials: true };
  const { data: fixedLoc } = await axios.put<JSON>(
    `${apiBaseUrl}/fixed-loc/reserve/${id}`,
    JSON.stringify({}),
    config
  );

  return fixedLoc;
};

export default { createLoc, updateLoc, updateManyLocs, resetLocs, reserveLoc, ...sharedFixedLocService };