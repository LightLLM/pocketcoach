import React from 'react';
import { render, waitFor, act } from '@testing-library/react-native';
import { AppProvider, useApp } from '../AppContext';
import * as storage from '@/lib/storage';
import { isProUser } from '@/lib/entitlements';

jest.mock('@/lib/storage');
jest.mock('@/lib/entitlements');

function TestConsumer() {
  const app = useApp();
  return null;
}

describe('AppContext', () => {
  beforeEach(() => {
    (storage.getOnboardingDone as jest.Mock).mockResolvedValue(false);
    (storage.getUserProfile as jest.Mock).mockResolvedValue(null);
    (storage.getCustomCoaches as jest.Mock).mockResolvedValue([]);
    (storage.getChatSessions as jest.Mock).mockResolvedValue({});
    (storage.getDailyMessageCount as jest.Mock).mockResolvedValue(0);
    (isProUser as jest.Mock).mockResolvedValue(false);
  });

  it('throws when useApp is used outside AppProvider', () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => render(<TestConsumer />)).toThrow(
      'useApp must be used within AppProvider'
    );
    consoleSpy.mockRestore();
  });

  it('loads initial state and sets isLoading false', async () => {
    render(
      <AppProvider>
        <TestConsumer />
      </AppProvider>
    );
    await waitFor(() => {
      expect(storage.getOnboardingDone).toHaveBeenCalled();
      expect(storage.getCustomCoaches).toHaveBeenCalled();
      expect(isProUser).toHaveBeenCalled();
    });
  });

  it('setOnboardingDone updates storage and state', async () => {
    const appRef: { current: ReturnType<typeof useApp> | null } = { current: null };
    function Consumer() {
      appRef.current = useApp();
      return null;
    }
    render(
      <AppProvider>
        <Consumer />
      </AppProvider>
    );
    await waitFor(() => expect(appRef.current?.isLoading).toBe(false));
    const app = appRef.current!;
    await act(async () => {
      await app.setOnboardingDone(true);
    });
    expect(storage.setOnboardingDone).toHaveBeenCalledWith(true);
  });

  it('canSendMessage returns true when isPro', async () => {
    (isProUser as jest.Mock).mockResolvedValue(true);
    const appRef: { current: ReturnType<typeof useApp> | null } = { current: null };
    function Consumer() {
      appRef.current = useApp();
      return null;
    }
    render(
      <AppProvider>
        <Consumer />
      </AppProvider>
    );
    await waitFor(() => expect(appRef.current?.isLoading).toBe(false));
    expect(appRef.current!.canSendMessage()).toBe(true);
  });

  it('canSendMessage returns true when dailyMessageCount < 3', async () => {
    (storage.getDailyMessageCount as jest.Mock).mockResolvedValue(1);
    const appRef: { current: ReturnType<typeof useApp> | null } = { current: null };
    function Consumer() {
      appRef.current = useApp();
      return null;
    }
    render(
      <AppProvider>
        <Consumer />
      </AppProvider>
    );
    await waitFor(() => expect(appRef.current?.isLoading).toBe(false));
    expect(appRef.current!.canSendMessage()).toBe(true);
  });

  it('canSendMessage returns false when dailyMessageCount >= 3 and not pro', async () => {
    (storage.getDailyMessageCount as jest.Mock).mockResolvedValue(3);
    const appRef: { current: ReturnType<typeof useApp> | null } = { current: null };
    function Consumer() {
      appRef.current = useApp();
      return null;
    }
    render(
      <AppProvider>
        <Consumer />
      </AppProvider>
    );
    await waitFor(() => expect(appRef.current?.isLoading).toBe(false));
    expect(appRef.current!.canSendMessage()).toBe(false);
  });

  it('allCoaches includes seeded coaches', async () => {
    const appRef: { current: ReturnType<typeof useApp> | null } = { current: null };
    function Consumer() {
      appRef.current = useApp();
      return null;
    }
    render(
      <AppProvider>
        <Consumer />
      </AppProvider>
    );
    await waitFor(() => expect(appRef.current?.isLoading).toBe(false));
    expect(appRef.current!.allCoaches.length).toBeGreaterThanOrEqual(8);
  });
});
