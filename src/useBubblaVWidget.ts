"use client"

import { useEffect, useState, useCallback } from 'react';

/**
 * BubblaV widget JavaScript API exposed on window.BubblaV
 */
export interface BubblaVAPI {
  /** Open the chat widget */
  open: () => void;
  /** Close the chat widget */
  close: () => void;
  /** Toggle the chat widget open/closed */
  toggle: () => void;
  /** Check if the widget is currently open */
  isOpen: () => boolean;
  /** Show the widget button if hidden */
  show: () => void;
  /** Hide the widget button */
  hide: () => void;
  /** Send a pre-filled message to the widget */
  sendMessage: (message: string, conversationId?: string) => void;
  /** Show a greeting message bubble */
  showGreeting: (message?: string) => void;
  /** Hide the greeting bubble */
  hideGreeting: () => void;
  /** Register an event listener */
  on: (event: string, callback: (...args: any[]) => void) => void;
  /** Unregister an event listener */
  off: (event: string, callback: (...args: any[]) => void) => void;
  /** Track a custom event */
  track: (eventName: string, properties?: Record<string, any>) => void;
  /** Set debug mode */
  setDebug: (enabled: boolean) => void;
  /** Get current widget configuration */
  getConfig: () => Record<string, any>;
  /** Wait for SDK to be ready */
  ready: (callback: () => void) => void;
}

/**
 * Type-safe interface for the forwardRef of BubblaVWidget
 */
export type BubblaVWidgetRef = BubblaVAPI;

declare global {
  interface Window {
    BubblaV?: BubblaVAPI;
  }
}

/**
 * Returns the BubblaV widget API for programmatic control.
 *
 * Returns `null` during SSR. On the client, waits for the widget script to load.
 * The hook re-renders once the widget is ready, so subsequent renders will have
 * the actual widget API.
 *
 * @example
 * function HelpButton() {
 *   const widget = useBubblaVWidget();
 *   return <button onClick={() => widget?.open()}>Chat with us</button>;
 * }
 */
export function useBubblaVWidget(): BubblaVAPI | null {
  const [widget, setWidget] = useState<BubblaVAPI | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Check if widget is already available
    const api = window.BubblaV;
    if (api) {
      setWidget(api);
      return;
    }

    // Widget not ready yet, use the ready callback if available
    // The widget script should expose a ready queue or callback mechanism
    const checkWidget = () => {
      if (window.BubblaV) {
        setWidget(window.BubblaV);
        return true;
      }
      return false;
    };

    // If ready method exists, use it
    // Note: We access window.BubblaV again since it might have been set by now
    const currentApi = window.BubblaV;
    if (currentApi?.ready) {
      currentApi.ready(() => {
        setWidget(window.BubblaV!);
      });
    } else {
      // Poll for widget availability (widget script may not have initialized yet)
      const interval = setInterval(() => {
        if (checkWidget()) {
          clearInterval(interval);
        }
      }, 100);

      // Clean up interval on unmount
      return () => clearInterval(interval);
    }
  }, []);

  return widget;
}

/**
 * Hook to listen to BubblaV widget events.
 * 
 * @param event - The event name to listen to (e.g., 'widget_opened', 'message:received')
 * @param callback - Function to call when the event is triggered
 */
export function useBubblaVEvent(event: string, callback: (...args: any[]) => void) {
  useEffect(() => {
    const api = window.BubblaV;
    
    if (api && typeof api.on === 'function') {
      api.on(event, callback);
      return () => {
        if (typeof api.off === 'function') {
          api.off(event, callback);
        }
      };
    }
    
    // Fallback: If API is not ready yet, we might want to poll or use a queue
    // but for now we expect the user to handle "ready" or simple effect dependency
  }, [event, callback]);
}

