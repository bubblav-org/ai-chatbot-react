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
  /** Send a pre-filled message to the widget */
  sendMessage: (message: string) => void;
}

declare global {
  interface Window {
    BubblaV?: BubblaVAPI;
  }
}

/**
 * Returns the BubblaV widget API for programmatic control.
 *
 * Returns `null` during SSR or before the widget script has loaded.
 *
 * @example
 * function HelpButton() {
 *   const widget = useBubblaVWidget();
 *   return <button onClick={() => widget?.open()}>Chat with us</button>;
 * }
 */
export function useBubblaVWidget(): BubblaVAPI | null {
  if (typeof window === 'undefined') return null;
  return window.BubblaV ?? null;
}
