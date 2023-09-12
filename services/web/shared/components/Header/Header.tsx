import { MouseEvent } from "react";
import { useAppDispatch, useAppSelector, useInitLC, useTranslation } from "@m-cafe-app/frontend-logic/shared/hooks";
import { setLanguage, setTheme } from "@m-cafe-app/frontend-logic/shared/reducers";
import { Dropbox, Switch, Container } from "../basic";
import { collapseExpanded } from "@m-cafe-app/frontend-logic/utils";
import { fixedLocFilter } from "@m-cafe-app/shared-constants";

export const Header = () => {

  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const selectedLanguage = useAppSelector(state => state.settings.language);
  const selectedTheme = useAppSelector(state => state.settings.theme);

  const { className, style } = useInitLC({
    componentType: 'layout',
    componentName: 'header'
  });

  const languagesTNode = 'main.fullLanguageNames';
  const languages = [ 'main' ];
  if (t(`${languagesTNode}.sec`) !== fixedLocFilter) languages.push('sec');
  if (t(`${languagesTNode}.alt`) !== fixedLocFilter) languages.push('alt');

  const handleChooseLanguage = (e: MouseEvent<HTMLDivElement>) => {
    const chosenLanguage = e.currentTarget.id;
    if (chosenLanguage !== 'main' && chosenLanguage !== 'sec' && chosenLanguage !== 'alt') return;
    dispatch(setLanguage(chosenLanguage));
    collapseExpanded();
  };

  const handleThemeSwitchClick = () => {
    if (selectedTheme === 'light') dispatch(setTheme('dark'));
    else dispatch(setTheme('light'));
  };

  return (
    <header className={className} style={style}>
      <Container classNameAddon='header-left'>

      </Container>
      <Container classNameAddon='header-right'>
        <Dropbox
          tNode={languagesTNode}
          options={languages}
          currentOption={selectedLanguage}
          onChoose={handleChooseLanguage}
          classNameAddon='small'
          label=''
        />
        <Switch
          checked={selectedTheme === 'light'}
          id='theme-selector'
          onClick={handleThemeSwitchClick}
          textLeft={t('main.theme.light')}
          textRight={t('main.theme.dark')}
        />
      </Container>
    </header>
  );
};