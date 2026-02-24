import { useEffect } from 'react';

const WIDGET_SRC = 'https://www.bubblav.com/widget.js';
const SCRIPT_ATTR = 'data-bubblav-widget';

export interface BubblaVWidgetProps {
  /** Your website ID from the BubblaV dashboard */
  websiteId: string;
}

/**
 * BubblaVWidget — injects the BubblaV chat widget script into the page.
 *
 * Place this component once in your root layout or App component.
 * It renders nothing visible — the widget UI is managed by the script.
 *
 * @example
 * <BubblaVWidget websiteId="your-website-id" />
 */
export function BubblaVWidget({ websiteId }: BubblaVWidgetProps) {
  useEffect(() => {
    if (typeof document === 'undefined') return;

    // Avoid injecting the script twice (React StrictMode / remounts)
    if (document.querySelector(`script[${SCRIPT_ATTR}]`)) return;

    const script = document.createElement('script');
    script.src = WIDGET_SRC;
    script.async = true;
    script.setAttribute('data-site-id', websiteId);
    script.setAttribute(SCRIPT_ATTR, 'true');
    document.body.appendChild(script);

    return () => {
      // Only remove during hot-module reloads in development.
      // In production the script stays loaded after unmount so the
      // widget continues working even if the component is torn down.
      if (process.env.NODE_ENV === 'development') {
        const s = document.querySelector<HTMLScriptElement>(`script[${SCRIPT_ATTR}]`);
        if (s) s.remove();
      }
    };
  }, [websiteId]);

  return null;
}

export default BubblaVWidget;
