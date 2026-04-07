import React from 'react';
import useLenis from '@/hooks/useLenis';
import CustomCursor from './CustomCursor';

/**
 * GlobalStyler — Applies consistent cinematic behaviors across the entire app.
 * Includes:
 * 1. Lenis Smooth Scrolling (High-inertia)
 * 2. Custom Magnetic Cursor (Mix-blend-difference)
 */
const GlobalStyler = ({ children }: { children: React.ReactNode }) => {
  // Initialize global smooth scroll
  useLenis();

  return (
    <>
      <CustomCursor />
      {children}
    </>
  );
};

export default GlobalStyler;
