import { TFunction } from "../shared/hooks";

/**
 * Autocomplete from options to array where every element contains strToCheck
 * @param options options to check
 * @param strToCheck string to check
 * @param t translation function, optional
 * @param tNode translation node, optional
 * @returns array of options that contain strToCheck
 */
export const autoCompleteArray = (
  options: string[],
  strToCheck: string,
  t?: TFunction,
  tNode?: string
) => {

  if (!strToCheck) return options;

  const result: string[] = [];

  for (const item of options) {

    const itemToCheck = t && tNode
      ? t(`${tNode}.${item}`)
      : item;

    if (itemToCheck.toLowerCase() === strToCheck.toLowerCase()) return options;
    
    for (let i = 0; i < itemToCheck.length - strToCheck.length; i++) {
      if (itemToCheck.slice(i, i + strToCheck.length).toLowerCase() === strToCheck.toLowerCase()) {
        result.push(itemToCheck);
        break;
      }
    }
  }

  if (result.length === 0) return options;

  return result;
};