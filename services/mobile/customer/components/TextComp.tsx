import type { CommonProps } from '@m-cafe-app/frontend-logic/types';
import { Text, StyleSheet, TextStyle, ViewStyle, ImageStyle, StyleProp } from 'react-native';
import { useMemo } from 'react';

import { themes } from './styles';

interface TextCompProps extends CommonProps {
  text?: string;
  children?: JSX.Element[] | JSX.Element;
  style: StyleProp<TextStyle & ViewStyle & ImageStyle>
}

const styles = StyleSheet.create({
  text: {
    fontSize: themes.fontSizes.body,
    fontFamily: themes.fonts.main,
    fontWeight: themes.fontWeights.normal,
  },
  colorTextPrimaryLight: {
    color: themes.colors.light.textPrimary,
  },
  colorTextSecondaryLight: {
    color: themes.colors.light.textSecondary,
  },
  colorTextBrightLight: {
    color: themes.colors.light.textBright,
  },
  colorTextPrimaryDark: {
    color: themes.colors.dark.textPrimary,
  },
  colorTextSecondaryDark: {
    color: themes.colors.dark.textSecondary,
  },
  colorTextBrightDark: {
    color: themes.colors.dark.textBright,
  },
  fontSizeHeader: {
    fontSize: themes.fontSizes.header,
  },
  fontSizeSubheader: {
    fontSize: themes.fontSizes.subheader,
  },
  fontWeightBold: {
    fontWeight: themes.fontWeights.bold,
  },
});

export const TextComp = ({
  className,
  id,
  style,
  text,
  children
}: TextCompProps) => {

  const classNamesSet = new Set(className?.split(' '));

  const textStyle: Array<TextStyle & ViewStyle & ImageStyle> = useMemo(() => 
    [
      styles.text,
      classNamesSet.has('light')
        ? classNamesSet.has('primary')
          ? styles.colorTextPrimaryLight
          : classNamesSet.has('secondary')
            ? styles.colorTextSecondaryLight
            : styles.colorTextBrightLight
        : classNamesSet.has('primary')
          ? styles.colorTextPrimaryDark
          : classNamesSet.has('secondary')
            ? styles.colorTextSecondaryDark
            : styles.colorTextBrightDark,
      classNamesSet.has('header') && styles.fontSizeHeader,
      classNamesSet.has('subheader') && styles.fontSizeSubheader,
      classNamesSet.has('bold') && styles.fontWeightBold,
      style && style
    ] as Array<TextStyle & ViewStyle & ImageStyle>, [className, style]);

  return (
    <Text
      style={textStyle}
      id={id}
    >
      {text}
      {children}
    </Text>
  );
};