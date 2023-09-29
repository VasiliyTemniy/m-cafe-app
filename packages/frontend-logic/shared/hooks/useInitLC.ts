import type { CommonProps } from '../../types';
import type { CSSProperties } from 'react';
import { useMemo } from 'react';
import { ApplicationError } from '@m-cafe-app/utils';
import { useUiSettings } from './useUiSettings';
import { isCSSPropertyKey } from '@m-cafe-app/shared-constants';
import { useAppSelector } from './reduxHooks';

interface UseInitLCProps extends CommonProps {
  componentType:
    'input' |
    'container' |
    'wrapper' |
    'tooltip' |
    'text' |
    'button' |
    'button-group' |
    'nav-item' |
    'notification' |
    'modal' |
    'svg-image' |
    'svg-button' |
    'switch' |
    'dropbox' |
    'table' |
    'image' |
    'scrollbar' |
    'layout',
  componentName: string,
  errorMessage?: string,
  variant?: string
}

export const useInitLC = ({
  componentType,
  componentName,
  classNameAddon,
  classNameOverride,
  errorMessage,
  variant
}: UseInitLCProps) => {

  const theme = useAppSelector(store => store.settings.theme);
  const uiSettingsHash = useAppSelector(store => store.settings.parsedUiSettingsHash);

  const { ui } = useUiSettings();

  // define lookup - componentName for layout components, componentType for basic components
  const lookup = componentType === 'layout'
    ? componentName
    : componentType;

  // baseVariant must have the most SCSS for web / inlineCSS for mobile
  const baseVariant = ui(`${lookup}-${theme}-baseVariant`);

  const baseVariantClassName = baseVariant.length > 0
    ? baseVariant[0].value
    : 'alpha';

  // same as baseVariant, but for color scheme
  const baseColorVariant = ui(`${lookup}-${theme}-baseColorVariant`);

  const baseColorVariantClassName = baseColorVariant.length > 0
    ? baseColorVariant[0].value
    : 'alpha-color';

  const uiSettingsClassnames = ui(`${lookup}-${theme}-classNames`);

  const uiSettingsInlineCSS = ui(`${lookup}-${theme}-inlineCSS`);

  const specialUiSettingsSet = new Set(
    ui(`${lookup}-${theme}-special`).map(uiSetting => uiSetting.name)
  );

  return useMemo(() => {
    
    /**
     * ClassName resolve block
     */
    let settingsClassNameAddon = '';

    // add all settings that are true
    for (const uiSettingClassName of uiSettingsClassnames) {
      settingsClassNameAddon += uiSettingClassName.name + ' ';
    }

    settingsClassNameAddon.trim();

    const classNameBase = classNameOverride
      ? classNameOverride
      : componentName;


    let className = classNameBase;

    if (variant) className = className + `-${variant}`;
    if (baseVariantClassName) className = className + ' ' + baseVariantClassName;
    if (baseColorVariantClassName) className = className + ' ' + baseColorVariantClassName;
    if (classNameAddon) className = className + ' ' + classNameAddon;
    if (settingsClassNameAddon) className = className + ' ' + settingsClassNameAddon;
    if (errorMessage) className = className + ' ' + 'error';

    /**
     * InlineCSS resolve block
     */
    const style = {} as CSSProperties;

    for (const uiSetting of uiSettingsInlineCSS) {
      const key = uiSetting.name;
      if (!isCSSPropertyKey(key)) throw new ApplicationError('Wrong key applied to inline CSS', { current: uiSetting, all: uiSettingsInlineCSS });
      style[key] = uiSetting.value;
    }

    /**
     * Component type-specific resolve block
     */
    let specific = undefined;

    switch (componentType) {

      case 'input':
      case 'dropbox':
        const userAgent = navigator.userAgent;
        const regex = /Firefox\/(\d+(\.\d+)?)/;
        const match = userAgent.match(regex);
        const firefoxVersion = match ? Number(match[1]) : null;
        const firefoxFix = firefoxVersion
          ? firefoxVersion > 108
          : componentName === 'input-time' || componentName === 'input-date';

        specific = {
          labelAsPlaceholder: specialUiSettingsSet.has('labelAsPlaceholder'),
          useBarBelow: specialUiSettingsSet.has('useBarBelow'),
          firefoxFix
        };
        break;

      case 'notification':
        specific = {
          hidden: specialUiSettingsSet.has('hidden'),
          animate: specialUiSettingsSet.has('animate')
        };
        break;

      default:
        break;
    }

    return {
      /**
       * Resolved className as sum of:
       * 
       * classNameOverride(props?) | componentName +
       * -${variant}(example: buttons) + baseVariantClassName +
       * classNameAddon(props?) + settingsClassNameAddon
       */
      className,
      style,
      /**
       * Component type-specific value
       */
      specific,
      /**
       * Base variant class name
       */
      baseVariant: baseVariantClassName,
      /**
       * Base color variant class name
       */
      baseColorVariant: baseColorVariantClassName
    };
  }, [
    theme,
    componentType,
    componentName,
    classNameAddon,
    classNameOverride,
    errorMessage,
    variant,
    uiSettingsHash
  ]);
};