import { useCallback } from 'react';
import { useAppSelector } from './reduxHooks';

export type TFunction = (locName: string) => string;

export const useTranslation = (): { t: TFunction } => {

  const selectedLanguage = useAppSelector(state => state.settings.language);
  const fixedLocs = useAppSelector(state => state.fixedLocs.parsedFixedLocs);
  const fixedLocsHash = useAppSelector(state => state.fixedLocs.parsedFixedLocsHash);

  const t = useCallback((locName: string) => {
    const firstDotIndex = locName.indexOf('.');
    const namespace = locName.slice(0, firstDotIndex);
    const shortLocName = locName.slice(firstDotIndex + 1);
    if (!fixedLocs[namespace]) return (`No translation found for ${locName}!`);
    const translationLoc = fixedLocs[namespace].find(loc => loc.name === shortLocName);
    if (!translationLoc) return (`No translation found for ${locName}!`);
  
    const translation =
      selectedLanguage === 'alt' && translationLoc.locString.altStr ? translationLoc.locString.altStr :
      selectedLanguage === 'sec' && translationLoc.locString.secStr ? translationLoc.locString.secStr :
      translationLoc.locString.mainStr;

    return translation;
  }, [selectedLanguage, fixedLocsHash]);

  return { t };
};