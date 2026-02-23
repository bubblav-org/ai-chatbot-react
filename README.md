# @bubblav/ai-chatbot-react

React component for embedding the BubblaV AI chatbot widget in your React application.

## Installation

```bash
npm install @bubblav/ai-chatbot-react
# or
yarn add @bubblav/ai-chatbot-react
# or
pnpm add @bubblav/ai-chatbot-react
```

## Usage

### Basic Usage

```tsx
import { BubblaVWidget } from '@bubblav/ai-chatbot-react';

function App() {
  return (
    <BubblaVWidget
      websiteId="your-website-id"
    />
  );
}
```

### With Custom Styling

```tsx
import { BubblaVWidget } from '@bubblav/ai-chatbot-react';

function App() {
  return (
    <BubblaVWidget
      websiteId="your-website-id"
      bubbleColor="#3b82f6"
      bubbleIconColor="#ffffff"
      desktopPosition="bottom-right"
      mobilePosition="bottom-right"
    />
  );
}
```

### With Ref for SDK Access

```tsx
import { useRef } from 'react';
import { BubblaVWidget, type BubblaVWidgetRef } from '@bubblav/ai-chatbot-react';

function App() {
  const widgetRef = useRef<BubblaVWidgetRef>(null);

  const openWidget = () => {
    widgetRef.current?.open();
  };

  return (
    <>
      <button onClick={openWidget}>Open Chat</button>
      <BubblaVWidget
        ref={widgetRef}
        websiteId="your-website-id"
      />
    </>
  );
}
```

### Using Hooks

```tsx
import { useBubblaVWidget } from '@bubblav/ai-chatbot-react';

function SendMessageButton() {
  const widget = useBubblaVWidget();

  const handleClick = () => {
    widget?.sendMessage('Hello, I need help!');
  };

  return (
    <button onClick={handleClick}>Send Message</button>
  );
}
```

## Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `websiteId` | `string` | Yes | - | Your website ID from the BubblaV dashboard |
| `apiUrl` | `string` | No | Production API | Custom API URL (for self-hosted deployments) |
| `bubbleColor` | `string` | No | - | Bubble button color (hex) |
| `bubbleIconColor` | `string` | No | - | Bubble icon color (hex) |
| `desktopPosition` | `'bottom-left' \| 'bottom-right'` | No | `'bottom-right'` | Desktop position |
| `mobilePosition` | `'bottom-left' \| 'bottom-right'` | No | `'bottom-right'` | Mobile position |
| `poweredByVisible` | `boolean` | No | `true` | Show/hide powered by branding |
| `botName` | `string` | No | `'Bot'` | Custom bot name |
| `greetingMessage` | `string` | No | - | Greeting message when widget opens |
| `textboxPlaceholder` | `string` | No | - | Input placeholder text |
| `showActionButtons` | `boolean` | No | `true` | Show/hide action buttons |

## SDK Methods (via Ref)

| Method | Description |
|--------|-------------|
| `open()` | Open the widget |
| `close()` | Close the widget |
| `toggle()` | Toggle widget open/close |
| `isOpen()` | Check if widget is open |
| `sendMessage(text, conversationId?)` | Send a message programmatically |
| `showGreeting(message?)` | Show greeting message |
| `hideGreeting()` | Hide greeting message |
| `getConfig()` | Get current widget configuration |
| `setDebug(enabled)` | Enable/disable debug mode |

## Hooks

### `useBubblaVWidget()`

Returns the BubblaV SDK instance when ready, or `null` while loading.

```tsx
const widget = useBubblaVWidget();
```

### `useBubblaVEvent(eventName, callback)`

Listen to widget events.

```tsx
useBubblaVEvent('widget_opened', () => {
  console.log('Widget opened!');
});
```

### `useBubblaVWidgetState()`

Get the current open/closed state of the widget.

```tsx
const isOpen = useBubblaVWidgetState();
```

## Getting Your Website ID

1. Go to [bubblav.com/dashboard](https://www.bubblav.com/dashboard)
2. Select your website
3. Go to **Installation**
4. Copy your website ID

## Server-Side Rendering (SSR)

This component is SSR-safe. The widget script only loads in the browser.

## TypeScript

This package is written in TypeScript and includes full type definitions.

## License

MIT

## Support

- Documentation: [docs.bubblav.com](https://docs.bubblav.com)
- Issues: [GitHub Issues](https://github.com/tonnguyen/botcanchat/issues)
