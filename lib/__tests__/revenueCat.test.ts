import { initRevenueCat } from '../revenueCat';
import { Purchases } from 'react-native-purchases';

jest.mock('react-native-purchases');

describe('revenueCat', () => {
  let consoleSpy: jest.SpyInstance;

  beforeEach(() => {
    consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  it('resolves without throwing', async () => {
    await expect(initRevenueCat()).resolves.toBeUndefined();
  });

  it('does not call configure when API key is empty (default mock)', async () => {
    await initRevenueCat();
    expect(Purchases.configure).not.toHaveBeenCalled();
  });
});
