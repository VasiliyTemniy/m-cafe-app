import axios from 'axios';
import { apiBaseUrl } from '../../utils/config';

const getIngredients = async () => {

  const config = { withCredentials: true };
  const { data: ingredients } = await axios.get<JSON>(
    `${apiBaseUrl}/api/ingredient`,
    config
  );

  return ingredients;
};

export default { getIngredients };