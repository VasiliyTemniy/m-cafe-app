import axios from 'axios';
import { apiBaseUrl } from '../utils/config';

const pingApi = async () => {

  const config = { headers: { 'Content-Type': 'application/json' } };
  const { data: res } = await axios.get<JSON>(
    `${apiBaseUrl}/testing/ping`,
    config
  );

  return res;
};

export default { pingApi };