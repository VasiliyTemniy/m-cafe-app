import { apiBaseUrl } from '@m-cafe-app/shared-constants';
import { Image } from '../basic';

export const Cart = () => {

  return (
    <>
      <Image src={`${apiBaseUrl}/public/pictures/svg/cart.svg`} classNameAddon='svg cart'/>
      {/* TODO! */}
    </>
  );

};