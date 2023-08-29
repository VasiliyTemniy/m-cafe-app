import axios from 'axios';
import { apiBaseUrl } from '../../utils/config';


const getUiSettings = async () => {

  const { data: fixedUiSettings } = await axios.get<JSON>(
    `${apiBaseUrl}/api/ui-setting`
  );

  return fixedUiSettings;
};

export default { getUiSettings };