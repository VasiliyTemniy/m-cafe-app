import type { MouseEvent } from "react";
import { useAppDispatch, useAppSelector } from "@m-cafe-app/frontend-logic/shared/hooks";
import { setLanguage } from "@m-cafe-app/frontend-logic/shared/reducers";
import { Dropbox } from "../basic";
import { collapseExpanded } from "@m-cafe-app/frontend-logic/utils";

interface LanguageBoxProps {
  languages: string[];
  languagesTNode: string;
}

export const LanguageBox = ({
  languages,
  languagesTNode
}: LanguageBoxProps) => {

  const dispatch = useAppDispatch();

  const selectedLanguage = useAppSelector(state => state.settings.language);

  const handleChooseLanguage = (e: MouseEvent<HTMLDivElement>) => {
    const chosenLanguage = e.currentTarget.id;
    if (chosenLanguage !== 'main' && chosenLanguage !== 'sec' && chosenLanguage !== 'alt') return;
    dispatch(setLanguage(chosenLanguage));
    collapseExpanded();
  };

  return (
    <Dropbox
      tNode={languagesTNode}
      options={languages}
      currentOption={selectedLanguage}
      onChoose={handleChooseLanguage}
      classNameAddon='small'
      label=''
    />
  );
};