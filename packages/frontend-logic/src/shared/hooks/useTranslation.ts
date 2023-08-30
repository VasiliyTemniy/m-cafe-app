import { useCallback } from 'react';
import { ApplicationError } from "@m-cafe-app/utils";
import { useAppSelector } from "../../customer/hooks/reduxHooks";

export type TFunction = (locName: string) => string;

export const useTranslation = (): { t: TFunction } => {

  const selectedLanguage = useAppSelector(state => state.settings.language);

  const t = useCallback((locName: string) => {
    const namespace = locName.split('.')[0];
    const translationLoc = useAppSelector(state => state.fixedLocs[namespace].find(loc => loc.name === locName));
    if (!translationLoc) throw new ApplicationError(`No translation found for ${locName}`);
  
    const translation =
      selectedLanguage === 'alt' && translationLoc.locString.altStr ? translationLoc.locString.altStr :
      selectedLanguage === 'sec' && translationLoc.locString.secStr ? translationLoc.locString.secStr :
      translationLoc.locString.mainStr;

    return translation;
  }, [selectedLanguage]);

  return { t };
};