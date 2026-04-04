import { useState, useEffect } from "react";

/**
 * A custom hook that provides a countdown in hours, minutes, and seconds.
 * @param totalSec Total seconds to count down from.
 */
export const useCountdown = (totalSec: number) => {
  const [t, setT] = useState(totalSec);

  useEffect(() => {
    const id = setInterval(() => setT((x) => Math.max(0, x - 1)), 1000);
    return () => clearInterval(id);
  }, []);

  return {
    h: String(Math.floor(t / 3600)).padStart(2, "0"),
    m: String(Math.floor((t % 3600) / 60)).padStart(2, "0"),
    s: String(t % 60).padStart(2, "0"),
  };
};

export default useCountdown;
