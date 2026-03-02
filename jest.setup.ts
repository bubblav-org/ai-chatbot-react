// React 19 Compatibility: Workaround for testing-library with React 19
import '@testing-library/jest-dom';
import React from 'react';

// Set IS_REACT_ACT_ENVIRONMENT to suppress act warnings from React 19
if (typeof global !== 'undefined') {
  (global as any).IS_REACT_ACT_ENVIRONMENT = true;
}

// Provide React.act for testing-library compatibility
if (!React.act) {
  let isActing = false;
  (React as any).act = (callback: () => void | Promise<void>) => {
    if (isActing) {
      return callback();
    }

    isActing = true;
    try {
      const { act: reactDomAct } = require('react-dom/test-utils') as typeof import('react-dom/test-utils');
      return reactDomAct(callback);
    } finally {
      isActing = false;
    }
  };
}

// Mock console methods to reduce noise in tests
const consoleSpies: Partial<Record<'log' | 'warn' | 'error' | 'info', jest.SpyInstance>> = {};

beforeEach(() => {
  consoleSpies.log = jest.spyOn(console, 'log').mockImplementation(() => {});
  consoleSpies.warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
  consoleSpies.error = jest.spyOn(console, 'error').mockImplementation(() => {});
  consoleSpies.info = jest.spyOn(console, 'info').mockImplementation(() => {});
});

afterEach(() => {
  Object.values(consoleSpies).forEach(spy => {
    spy?.mockRestore();
  });
});

// Reset mocks after each test
afterEach(() => {
  jest.clearAllMocks();
});
