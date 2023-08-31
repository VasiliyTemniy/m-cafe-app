import { useMemo } from 'react';
import { ApplicationError } from "@m-cafe-app/utils";
import { useUiSettings } from "./useUiSettings";
import { CSSProperties } from "react";
import { isCSSPropertyKey } from "@m-cafe-app/shared-constants";
import { useAppSelector } from "../index";
import { useTranslation } from './useTranslation';
import { CommonSCProps, LCSpecificValue } from '../../types';


interface UseInitLCProps extends CommonSCProps {
  componentType:
    'input' |
    'container' |
    'button' |
    'button-group' |
    'modal' |
    'svg-image' |
    'svg-button' |
    'switch' |
    'dropbox' |
    'table' |
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
  variant,
  tooltipTNode
}: UseInitLCProps) => {

  const theme = useAppSelector(store => store.settings.theme);

  const { ui } = useUiSettings();

  const { t } = useTranslation();


  return useMemo(() => {
    /**
     * ClassName resolve block
     */
    // uiSettingsClassnames are written by componentName instead of component type for complex (unbasic) layout components
    const uiSettingsClassnames = componentType === 'layout'
      ? ui(`${componentName}-${theme}-classNames`)
      : ui(`${componentType}-${theme}-classNames`);

    let settingsClassNameAddon = '';

    // add all settings that are true
    for (const uiSetting of uiSettingsClassnames) {
      if (uiSetting.value === 'true') settingsClassNameAddon += uiSetting.value + ' ';
    }

    settingsClassNameAddon.trim();

    const classNameBase = classNameOverride
      ? classNameOverride
      : componentName;

    // baseVariant must have the most SCSS for web / inlineCSS for mobile
    const baseVariantClassName = ui(`${componentType}-${theme}-baseVariant`)[0].value;

    let className = classNameBase;

    if (variant) className = className + `-${variant}`;
    if (baseVariantClassName) className = className + ' ' + baseVariantClassName;
    if (classNameAddon) className = className + ' ' + classNameAddon;
    if (settingsClassNameAddon) className = className + ' ' + settingsClassNameAddon;
    if (errorMessage) className = className + ' ' + 'error';


    /**
     * InlineCSS resolve block
     */
    const uiSettingsInlineCSS = ui(`${componentType}-${theme}-inlineCSS`);

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
        const labelAsPlaceholder = ui(`inputsPlaceholderAsLabel-${theme}`)[0].value === 'true'
          ? true
          : false;
  
        const labelText = labelAsPlaceholder
          ? errorMessage
            ? errorMessage
            : placeholder
          : label;

        if (!labelText) throw new ApplicationError('input label text unresolved!', { current: { errorMessage, placeholder, label } });

        const useBarBelow = ui(`inputsUseBarBelow-${theme}`)[0].value === 'true'
          ? true
          : false;

        specific = {
          labelAsPlaceholder,
          labelText,
          useBarBelow
        };
        break;

      default:
        break;
    }

    /**
     * Translations block
     */
    const tooltip = tooltipTNode ? t(`${tooltipTNode}`) : undefined;

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
      specific,
      /**
       * Translated tooltip text
       */
      tooltip
    };
  }, [theme]);
};