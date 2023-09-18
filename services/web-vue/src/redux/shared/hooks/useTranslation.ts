import { useAppSelector } from "./reduxHooks";

export type TFunction = (locName: string) => string;

export const useTranslation = (): { t: TFunction } => {

  const selectedLanguage = useAppSelector(state => state.settings.language);
  const fixedLocs = useAppSelector(state => state.fixedLocs.locs);

  const t = (locName: string) => {
    const namespace = locName.split('.')[0];
    if (!fixedLocs[namespace]) return (`No translation found for ${locName}!`);
    const translationLoc = fixedLocs[namespace].find(loc => loc.name === locName);
    if (!translationLoc) return (`No translation found for ${locName}!`);
  
    const translation =
      selectedLanguage === 'alt' && translationLoc.locString.altStr ? translationLoc.locString.altStr :
      selectedLanguage === 'sec' && translationLoc.locString.secStr ? translationLoc.locString.secStr :
      translationLoc.locString.mainStr;

    return translation;
  };

  return { t };
};