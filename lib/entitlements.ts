import { Purchases, CustomerInfo } from 'react-native-purchases';

const ENTITLEMENT_ID = 'pro';

export async function isProUser(): Promise<boolean> {
  try {
    const customerInfo = await Purchases.getCustomerInfo();
    return checkProEntitlement(customerInfo);
  } catch {
    return false;
  }
}

export function checkProEntitlement(customerInfo: CustomerInfo): boolean {
  const entitlement = customerInfo.entitlements.active[ENTITLEMENT_ID];
  return entitlement != null;
}

export function getEntitlementId(): string {
  return ENTITLEMENT_ID;
}
