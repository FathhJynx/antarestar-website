import { useEffect } from 'react';

/**
 * Custom hook to lock body scroll when a modal is open.
 * @param lock - Boolean to indicate if scroll should be locked.
 */
export const useScrollLock = (lock: boolean) => {
  useEffect(() => {
    if (lock) {
      // Get the current scrollbar width to prevent layout shift
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      document.body.style.overflow = 'hidden';
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    } else {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    }

    return () => {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    };
  }, [lock]);
};
