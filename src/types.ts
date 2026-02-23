/**
 * Type definitions for @bubblav/ai-chatbot-react
 */

/** Widget position options */
export type WidgetPosition = 'bottom-left' | 'bottom-right';

/** Background type for home screen */
export type BackgroundType = 'solid' | 'gradient';

/**
 * Props for the BubblaVWidget component
 */
export interface BubblaVWidgetProps {
  /** Required: Your website ID from the BubblaV dashboard */
  websiteId: string;

  /** Optional: Custom API URL (defaults to production) */
  apiUrl?: string;

  /** Optional: Bubble button color (hex) */
  bubbleColor?: string;

  /** Optional: Bubble icon color (hex) */
  bubbleIconColor?: string;

  /** Optional: Desktop position */
  desktopPosition?: WidgetPosition;

  /** Optional: Mobile position */
  mobilePosition?: WidgetPosition;

  /** Optional: Show/hide powered by branding */
  poweredByVisible?: boolean;

  /** Optional: Custom bot name */
  botName?: string;

  /** Optional: Greeting message shown when widget opens */
  greetingMessage?: string;

  /** Optional: Placeholder text for input field */
  textboxPlaceholder?: string;

  /** Optional: Whether to show action buttons */
  showActionButtons?: boolean;
}

/**
 * SDK methods available via ref
 */
export interface BubblaVWidgetRef {
  /** Open the widget */
  open: () => void;

  /** Close the widget */
  close: () => void;

  /** Toggle widget open/close state */
  toggle: () => void;

  /** Check if widget is currently open */
  isOpen: () => boolean;

  /** Send a message programmatically */
  sendMessage: (text: string, conversationId?: string) => void;

  /** Show greeting message */
  showGreeting: (message?: string) => void;

  /** Hide greeting message */
  hideGreeting: () => void;

  /** Get current widget configuration */
  getConfig: () => Record<string, unknown>;

  /** Enable or disable debug mode */
  setDebug: (enabled: boolean) => void;
}

/**
 * Global window.BubblaV SDK interface
 */
export interface BubblaVSDK extends BubblaVWidgetRef {
  /** Register event listener */
  on: (event: string, callback: (...args: unknown[]) => void) => void;

  /** Unregister event listener */
  off: (event: string, callback: (...args: unknown[]) => void) => void;

  /** Emit event */
  emit: (event: string, data?: unknown) => void;

  /** Ready callback for widget loaded */
  ready: (callback: () => void) => void;

  /** Track analytics event */
  track: (eventName: string, properties?: Record<string, unknown>) => void;
}

declare global {
  interface Window {
    BubblaV?: BubblaVSDK;
  }
}
