import type { MouseEvent } from "react";
import { useAppDispatch, useAppSelector, useInitLC, useTranslation } from "@m-cafe-app/frontend-logic/shared/hooks";
import { setTheme } from "@m-cafe-app/frontend-logic/shared/reducers";
import { Switch } from "../basic";
import { fixedLocFilter } from "@m-cafe-app/shared-constants";
import { LanguageBox } from "./LanguageBox";

export const Header = () => {

  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const selectedTheme = useAppSelector(state => state.settings.theme);

  const { className, style } = useInitLC({
    componentType: 'layout',
    componentName: 'header'
  });

  const languagesTNode = 'main.fullLanguageNames';
  const languages = [ 'main' ];
  if (t(`${languagesTNode}.sec`) !== fixedLocFilter) languages.push('sec');
  if (t(`${languagesTNode}.alt`) !== fixedLocFilter) languages.push('alt');

  const handleThemeSwitchClick = (e: MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (selectedTheme === 'light') dispatch(setTheme('dark'));
    else dispatch(setTheme('light'));
  };

  return (
    <header className={className} style={style} id='app-header'>
      <div className='header-left'>

      </div>
      <div className='header-right'>
        {languages.length > 1 && 
          <LanguageBox languages={languages} languagesTNode={languagesTNode}/>
        }
        <Switch
          checked={selectedTheme === 'light'}
          id='theme-selector'
          onClick={handleThemeSwitchClick}
          textLeft={t('main.theme.light')}
          textRight={t('main.theme.dark')}
        />
      </div>
    </header>
  );
};