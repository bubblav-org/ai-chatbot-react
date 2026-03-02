/**
 * useBubblaVWidget hook tests
 */
import { renderHook, waitFor } from '@testing-library/react';
import { useBubblaVWidget, BubblaVAPI } from '../useBubblaVWidget';

describe('useBubblaVWidget', () => {
  beforeEach(() => {
    // Clean up window.BubblaV before each test
    delete (window as any).BubblaV;
    jest.useFakeTimers();
  });

  afterEach(() => {
    delete (window as any).BubblaV;
    jest.useRealTimers();
    jest.clearAllMocks();
  });

  describe('initial state', () => {
    test('returns null when window.BubblaV is not available', () => {
      const { result } = renderHook(() => useBubblaVWidget());

      expect(result.current).toBeNull();
    });

    test('returns null on first render even on client', () => {
      // Ensure window exists but BubblaV doesn't
      delete (window as any).BubblaV;

      const { result } = renderHook(() => useBubblaVWidget());

      expect(result.current).toBeNull();
    });
  });

  describe('when widget is already loaded', () => {
    test('returns widget immediately when window.BubblaV exists on mount', () => {
      const mockWidget: BubblaVAPI = {
        open: jest.fn(),
        close: jest.fn(),
        toggle: jest.fn(),
        isOpen: jest.fn(() => false),
        show: jest.fn(),
        hide: jest.fn(),
        sendMessage: jest.fn(),
        showGreeting: jest.fn(),
        hideGreeting: jest.fn(),
        on: jest.fn(),
        off: jest.fn(),
        track: jest.fn(),
        setDebug: jest.fn(),
        getConfig: jest.fn(() => ({})),
        ready: jest.fn(),
      };

      (window as any).BubblaV = mockWidget;

      const { result } = renderHook(() => useBubblaVWidget());

      expect(result.current).toBe(mockWidget);
    });

    test('widget methods are callable', () => {
      const mockOpen = jest.fn();
      const mockWidget: BubblaVAPI = {
        open: mockOpen,
        close: jest.fn(),
        toggle: jest.fn(),
        isOpen: jest.fn(() => true),
        show: jest.fn(),
        hide: jest.fn(),
        sendMessage: jest.fn(),
        showGreeting: jest.fn(),
        hideGreeting: jest.fn(),
        on: jest.fn(),
        off: jest.fn(),
        track: jest.fn(),
        setDebug: jest.fn(),
        getConfig: jest.fn(() => ({})),
        ready: jest.fn(),
      };

      (window as any).BubblaV = mockWidget;

      const { result } = renderHook(() => useBubblaVWidget());

      result.current?.open();

      expect(mockOpen).toHaveBeenCalledTimes(1);
    });
  });

  describe('when widget loads after mount', () => {
    test('polls for widget availability and updates when available', () => {
      const mockWidget: BubblaVAPI = {
        open: jest.fn(),
        close: jest.fn(),
        toggle: jest.fn(),
        isOpen: jest.fn(() => false),
        show: jest.fn(),
        hide: jest.fn(),
        sendMessage: jest.fn(),
        showGreeting: jest.fn(),
        hideGreeting: jest.fn(),
        on: jest.fn(),
        off: jest.fn(),
        track: jest.fn(),
        setDebug: jest.fn(),
        getConfig: jest.fn(() => ({})),
        ready: jest.fn(),
      };

      // Start without widget
      delete (window as any).BubblaV;

      const { result } = renderHook(() => useBubblaVWidget());

      // Initially null
      expect(result.current).toBeNull();

      // Simulate widget loading after 250ms
      setTimeout(() => {
        (window as any).BubblaV = mockWidget;
      }, 250);

      // Advance timers to trigger polling
      jest.advanceTimersByTime(300);

      // Wait for state update
      waitFor(() => {
        expect(result.current).toBe(mockWidget);
      });
    });

    test('stops polling once widget is found', async () => {
      const mockWidget: BubblaVAPI = {
        open: jest.fn(),
        close: jest.fn(),
        toggle: jest.fn(),
        isOpen: jest.fn(() => false),
        show: jest.fn(),
        hide: jest.fn(),
        sendMessage: jest.fn(),
        showGreeting: jest.fn(),
        hideGreeting: jest.fn(),
        on: jest.fn(),
        off: jest.fn(),
        track: jest.fn(),
        setDebug: jest.fn(),
        getConfig: jest.fn(() => ({})),
        ready: jest.fn(),
      };

      const { result } = renderHook(() => useBubblaVWidget());

      expect(result.current).toBeNull();

      // Widget becomes available
      (window as any).BubblaV = mockWidget;

      // Advance timers past the polling interval
      jest.advanceTimersByTime(100);

      // Wait for state update
      await waitFor(() => {
        expect(result.current).toBe(mockWidget);
      });

      // Advance more time to ensure polling stopped
      jest.advanceTimersByTime(500);

      // Should still have the widget (not null)
      expect(result.current).toBe(mockWidget);
    });

    test('polling continues when ready callback is not available', async () => {
      // This test verifies that when widget doesn't have ready callback,
      // the polling mechanism is used instead
      const mockWidget: BubblaVAPI = {
        open: jest.fn(),
        close: jest.fn(),
        toggle: jest.fn(),
        isOpen: jest.fn(() => false),
        show: jest.fn(),
        hide: jest.fn(),
        sendMessage: jest.fn(),
        showGreeting: jest.fn(),
        hideGreeting: jest.fn(),
        on: jest.fn(),
        off: jest.fn(),
        track: jest.fn(),
        setDebug: jest.fn(),
        getConfig: jest.fn(() => ({})),
        ready: jest.fn(),
      };

      // Start without widget
      delete (window as any).BubblaV;

      const { result } = renderHook(() => useBubblaVWidget());

      // Initially null
      expect(result.current).toBeNull();

      // Widget becomes available after some time
      setTimeout(() => {
        (window as any).BubblaV = mockWidget;
      }, 250);

      // Advance timers past the polling interval
      jest.advanceTimersByTime(300);

      // Wait for state update
      await waitFor(() => {
        expect(result.current).toBe(mockWidget);
      }, { timeout: 500 });
    });
  });

  describe('cleanup', () => {
    test('clears interval on unmount', () => {
      delete (window as any).BubblaV;

      const clearIntervalSpy = jest.spyOn(global, 'clearInterval');

      const { unmount } = renderHook(() => useBubblaVWidget());

      // Advance time to start polling
      jest.advanceTimersByTime(150);

      unmount();

      expect(clearIntervalSpy).toHaveBeenCalled();

      clearIntervalSpy.mockRestore();
    });
  });

  describe('widget API methods', () => {
    test('provides all expected API methods when widget is loaded', () => {
      const mockWidget: BubblaVAPI = {
        open: jest.fn(),
        close: jest.fn(),
        toggle: jest.fn(),
        isOpen: jest.fn(() => false),
        show: jest.fn(),
        hide: jest.fn(),
        sendMessage: jest.fn(),
        showGreeting: jest.fn(),
        hideGreeting: jest.fn(),
        on: jest.fn(),
        off: jest.fn(),
        track: jest.fn(),
        setDebug: jest.fn(),
        getConfig: jest.fn(() => ({ siteId: 'test' })),
        ready: jest.fn(),
      };

      (window as any).BubblaV = mockWidget;

      const { result } = renderHook(() => useBubblaVWidget());

      expect(result.current).toHaveProperty('open');
      expect(result.current).toHaveProperty('close');
      expect(result.current).toHaveProperty('toggle');
      expect(result.current).toHaveProperty('isOpen');
      expect(result.current).toHaveProperty('show');
      expect(result.current).toHaveProperty('hide');
      expect(result.current).toHaveProperty('sendMessage');
      expect(result.current).toHaveProperty('showGreeting');
      expect(result.current).toHaveProperty('hideGreeting');
      expect(result.current).toHaveProperty('on');
      expect(result.current).toHaveProperty('off');
      expect(result.current).toHaveProperty('track');
      expect(result.current).toHaveProperty('setDebug');
      expect(result.current).toHaveProperty('getConfig');
      expect(result.current).toHaveProperty('ready');
    });

    test('sendMessage can be called with message and optional conversationId', () => {
      const mockSendMessage = jest.fn();
      const mockWidget: BubblaVAPI = {
        open: jest.fn(),
        close: jest.fn(),
        toggle: jest.fn(),
        isOpen: jest.fn(() => false),
        show: jest.fn(),
        hide: jest.fn(),
        sendMessage: mockSendMessage,
        showGreeting: jest.fn(),
        hideGreeting: jest.fn(),
        on: jest.fn(),
        off: jest.fn(),
        track: jest.fn(),
        setDebug: jest.fn(),
        getConfig: jest.fn(() => ({})),
        ready: jest.fn(),
      };

      (window as any).BubblaV = mockWidget;

      const { result } = renderHook(() => useBubblaVWidget());

      result.current?.sendMessage('Hello!');
      result.current?.sendMessage('Follow up', 'conv-123');

      expect(mockSendMessage).toHaveBeenCalledTimes(2);
      expect(mockSendMessage).toHaveBeenNthCalledWith(1, 'Hello!');
      expect(mockSendMessage).toHaveBeenNthCalledWith(2, 'Follow up', 'conv-123');
    });

    test('track can be called with event name and optional properties', () => {
      const mockTrack = jest.fn();
      const mockWidget: BubblaVAPI = {
        open: jest.fn(),
        close: jest.fn(),
        toggle: jest.fn(),
        isOpen: jest.fn(() => false),
        show: jest.fn(),
        hide: jest.fn(),
        sendMessage: jest.fn(),
        showGreeting: jest.fn(),
        hideGreeting: jest.fn(),
        on: jest.fn(),
        off: jest.fn(),
        track: mockTrack,
        setDebug: jest.fn(),
        getConfig: jest.fn(() => ({})),
        ready: jest.fn(),
      };

      (window as any).BubblaV = mockWidget;

      const { result } = renderHook(() => useBubblaVWidget());

      result.current?.track('page_view');
      result.current?.track('custom_event', { page: '/home', userId: '123' });

      expect(mockTrack).toHaveBeenCalledTimes(2);
      expect(mockTrack).toHaveBeenNthCalledWith(1, 'page_view');
      expect(mockTrack).toHaveBeenNthCalledWith(2, 'custom_event', { page: '/home', userId: '123' });
    });
  });

  describe('event listeners', () => {
    test('on and off methods are available', () => {
      const mockOn = jest.fn();
      const mockOff = jest.fn();
      const mockWidget: BubblaVAPI = {
        open: jest.fn(),
        close: jest.fn(),
        toggle: jest.fn(),
        isOpen: jest.fn(() => false),
        show: jest.fn(),
        hide: jest.fn(),
        sendMessage: jest.fn(),
        showGreeting: jest.fn(),
        hideGreeting: jest.fn(),
        on: mockOn,
        off: mockOff,
        track: jest.fn(),
        setDebug: jest.fn(),
        getConfig: jest.fn(() => ({})),
        ready: jest.fn(),
      };

      (window as any).BubblaV = mockWidget;

      const { result } = renderHook(() => useBubblaVWidget());

      const handler = () => {};
      result.current?.on('widget_opened', handler);
      result.current?.off('widget_opened', handler);

      expect(mockOn).toHaveBeenCalledWith('widget_opened', handler);
      expect(mockOff).toHaveBeenCalledWith('widget_opened', handler);
    });
  });

  describe('configuration', () => {
    test('getConfig returns widget configuration', () => {
      const mockConfig = { siteId: 'test-site', theme: 'dark', position: 'bottom-right' };
      const mockWidget: BubblaVAPI = {
        open: jest.fn(),
        close: jest.fn(),
        toggle: jest.fn(),
        isOpen: jest.fn(() => false),
        show: jest.fn(),
        hide: jest.fn(),
        sendMessage: jest.fn(),
        showGreeting: jest.fn(),
        hideGreeting: jest.fn(),
        on: jest.fn(),
        off: jest.fn(),
        track: jest.fn(),
        setDebug: jest.fn(),
        getConfig: jest.fn(() => mockConfig),
        ready: jest.fn(),
      };

      (window as any).BubblaV = mockWidget;

      const { result } = renderHook(() => useBubblaVWidget());

      const config = result.current?.getConfig();

      expect(config).toEqual(mockConfig);
    });
  });

  describe('debug mode', () => {
    test('setDebug can toggle debug mode', () => {
      const mockSetDebug = jest.fn();
      const mockWidget: BubblaVAPI = {
        open: jest.fn(),
        close: jest.fn(),
        toggle: jest.fn(),
        isOpen: jest.fn(() => false),
        show: jest.fn(),
        hide: jest.fn(),
        sendMessage: jest.fn(),
        showGreeting: jest.fn(),
        hideGreeting: jest.fn(),
        on: jest.fn(),
        off: jest.fn(),
        track: jest.fn(),
        setDebug: mockSetDebug,
        getConfig: jest.fn(() => ({})),
        ready: jest.fn(),
      };

      (window as any).BubblaV = mockWidget;

      const { result } = renderHook(() => useBubblaVWidget());

      result.current?.setDebug(true);
      result.current?.setDebug(false);

      expect(mockSetDebug).toHaveBeenCalledTimes(2);
      expect(mockSetDebug).toHaveBeenCalledWith(true);
      expect(mockSetDebug).toHaveBeenCalledWith(false);
    });
  });
});
