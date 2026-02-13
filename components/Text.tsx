import React from 'react';
import { Text as RNText, StyleSheet, TextProps } from 'react-native';
import { typography, colors } from '@/constants/typography';

type Variant = keyof typeof typography;

interface AppTextProps extends TextProps {
  variant?: Variant;
  color?: keyof typeof colors | string;
  children: React.ReactNode;
}

export function AppText({
  variant = 'body',
  color = 'text',
  style,
  children,
  ...rest
}: AppTextProps) {
  const textColor = color in colors ? colors[color as keyof typeof colors] : color;
  return (
    <RNText
      style={[
        typography[variant],
        { color: textColor },
        style,
      ]}
      {...rest}
    >
      {children}
    </RNText>
  );
}
