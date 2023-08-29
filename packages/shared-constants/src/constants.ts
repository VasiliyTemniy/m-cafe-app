// If reg expressions are declared via ENV, they will be imported instead of these defaults. Just make sure to use double escape characters
// everywhere where you have one

export const usernameRegExp = process.env.USERNAME_REGEXP
  ? new RegExp(process.env.USERNAME_REGEXP)
  : /^[A-Za-z0-9]+(?:[ _-][A-Za-z0-9]+)*$/;
export const minUsernameLen = process.env.USERNAME_MINLEN
  ? Number(process.env.USERNAME_MINLEN)
  : 3;
export const maxUsernameLen = process.env.USERNAME_MAXLEN
  ? Number(process.env.USERNAME_MAXLEN)
  : 25;


export const nameRegExp = process.env.NAME_REGEXP
  ? new RegExp(process.env.NAME_REGEXP)
  : /^[A-Za-zА-Яа-я]+(?:[ ][A-Za-zА-Яа-я]+)*$/;
export const minNameLen = process.env.NAME_MINLEN
  ? Number(process.env.NAME_MINLEN)
  : 3;
export const maxNameLen = process.env.NAME_MAXLEN
  ? Number(process.env.NAME_MAXLEN)
  : 50;


export const phonenumberRegExp = process.env.PHONENUMBER_REGEXP
  ? new RegExp(process.env.PHONENUMBER_REGEXP)
  : /^((8|\+374|\+994|\+995|\+375|\+7|\+380|\+38|\+996|\+998|\+993)[- ]?)?\(?\d{3,5}\)?[- ]?\d{1}[- ]?\d{1}[- ]?\d{1}[- ]?\d{1}[- ]?\d{1}(([- ]?\d{1})?[- ]?\d{1})?$/;
export const minPhonenumberLen = process.env.PHONENUMBER_MINLEN
  ? Number(process.env.PHONENUMBER_MINLEN)
  : 8;
export const maxPhonenumberLen = process.env.PHONENUMBER_MAXLEN
  ? Number(process.env.PHONENUMBER_MAXLEN)
  : 26;


export const emailRegExp = process.env.EMAIL_REGEXP
  ? new RegExp(process.env.EMAIL_REGEXP)
  : /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Zа-яА-Я\-0-9]+\.)+[a-zA-Zа-яА-Я]{2,}))$/;
export const minEmailLen = process.env.EMAIL_MINLEN
  ? Number(process.env.EMAIL_MINLEN)
  : 6;
export const maxEmailLen = process.env.EMAIL_MAXLEN
  ? Number(process.env.EMAIL_MAXLEN)
  : 50;


// Used only for tests
export const dateRegExp = process.env.DATE_REGEXP
  ? new RegExp(process.env.DATE_REGEXP)
  : /^\d{4}(-\d\d(-\d\d(T\d\d:\d\d(:\d\d)?(\.\d+)?(([+-]\d\d:\d\d)|Z)?)?)?)?$/;


export const passwordRegExp = process.env.NAME_REGEXP
  ? new RegExp(process.env.NAME_REGEXP)
  : /^(?=.*[0-9!@#$%^&*])[a-zA-Z0-9!@#$%^&*]*$/;
export const minPasswordLen = process.env.PASSWORD_MINLEN
  ? Number(process.env.PASSWORD_MINLEN)
  : 5;
export const maxPasswordLen = process.env.PASSWORD_MAXLEN
  ? Number(process.env.PASSWORD_MAXLEN)
  : 100;


export const regionRegExp = process.env.REGION_REGEXP
  ? new RegExp(process.env.REGION_REGEXP)
  : /^[А-Яа-я0-9]+(?:[ _-][А-Яа-я0-9]+)*$/;
export const minRegionLen = process.env.REGION_MINLEN
  ? Number(process.env.REGION_MINLEN)
  : 3;
export const maxRegionLen = process.env.REGION_MAXLEN
  ? Number(process.env.REGION_MAXLEN)
  : 50;


export const districtRegExp = process.env.DISTRICT_REGEXP
  ? new RegExp(process.env.DISTRICT_REGEXP)
  : /^[А-Яа-я0-9]+(?:[ _-][А-Яа-я0-9]+)*$/;
export const minDistrictLen = process.env.DISTRICT_MINLEN
  ? Number(process.env.DISTRICT_MINLEN)
  : 3;
export const maxDistrictLen = process.env.DISTRICT_MAXLEN
  ? Number(process.env.DISTRICT_MAXLEN)
  : 50;


export const cityRegExp = process.env.CITY_REGEXP
  ? new RegExp(process.env.CITY_REGEXP)
  : /^[А-Яа-я0-9]+(?:[ _-][А-Яа-я0-9]+)*$/;
export const minCityLen = process.env.CITY_MINLEN
  ? Number(process.env.CITY_MINLEN)
  : 3;
export const maxCityLen = process.env.CITY_MAXLEN
  ? Number(process.env.CITY_MAXLEN)
  : 50;


export const streetRegExp = process.env.STREET_REGEXP
  ? new RegExp(process.env.STREET_REGEXP)
  : /^[А-Яа-я0-9]+(?:[ _-][А-Яа-я0-9]+)*$/;
export const minStreetLen = process.env.STREET_MINLEN
  ? Number(process.env.STREET_MINLEN)
  : 3;
export const maxStreetLen = process.env.STREET_MAXLEN
  ? Number(process.env.STREET_MAXLEN)
  : 50;


export const houseRegExp = process.env.HOUSE_REGEXP
  ? new RegExp(process.env.HOUSE_REGEXP)
  : /^[А-Яа-я0-9]+(?:[ _\/\\-][А-Яа-я0-9]+)*$/;
export const minHouseLen = process.env.HOUSE_MINLEN
  ? Number(process.env.HOUSE_MINLEN)
  : 1;
export const maxHouseLen = process.env.HOUSE_MAXLEN
  ? Number(process.env.HOUSE_MAXLEN)
  : 20;


export const entranceRegExp = process.env.ENTRANCE_REGEXP
  ? new RegExp(process.env.ENTRANCE_REGEXP)
  : /^[А-Яа-я0-9]+(?:[ _\/\\-][А-Яа-я0-9]+)*$/;
export const minEntranceLen = process.env.ENTRANCE_MINLEN
  ? Number(process.env.ENTRANCE_MINLEN)
  : 3;
export const maxEntranceLen = process.env.ENTRANCE_MAXLEN
  ? Number(process.env.ENTRANCE_MAXLEN)
  : 20;


export const minFloorLen = process.env.FLOOR_MINLEN
  ? Number(process.env.FLOOR_MINLEN)
  : 1;
export const maxFloorLen = process.env.FLOOR_MAXLEN
  ? Number(process.env.FLOOR_MAXLEN)
  : 3;


export const flatRegExp = process.env.FLAT_REGEXP
  ? new RegExp(process.env.FLAT_REGEXP)
  : /^[А-Яа-я0-9]+(?:[ _\/\\-][А-Яа-я0-9]+)*$/;
export const minFlatLen = process.env.FLAT_MINLEN
  ? Number(process.env.FLAT_MINLEN)
  : 1;
export const maxFlatLen = process.env.FLAT_MAXLEN
  ? Number(process.env.FLAT_MAXLEN)
  : 20;


export const entranceKeyRegExp = process.env.ENTRANCE_KEY_REGEXP
  ? new RegExp(process.env.ENTRANCE_KEY_REGEXP)
  : /^[А-Яа-я0-9]+(?:[ _\/\\-][А-Яа-я0-9]+)*$/;
export const minEntranceKeyLen = process.env.ENTRANCE_KEY_MINLEN
  ? Number(process.env.ENTRANCE_KEY_MINLEN)
  : 1;
export const maxEntranceKeyLen = process.env.ENTRANCE_KEY_MAXLEN
  ? Number(process.env.ENTRANCE_KEY_MAXLEN)
  : 20;


export const possibleUserRights = ['user', 'manager', 'admin', 'disabled'];