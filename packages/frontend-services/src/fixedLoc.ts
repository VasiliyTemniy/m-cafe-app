import axios from 'axios';
import { NewFixedLocBody, EditFixedLocBody } from '@m-cafe-app/utils';
import { RequestOptions } from './types/requestOptions';

const createLoc = async (newLoc: NewFixedLocBody, options: RequestOptions) => {

  const config = { headers: {'Content-Type': 'application/json'} };
  const { data: fixedLoc } = await axios.post<JSON>(
    `${options.apiBaseUrl}/api/fixed-loc`,
    JSON.stringify(newLoc),
    config
  );

  return fixedLoc;
};

const updateLoc = async (updLoc: EditFixedLocBody, locId: number, options: RequestOptions) => {

  const config = { headers: {'Content-Type': 'application/json'}, withCredentials: true };
  const { data: fixedLoc } = await axios.put<JSON>(
    `${options.apiBaseUrl}/api/fixed-loc/${locId}`,
    JSON.stringify(updLoc),
    config
  );

  return fixedLoc;
};

const getLocs = async (options: RequestOptions) => {

  const config = { withCredentials: true };
  const { data: fixedLocs } = await axios.get<JSON>(
    `${options.apiBaseUrl}/api/fixed-loc`,
    config
  );

  return fixedLocs;
};

const deleteLoc = async (locId: number, options: RequestOptions) => {

  const config = { withCredentials: true };
  await axios.delete<JSON>(
    `${options.apiBaseUrl}/api/fixed-loc/${locId}`,
    config
  );

};

export default { createLoc, updateLoc, getLocs, deleteLoc };