import { useEffect } from 'react';

const HEALTH_INTERVAL_MS = 14 * 60 * 1000; // 14 minutes

export function HealthChecker() {
  useEffect(() => {
    const url = import.meta.env.VITE_HEALTH_CHECK_URL;
    if (!url) return;

    async function ping() {
      try {
        await fetch(url, { method: 'GET' });
      } catch {
        // Ignorer silencieusement
      }
    }

    ping();
    const timer = setInterval(ping, HEALTH_INTERVAL_MS);
    return () => clearInterval(timer);
  }, []);

  return null;
}
