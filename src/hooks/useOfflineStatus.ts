import { useState, useEffect, useCallback } from 'react';
import { GeneratedPlan } from '../types';
import { cachePlanForOffline, getOfflineCacheMetadata, OfflineCacheMetadata } from '../utils/offlineStorage';

export function useOfflineStatus(currentPlan?: GeneratedPlan | null) {
  const [isOnline, setIsOnline] = useState<boolean>(typeof navigator !== 'undefined' ? navigator.onLine : true);
  const [isCached, setIsCached] = useState<boolean>(false);
  const [metadata, setMetadata] = useState<OfflineCacheMetadata>(getOfflineCacheMetadata());

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Auto-cache current plan whenever it changes
  useEffect(() => {
    if (currentPlan) {
      const ok = cachePlanForOffline(currentPlan);
      setIsCached(ok);
      setMetadata(getOfflineCacheMetadata());
    }
  }, [currentPlan]);

  const forceCacheCurrentPlan = useCallback(() => {
    if (currentPlan) {
      const ok = cachePlanForOffline(currentPlan);
      setIsCached(ok);
      setMetadata(getOfflineCacheMetadata());
      return ok;
    }
    return false;
  }, [currentPlan]);

  return {
    isOnline,
    isOffline: !isOnline,
    isCached,
    metadata,
    forceCacheCurrentPlan,
  };
}
