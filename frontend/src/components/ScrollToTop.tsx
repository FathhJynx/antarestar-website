import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname, search } = useLocation();

  useEffect(() => {
    // Scroll to top on every route change (including search params)
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant' as any
    });
  }, [pathname, search]);

  return null;
};

export default ScrollToTop;
