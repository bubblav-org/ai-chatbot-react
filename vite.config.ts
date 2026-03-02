import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';
import { resolve } from 'path';
import type { Plugin } from 'vite';

// Plugin to preserve "use client" directive in output files
function preserveUseClient(): Plugin {
  return {
    name: 'preserve-use-client',
    generateBundle(options, bundle) {
      for (const fileName in bundle) {
        const file = bundle[fileName];
        if (file.type === 'chunk' && file.code) {
          // Prepend "use client" directive if the original source had it
          file.code = '"use client"\n' + file.code;
        }
      }
    },
  };
}

export default defineConfig({
  plugins: [
    react(),
    dts({
      include: ['src'],
      insertTypesEntry: true,
    }),
    preserveUseClient(),
  ],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'BubblaVAIChatbotReact',
      formats: ['es', 'cjs'],
      fileName: (format) => `index.${format === 'es' ? 'esm' : 'cjs'}.js`,
    },
    rollupOptions: {
      // Externalize React so the host project's React is used.
      // This prevents the "duplicate React" / "useRef is null" error
      // that occurs when the package bundles its own React instance.
      external: ['react', 'react-dom', 'react/jsx-runtime'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          'react/jsx-runtime': 'ReactJSXRuntime',
        },
      },
    },
  },
  resolve: {
    // Deduplicate React in development to prevent conflicts
    dedupe: ['react', 'react-dom'],
  },
});
