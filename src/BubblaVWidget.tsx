/**
 * BubblaVWidget React Component
 *
 * @example
 * ```tsx
 * import { BubblaVWidget } from '@bubblav/ai-chatbot-react';
 *
 * function App() {
 *   return (
 *     <BubblaVWidget
 *       websiteId="your-website-id"
 *       bubbleColor="#3b82f6"
 *       desktopPosition="bottom-right"
 *     />
 *   );
 * }
 * ```
 */

import { forwardRef, useEffect, useRef, useImperativeHandle } from 'react';
import type { BubblaVWidgetProps, BubblaVWidgetRef } from './types';
import {
  propsToDataAttributes,
  getWidgetScriptUrl,
  validateWebsiteId,
  getConfigProps,
  isBrowser,
  isScriptLoaded,
} from './utils';

/**
 * BubblaV Widget Component
 *
 * Loads the BubblaV chat widget script and initializes it with the provided config.
 * Strict-mode safe - prevents double initialization.
 */
export const BubblaVWidget = forwardRef<BubblaVWidgetRef, BubblaVWidgetProps>(
  function BubblaVWidget(props, ref) {
    const {
      websiteId,
      apiUrl,
    } = props;

    // Ref to track initialization state (persists across re-renders)
    const isInitializedRef = useRef(false);
    const scriptRef = useRef<HTMLScriptElement | null>(null);
    const sdkRef = useRef<BubblaVWidgetRef | null>(null);

    // Validate website ID
    useEffect(() => {
      if (!validateWebsiteId(websiteId)) {
        console.warn(
          `[BubblaV] Invalid website ID format: "${websiteId}". ` +
          `Please check your website ID in the BubblaV dashboard.`
        );
      }
    }, [websiteId]);

    // Expose SDK methods via ref
    useImperativeHandle(ref, () => ({
      get open() {
        return sdkRef.current?.open ?? (() => false);
      },
      get close() {
        return sdkRef.current?.close ?? (() => false);
      },
      get toggle() {
        return sdkRef.current?.toggle ?? (() => false);
      },
      get isOpen() {
        return sdkRef.current?.isOpen ?? (() => false);
      },
      get sendMessage() {
        return sdkRef.current?.sendMessage ?? (() => {});
      },
      get showGreeting() {
        return sdkRef.current?.showGreeting ?? (() => {});
      },
      get hideGreeting() {
        return sdkRef.current?.hideGreeting ?? (() => {});
      },
      get getConfig() {
        return sdkRef.current?.getConfig ?? (() => ({}));
      },
      get setDebug() {
        return sdkRef.current?.setDebug ?? (() => {});
      },
    }));

    useEffect(() => {
      // Skip if not in browser (SSR)
      if (!isBrowser()) {
        return;
      }

      // Prevent double initialization (strict-mode safe)
      if (isInitializedRef.current) {
        return;
      }

      // Get script URL
      const scriptUrl = getWidgetScriptUrl(apiUrl);

      // Check if script is already loaded
      if (isScriptLoaded(scriptUrl)) {
        console.warn(
          `[BubblaV] Widget script already loaded. ` +
          `If you're using React strict mode, this is normal. ` +
          `Only one widget instance should be active.`
        );
        return;
      }

      // Mark as initialized
      isInitializedRef.current = true;

      // Create script element
      const script = document.createElement('script');
      script.src = scriptUrl;
      script.async = true;
      script.defer = true;

      // Set data attributes
      script.setAttribute('data-site-id', websiteId);

      // Set optional config as data attributes
      const config = getConfigProps(props);
      const dataAttrs = propsToDataAttributes(config);
      for (const [key, value] of Object.entries(dataAttrs)) {
        script.setAttribute(key, value);
      }

      // Handle load event
      script.onload = () => {
        // SDK should be available now
        if (window.BubblaV) {
          sdkRef.current = window.BubblaV;
        }
      };

      // Handle error event
      script.onerror = () => {
        console.error(
          `[BubblaV] Failed to load widget script from ${scriptUrl}. ` +
          `Please check your network connection and ensure the URL is correct.`
        );
        isInitializedRef.current = false;
      };

      // Add script to document
      document.body.appendChild(script);
      scriptRef.current = script;

      // Cleanup function
      return () => {
        if (scriptRef.current && scriptRef.current.parentNode) {
          scriptRef.current.parentNode.removeChild(scriptRef.current);
        }
        scriptRef.current = null;
        sdkRef.current = null;
        isInitializedRef.current = false;
      };
    }, [websiteId, apiUrl]); // Only re-run if websiteId or apiUrl changes

    // Component renders nothing (script-only widget)
    return null;
  }
);

export default BubblaVWidget;
