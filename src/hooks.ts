/**
 * Custom React hooks for @bubblav/ai-chatbot-react
 */

import { useEffect, useState } from 'react';
import type { BubblaVSDK } from './types';

/**
 * Hook to access the BubblaV SDK programmatically
 * Returns null until the widget is ready
 */
export function useBubblaVWidget(): BubblaVSDK | null {
  const [sdk, setSdk] = useState<BubblaVSDK | null>(() => {
    // Check if SDK is already available
    if (typeof window !== 'undefined' && window.BubblaV) {
      return window.BubblaV;
    }
    return null;
  });

  useEffect(() => {
    // If SDK already available, no need to set up listener
    if (sdk) return;

    // Poll for SDK availability (simple approach)
    const interval = setInterval(() => {
      if (typeof window !== 'undefined' && window.BubblaV && !window.BubblaV) {
        setSdk(window.BubblaV);
        clearInterval(interval);
      }
    }, 100);

    // Cleanup interval after 5 seconds (SDK should load by then)
    const timeout = setTimeout(() => {
      clearInterval(interval);
    }, 5000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [sdk]);

  return sdk;
}

/**
 * Hook to listen to widget events
 *
 * @example
 * ```tsx
 * useBubblaVEvent('widget_opened', () => {
 *   console.log('Widget opened!');
 * });
 * ```
 */
export function useBubblaVEvent(
  eventName: string,
  callback: (...args: unknown[]) => void
): void {
  useEffect(() => {
    const sdk = typeof window !== 'undefined' ? window.BubblaV : null;
    if (!sdk) return;

    sdk.on(eventName, callback);

    return () => {
      sdk.off(eventName, callback);
    };
  }, [eventName, callback]);
}

/**
 * Hook to get widget open/closed state
 */
export function useBubblaVWidgetState(): boolean {
  const [isOpen, setIsOpen] = useState(false);

  useBubblaVEvent('widget_opened', () => setIsOpen(true));
  useBubblaVEvent('widget_closed', () => setIsOpen(false));

  return isOpen;
}
