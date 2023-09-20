import type { CommonProps, LCSpecificValue } from '../../types';
import type { CSSProperties } from "react";
import { useMemo } from 'react';
import { ApplicationError } from "@m-cafe-app/utils";
import { useUiSettings } from "./useUiSettings";
import { isCSSPropertyKey } from "@m-cafe-app/shared-constants";
import { useAppSelector } from "./reduxHooks";

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
  placeholder?: string,
  label?: string,
  variant?: string
}



export const useInitLC = ({
  componentType,
  componentName,
  classNameAddon,
  classNameOverride,
  errorMessage,
  placeholder,
  label,
  variant
}: UseInitLCProps) => {

  const theme = useAppSelector(store => store.settings.theme);
  const uiSettingsHash = useAppSelector(store => store.settings.uiSettingsHash);

  const { ui } = useUiSettings();

  // define ui node - componentName for layout components, componentType for basic components
  const uiNode = componentType === 'layout'
    ? componentName
    : componentType;

  const uiSettingsClassnames = ui(`${uiNode}-${theme}-classNames`);

  // baseVariant must have the most SCSS for web / inlineCSS for mobile
  const baseVariant = ui(`${uiNode}-${theme}-baseVariant`);

  const baseVariantClassName = baseVariant.length > 0
    ? baseVariant[0].value
    : 'alpha';

  // same as baseVariant, but for color scheme
  const baseColorVariant = ui(`${uiNode}-${theme}-baseColorVariant`);

  const baseColorVariantClassName = baseColorVariant.length > 0
    ? baseColorVariant[0].value
    : 'alpha-color';

  const uiSettingsInlineCSS = ui(`${uiNode}-${theme}-inlineCSS`);

  const specialUiSettingsSet = new Set([ ...ui(`${uiNode}-${theme}-special`).map(uiSetting => uiSetting.name) ]);

  return useMemo(() => {
    
    /**
     * ClassName resolve block
     */
    let settingsClassNameAddon = '';

    // add all settings that are true
    for (const uiSetting of uiSettingsClassnames) {
      settingsClassNameAddon += uiSetting.value + ' ';
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
      if (uiSetting.value !== 'false') {
        const key = uiSetting.name;
        if (!isCSSPropertyKey(key)) throw new ApplicationError('Wrong key applied to inline CSS', { current: uiSetting, all: uiSettingsInlineCSS });
        style[key] = uiSetting.value;
      }
    }

    /**
     * Component type-specific resolve block
     */
    let specific = undefined as LCSpecificValue;

    switch (componentType) {

      case 'input':
      case 'dropbox':
        const userAgent = navigator.userAgent;
        const regex = /Firefox\/(\d+(\.\d+)?)/;
        const match = userAgent.match(regex);
        const firefoxVersion = match ? Number(match[1]) : null;
        const firefoxFix = firefoxVersion
          ? firefoxVersion > 108
          : false;

        specific = {
          labelAsPlaceholder: specialUiSettingsSet.has('labelAsPlaceholder'),
          useBarBelow: specialUiSettingsSet.has('useBarBelow'),
          firefoxFix
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
    placeholder,
    label,
    variant,
    uiSettingsHash
  ]);
};