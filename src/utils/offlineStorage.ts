import { GeneratedPlan, TravelReminder } from '../types';

const OFFLINE_PLANS_KEY = 'smarttravel_offline_cached_plans_v1';
const OFFLINE_ACTIVE_KEY = 'smarttravel_active_offline_plan_v1';
const OFFLINE_METADATA_KEY = 'smarttravel_offline_meta_v1';

export interface OfflineCacheMetadata {
  lastCachedAt: string;
  totalCachedPlans: number;
  hasOfflineAssets: boolean;
}

/**
 * Cache a generated plan completely in localStorage for guaranteed offline access
 */
export function cachePlanForOffline(plan: GeneratedPlan): boolean {
  try {
    // 1. Store as currently active offline plan
    localStorage.setItem(OFFLINE_ACTIVE_KEY, JSON.stringify(plan));

    // 2. Store in list of offline plans
    const existingStr = localStorage.getItem(OFFLINE_PLANS_KEY);
    let plans: GeneratedPlan[] = [];
    if (existingStr) {
      try {
        plans = JSON.parse(existingStr);
      } catch {
        plans = [];
      }
    }

    const filtered = plans.filter((p) => p.id !== plan.id && (p.shareId ? p.shareId !== plan.shareId : true));
    const updated = [plan, ...filtered].slice(0, 15);
    localStorage.setItem(OFFLINE_PLANS_KEY, JSON.stringify(updated));

    // 3. Update offline metadata
    const meta: OfflineCacheMetadata = {
      lastCachedAt: new Date().toISOString(),
      totalCachedPlans: updated.length,
      hasOfflineAssets: true,
    };
    localStorage.setItem(OFFLINE_METADATA_KEY, JSON.stringify(meta));

    return true;
  } catch (err) {
    console.error('Failed to cache plan for offline use:', err);
    return false;
  }
}

/**
 * Retrieve all offline cached plans
 */
export function getOfflinePlans(): GeneratedPlan[] {
  try {
    const raw = localStorage.getItem(OFFLINE_PLANS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.error('Failed to retrieve offline plans:', err);
    return [];
  }
}

/**
 * Retrieve specific plan by ID or shareId from offline cache
 */
export function getOfflinePlanById(idOrShareId: string): GeneratedPlan | null {
  try {
    const plans = getOfflinePlans();
    const found = plans.find((p) => p.id === idOrShareId || p.shareId === idOrShareId);
    if (found) return found;

    // Check active offline plan
    const activeRaw = localStorage.getItem(OFFLINE_ACTIVE_KEY);
    if (activeRaw) {
      const active: GeneratedPlan = JSON.parse(activeRaw);
      if (active.id === idOrShareId || active.shareId === idOrShareId) {
        return active;
      }
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Get offline storage status and metadata
 */
export function getOfflineCacheMetadata(): OfflineCacheMetadata {
  try {
    const raw = localStorage.getItem(OFFLINE_METADATA_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch {
    // ignore
  }
  const plans = getOfflinePlans();
  return {
    lastCachedAt: new Date().toISOString(),
    totalCachedPlans: plans.length,
    hasOfflineAssets: plans.length > 0,
  };
}

/**
 * Register Service Worker for offline PWA support
 */
export function registerServiceWorker(): void {
  if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/sw.js')
        .then((reg) => {
          console.log('[SW] SmartTravel Service Worker registered successfully:', reg.scope);
        })
        .catch((err) => {
          console.warn('[SW] Service Worker registration skipped/failed:', err);
        });
    });
  }
}
