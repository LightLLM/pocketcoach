import { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Purchases, PurchasesOffering } from 'react-native-purchases';
import { AppText } from '@/components/Text';
import { Button } from '@/components/Button';
import { useApp } from '@/context/AppContext';
import { track } from '@/lib/analytics';
import { checkProEntitlement } from '@/lib/entitlements';
import { spacing } from '@/constants/spacing';
import { colors } from '@/constants/typography';

export default function Paywall() {
  const router = useRouter();
  const { refreshPro } = useApp();
  const [offering, setOffering] = useState<PurchasesOffering | null>(null);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const o = await Purchases.getOfferings();
        const current = o.current;
        if (!cancelled) {
          setOffering(current ?? null);
          if (current) track('paywall_view', { offeringId: current.identifier });
        }
      } catch (e) {
        if (!cancelled) {
          setError('Unable to load offerings.');
          if (__DEV__) console.warn('Offerings error', e);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const purchase = async (packageId: string) => {
    if (!offering) return;
    const pkg = offering.availablePackages.find((p) => p.identifier === packageId);
    if (!pkg) return;
    setPurchasing(true);
    setError(null);
    try {
      const { customerInfo } = await Purchases.purchasePackage(pkg);
      if (checkProEntitlement(customerInfo)) {
        track('purchase_success');
        await refreshPro();
        router.back();
      }
    } catch (e: unknown) {
      const err = e as { userCancelled?: boolean };
      if (!err?.userCancelled) {
        setError('Purchase failed. Try again or restore.');
        track('paywall_view', { error: String(e) });
      }
    } finally {
      setPurchasing(false);
    }
  };

  const restore = async () => {
    setPurchasing(true);
    setError(null);
    try {
      const customerInfo = await Purchases.restorePurchases();
      if (checkProEntitlement(customerInfo)) {
        track('restore_success');
        await refreshPro();
        router.back();
      } else {
        setError('No purchases to restore.');
      }
    } catch (e) {
      setError('Restore failed. Try again.');
    } finally {
      setPurchasing(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.primary} />
          <AppText variant="body" color="textSecondary" style={styles.loadingText}>
            Loading…
          </AppText>
        </View>
      </SafeAreaView>
    );
  }

  const packages = offering?.availablePackages ?? [];

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <TouchableOpacity style={styles.back} onPress={() => router.back()}>
        <AppText variant="label" color="primary">Back</AppText>
      </TouchableOpacity>
      <View style={styles.content}>
        <AppText variant="largeTitle" style={styles.title}>
          Go Pro
        </AppText>
        <AppText variant="body" color="textSecondary" style={styles.subtitle}>
          Unlock all coaches and unlimited chats. Cancel anytime.
        </AppText>

        {packages.length > 0 ? (
          <View style={styles.packages}>
            {packages.map((pkg) => (
              <TouchableOpacity
                key={pkg.identifier}
                style={styles.package}
                onPress={() => purchase(pkg.identifier)}
                disabled={purchasing}
              >
                <View>
                  <AppText variant="title2">{pkg.product.title}</AppText>
                  <AppText variant="bodySmall" color="textSecondary">
                    {pkg.product.priceString}
                    {pkg.packageType === 'MONTHLY' && ' / month'}
                    {pkg.packageType === 'ANNUAL' && ' / year'}
                  </AppText>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        ) : (
          <View style={styles.placeholder}>
            <AppText variant="body" color="textMuted">
              No subscription packages available. Configure in RevenueCat.
            </AppText>
          </View>
        )}

        {error ? (
          <AppText variant="bodySmall" color="error" style={styles.error}>
            {error}
          </AppText>
        ) : null}

        <Button
          title="Restore purchases"
          variant="ghost"
          onPress={restore}
          disabled={purchasing}
          style={styles.restore}
        />
        <Button
          title="Maybe later"
          variant="ghost"
          onPress={() => router.back()}
          disabled={purchasing}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  back: {
    padding: spacing.md,
    alignSelf: 'flex-start',
  },
  content: {
    flex: 1,
    padding: spacing.xl,
  },
  title: {
    marginBottom: spacing.xs,
  },
  subtitle: {
    marginBottom: spacing.xl,
  },
  packages: {
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  package: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: spacing.md,
  },
  placeholder: {
    paddingVertical: spacing.xl,
  },
  error: {
    marginBottom: spacing.sm,
  },
  restore: {
    marginBottom: spacing.sm,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: spacing.md,
  },
});
