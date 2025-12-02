import { useState, useEffect } from 'react';

export const useTime = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    // Initial sync to start close to the second boundary
    const now = new Date();
    const delay = 1000 - now.getMilliseconds();

    let timeoutId: ReturnType<typeof setTimeout>;
    let intervalId: ReturnType<typeof setInterval> | undefined;

    const tick = () => {
      setTime(new Date());
    };

    timeoutId = setTimeout(() => {
      tick();
      intervalId = setInterval(tick, 1000);
    }, delay);

    return () => {
      clearTimeout(timeoutId);
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, []);

  return time;
};