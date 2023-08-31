import { TFunction } from "../shared/hooks";

export const autoCompleteTranslatedArray = (
  options: string[],
  strToCheck: string,
  t: TFunction,
  tNode: string
) => {

  if (strToCheck === '') return options;

  const result: string[] = [];

  for (const item of options) {

    const localizedItem = t(`${tNode}.${item}`);

    if (localizedItem.toLowerCase() === strToCheck.toLowerCase()) return options;
    
    for (let i = 0; i < localizedItem.length - strToCheck.length; i++) {
      if (localizedItem.slice(i, i + strToCheck.length).toLowerCase() === strToCheck.toLowerCase()) {
        result.push(item);
        break;
      }
    }
  }

  if (result.length === 0) return options;

  return result;
};

export const autoCompleteArray = (
  options: string[],
  strToCheck: string
) => {

  if (strToCheck === '') return options;

  const result: string[] = [];

  for (const item of options) {

    if (item.toLowerCase() === strToCheck.toLowerCase()) return options;
    
    for (let i = 0; i < item.length - strToCheck.length; i++) {
      if (item.slice(i, i + strToCheck.length).toLowerCase() === strToCheck.toLowerCase()) {
        result.push(item);
        break;
      }
    }
  }

  if (result.length === 0) return options;

  return result;
};