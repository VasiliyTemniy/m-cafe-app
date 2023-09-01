import axios from 'axios';
import { apiBaseUrl } from '@m-cafe-app/shared-constants';

const getIngredients = async () => {

  const config = { withCredentials: true };
  const { data: ingredients } = await axios.get<JSON>(
    `${apiBaseUrl}/api/ingredient`,
    config
  );

  return ingredients;
};

export default { getIngredients };