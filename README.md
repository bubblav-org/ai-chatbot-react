# @bubblav/ai-chatbot-react

Official React package for the [BubblaV](https://www.bubblav.com) AI chatbot widget.

## Installation

```bash
npm install @bubblav/ai-chatbot-react
# or
yarn add @bubblav/ai-chatbot-react
# or
pnpm add @bubblav/ai-chatbot-react
```

## Usage

Add `BubblaVWidget` once in your root layout or `App` component:

```tsx
import { BubblaVWidget } from '@bubblav/ai-chatbot-react';

function App() {
  return (
    <>
      {/* your app */}
      <BubblaVWidget websiteId="your-website-id" />
    </>
  );
}
```

Get your `websiteId` from the [BubblaV dashboard](https://www.bubblav.com/dashboard).

## Programmatic control

```tsx
import { useBubblaVWidget } from '@bubblav/ai-chatbot-react';

function HelpButton() {
  const widget = useBubblaVWidget();
  return <button onClick={() => widget?.open()}>Chat with us</button>;
}
```

## Vite / Lovable / Bolt / v0

If you use a Vite-based bundler (Lovable, Bolt, v0, plain Vite), add this to your `vite.config.ts` to prevent duplicate-React conflicts:

```ts
export default defineConfig({
  resolve: {
    dedupe: ['react', 'react-dom'],
  },
  // ...
});
```

## Next.js

Works out of the box. Place `BubblaVWidget` in `app/layout.tsx` (App Router) or `pages/_app.tsx` (Pages Router):

```tsx
// app/layout.tsx
import { BubblaVWidget } from '@bubblav/ai-chatbot-react';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>
        {children}
        <BubblaVWidget websiteId="your-website-id" />
      </body>
    </html>
  );
}
```

## Documentation

Full installation guide: [docs.bubblav.com/user-guide/installation](https://docs.bubblav.com/user-guide/installation)
