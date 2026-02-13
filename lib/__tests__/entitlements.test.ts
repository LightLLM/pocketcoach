import {
  checkProEntitlement,
  getEntitlementId,
  isProUser,
} from '../entitlements';

describe('entitlements', () => {
  describe('getEntitlementId', () => {
    it('returns "pro"', () => {
      expect(getEntitlementId()).toBe('pro');
    });
  });

  describe('checkProEntitlement', () => {
    it('returns false when entitlements.active has no pro', () => {
      expect(
        checkProEntitlement({
          entitlements: { active: {} },
        } as never)
      ).toBe(false);
    });

    it('returns false when pro is null', () => {
      expect(
        checkProEntitlement({
          entitlements: { active: { pro: null } },
        } as never)
      ).toBe(false);
    });

    it('returns true when pro entitlement exists', () => {
      expect(
        checkProEntitlement({
          entitlements: { active: { pro: { identifier: 'pro' } } },
        } as never)
      ).toBe(true);
    });
  });

  describe('isProUser', () => {
    it('returns false when Purchases.getCustomerInfo has no pro', async () => {
      expect(await isProUser()).toBe(false);
    });

    it('returns true when Purchases.getCustomerInfo has pro', async () => {
      const Purchases = require('react-native-purchases').Purchases;
      (Purchases.getCustomerInfo as jest.Mock).mockResolvedValueOnce({
        entitlements: { active: { pro: { identifier: 'pro' } } },
      });
      expect(await isProUser()).toBe(true);
    });

    it('returns false when getCustomerInfo throws', async () => {
      const Purchases = require('react-native-purchases').Purchases;
      (Purchases.getCustomerInfo as jest.Mock).mockRejectedValueOnce(
        new Error('network')
      );
      expect(await isProUser()).toBe(false);
    });
  });
});
