/** @type {import('jest').Config} */
export default {
  preset: 'ts-jest/presets/default-esm',
  testEnvironment: 'jsdom',
  roots: ['<rootDir>/src'],
  testMatch: ['**/__tests__/**/*.test.ts', '**/__tests__/**/*.test.tsx'],
  moduleNameMapper: {
    // Handle CSS imports
    '\\.css$': 'identity-obj-proxy',
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  extensionsToTreatAsEsm: ['.ts', '.tsx'],
  transform: {
    '^.+\\.(ts|tsx|js|jsx)?$': ['ts-jest', {
      useESM: true,
      tsconfig: {
        allowJs: true,
        jsx: 'react-jsx',
        esModuleInterop: true,
        module: 'ESNext',
        moduleResolution: 'bundler',
        verbatimModuleSyntax: false,
      },
    }],
  },
  transformIgnorePatterns: [
    'node_modules/(?!(react-markdown|remark-gfm)/)',
  ],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/index.ts',
  ],
};
