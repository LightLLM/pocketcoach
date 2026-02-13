import { track } from '../analytics';

const originalDev = global.__DEV__;

describe('analytics', () => {
  let consoleSpy: jest.SpyInstance;

  beforeAll(() => {
    (global as unknown as { __DEV__: boolean }).__DEV__ = true;
    consoleSpy = jest.spyOn(console, 'log').mockImplementation();
  });

  afterAll(() => {
    (global as unknown as { __DEV__: boolean }).__DEV__ = originalDev;
    consoleSpy.mockRestore();
  });

  beforeEach(() => {
    consoleSpy.mockClear();
  });

  it('calls console.log in __DEV__ for view_coach', () => {
    track('view_coach');
    expect(consoleSpy).toHaveBeenCalledWith('[Analytics] view_coach', '');
  });

  it('calls console.log with props when provided', () => {
    track('start_chat', { coachId: 'atomic-habits' });
    expect(consoleSpy).toHaveBeenCalledWith('[Analytics] start_chat', {
      coachId: 'atomic-habits',
    });
  });

  it('tracks paywall_view', () => {
    track('paywall_view');
    expect(consoleSpy).toHaveBeenCalledWith('[Analytics] paywall_view', '');
  });

  it('tracks purchase_success', () => {
    track('purchase_success');
    expect(consoleSpy).toHaveBeenCalledWith('[Analytics] purchase_success', '');
  });

  it('tracks onboarding_complete', () => {
    track('onboarding_complete');
    expect(consoleSpy).toHaveBeenCalledWith(
      '[Analytics] onboarding_complete',
      ''
    );
  });
});
