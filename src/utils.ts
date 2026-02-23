/**
 * Utility functions for @bubblav/ai-chatbot-react
 */

import type { BubblaVWidgetProps } from './types';

const WIDGET_SCRIPT_URL = 'https://www.bubblav.com/widget.js';

/**
 * Convert camelCase props to data-* attribute names
 */
export function propsToDataAttributes(props: Record<string, unknown>): Record<string, string> {
  const dataAttrs: Record<string, string> = {};

  for (const [key, value] of Object.entries(props)) {
    if (value === undefined || value === null) continue;

    // Convert camelCase to kebab-case for data attributes
    const dataKey = 'data-' + key.replace(/([A-Z])/g, '-$1').toLowerCase();
    dataAttrs[dataKey] = String(value);
  }

  return dataAttrs;
}

/**
 * Get the widget script URL
 */
export function getWidgetScriptUrl(apiUrl?: string): string {
  // If custom API URL provided, derive widget URL from it
  if (apiUrl) {
    try {
      const url = new URL(apiUrl, window.location.origin);
      // Replace /api/chat with /widget.js
      return url.origin + '/widget.js';
    } catch {
      return WIDGET_SCRIPT_URL;
    }
  }

  return WIDGET_SCRIPT_URL;
}

/**
 * Validate website ID format
 */
export function validateWebsiteId(websiteId: string): boolean {
  // Basic validation: should be a non-empty string
  // Format varies, so we just check it's a reasonable string
  return typeof websiteId === 'string' && websiteId.length > 0 && websiteId.length < 100;
}

/**
 * Filter props to only include widget config (exclude websiteId)
 */
export function getConfigProps(props: BubblaVWidgetProps): Omit<BubblaVWidgetProps, 'websiteId'> {
  const { websiteId: _websiteId, ...configProps } = props;
  return configProps;
}

/**
 * Check if we're in a browser environment
 */
export function isBrowser(): boolean {
  return typeof window !== 'undefined' && typeof document !== 'undefined';
}

/**
 * Check if a widget script is already loaded
 */
export function isScriptLoaded(url: string): boolean {
  if (!isBrowser()) return false;

  const scripts = document.getElementsByTagName('script');
  for (let i = 0; i < scripts.length; i++) {
    if (scripts[i].src === url) {
      return true;
    }
  }
  return false;
}
