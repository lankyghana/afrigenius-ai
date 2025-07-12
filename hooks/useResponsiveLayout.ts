import { useState, useEffect } from 'react';
import { Dimensions, ScaledSize } from 'react-native';

interface BreakpointConfig {
  mobile: number;
  tablet: number;
  desktop: number;
}

interface ResponsiveLayout {
  width: number;
  height: number;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  orientation: 'portrait' | 'landscape';
  breakpoint: 'mobile' | 'tablet' | 'desktop';
  scale: number;
}

const defaultBreakpoints: BreakpointConfig = {
  mobile: 768,
  tablet: 1024,
  desktop: 1200,
};

export function useResponsiveLayout(customBreakpoints?: Partial<BreakpointConfig>): ResponsiveLayout {
  const breakpoints = { ...defaultBreakpoints, ...customBreakpoints };
  
  const [dimensions, setDimensions] = useState(() => {
    const { width, height } = Dimensions.get('window');
    return { width, height };
  });

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }: { window: ScaledSize }) => {
      setDimensions({ width: window.width, height: window.height });
    });

    return () => subscription?.remove();
  }, []);

  const { width, height } = dimensions;
  
  // Determine device type based on width
  const isMobile = width < breakpoints.mobile;
  const isTablet = width >= breakpoints.mobile && width < breakpoints.desktop;
  const isDesktop = width >= breakpoints.desktop;
  
  // Determine breakpoint
  let breakpoint: 'mobile' | 'tablet' | 'desktop' = 'mobile';
  if (isDesktop) breakpoint = 'desktop';
  else if (isTablet) breakpoint = 'tablet';
  
  // Determine orientation
  const orientation: 'portrait' | 'landscape' = height > width ? 'portrait' : 'landscape';
  
  // Calculate scale factor for responsive sizing
  const baseWidth = 375; // iPhone X width as base
  const scale = Math.min(width / baseWidth, 1.5); // Cap at 1.5x scale
  
  return {
    width,
    height,
    isMobile,
    isTablet,
    isDesktop,
    orientation,
    breakpoint,
    scale,
  };
}