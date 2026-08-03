import { useEffect, useState } from 'react';

const UPTIME_INTERVAL_MS = 1000;
const systemStartTime = Date.now();

export function formatUptime(elapsedMs: number) {
  const totalSeconds = Math.floor(elapsedMs / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const pad = (value: number) => String(value).padStart(2, '0');

  return `${days}D ${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
}

export function useSystemUptime() {
  const [elapsedMs, setElapsedMs] = useState(() => Date.now() - systemStartTime);

  useEffect(() => {
    const updateUptime = () => setElapsedMs(Date.now() - systemStartTime);
    const intervalId = window.setInterval(updateUptime, UPTIME_INTERVAL_MS);

    updateUptime();

    return () => {
      window.clearInterval(intervalId);
    };
  }, []);

  return formatUptime(elapsedMs);
}
