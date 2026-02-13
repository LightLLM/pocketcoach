import { View, StyleSheet, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { AppText } from '@/components/Text';
import { Button } from '@/components/Button';
import { useApp } from '@/context/AppContext';
import { spacing } from '@/constants/spacing';
import { colors } from '@/constants/typography';

export default function Settings() {
  const router = useRouter();
  const { isPro, refreshPro } = useApp();

  const restore = async () => {
    try {
      const { Purchases } = await import('react-native-purchases');
      const customerInfo = await Purchases.restorePurchases();
      await refreshPro();
      if (customerInfo.entitlements.active['pro']) {
        router.back();
      }
    } catch (e) {
      console.warn('Restore failed', e);
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.content}>
        <AppText variant="largeTitle" style={styles.title}>
          Settings
        </AppText>

        {isPro && (
          <View style={styles.proBadge}>
            <AppText variant="label" color="textMuted">Pro</AppText>
          </View>
        )}

        <Button
          title="Restore purchases"
          variant="secondary"
          onPress={restore}
          style={styles.btn}
        />

        <AppText variant="caption" color="textMuted" style={styles.links}>
          <AppText
            variant="caption"
            color="primary"
            onPress={() => Linking.openURL('https://example.com/terms')}
          >
            Terms of Service
          </AppText>
          {' · '}
          <AppText
            variant="caption"
            color="primary"
            onPress={() => Linking.openURL('https://example.com/privacy')}
          >
            Privacy Policy
          </AppText>
        </AppText>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.lg,
  },
  title: {
    marginBottom: spacing.lg,
  },
  proBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    backgroundColor: colors.surfaceSubtle,
    borderRadius: 8,
    marginBottom: spacing.lg,
  },
  btn: {
    marginBottom: spacing.xl,
  },
  links: {
    marginTop: spacing.md,
  },
});
