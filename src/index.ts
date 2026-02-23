/**
 * @bubblav/ai-chatbot-react
 *
 * React component for embedding the BubblaV AI chatbot widget.
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
 *     />
 *   );
 * }
 * ```
 */

// Main component export
export { BubblaVWidget } from './BubblaVWidget';
export { default } from './BubblaVWidget';

// Type exports
export type {
  BubblaVWidgetProps,
  BubblaVWidgetRef,
  BubblaVSDK,
} from './types';

// Hook exports
export {
  useBubblaVWidget,
  useBubblaVEvent,
  useBubblaVWidgetState,
} from './hooks';

// Utility exports
export {
  propsToDataAttributes,
  getWidgetScriptUrl,
  validateWebsiteId,
  getConfigProps,
  isBrowser,
  isScriptLoaded,
} from './utils';
