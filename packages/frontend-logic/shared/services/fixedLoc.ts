import axios from 'axios';
import { apiBaseUrl } from '@m-cafe-app/shared-constants';


const getLocs = async () => {

  const { data: fixedLocs } = await axios.get<JSON>(
    `${apiBaseUrl}/api/fixed-loc`
  );

  return fixedLocs;
};

export default { getLocs };