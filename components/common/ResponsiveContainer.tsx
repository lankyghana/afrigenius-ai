import React, { ReactNode } from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { useResponsiveLayout } from '@/hooks/useResponsiveLayout';
import { Colors } from '@/constants/Colors';

interface ResponsiveContainerProps {
  children: ReactNode;
  style?: ViewStyle;
  maxWidth?: number;
  padding?: number;
  horizontalPadding?: number;
  verticalPadding?: number;
}

export function ResponsiveContainer({
  children,
  style,
  maxWidth = 1200,
  padding,
  horizontalPadding,
  verticalPadding,
}: ResponsiveContainerProps) {
  const { width, isMobile, isTablet, isDesktop } = useResponsiveLayout();

  // Calculate responsive padding
  const getResponsivePadding = () => {
    if (padding !== undefined) {
      return {
        paddingHorizontal: padding,
        paddingVertical: padding,
      };
    }

    const horizontal = horizontalPadding ?? (isMobile ? 16 : isTablet ? 24 : 32);
    const vertical = verticalPadding ?? (isMobile ? 16 : isTablet ? 20 : 24);

    return {
      paddingHorizontal: horizontal,
      paddingVertical: vertical,
    };
  };

  const containerStyle: ViewStyle = {
    width: '100%',
    maxWidth: isDesktop ? maxWidth : '100%',
    alignSelf: 'center',
    ...getResponsivePadding(),
  };

  return (
    <View style={[containerStyle, style]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});