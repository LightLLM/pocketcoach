import { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useApp } from '@/context/AppContext';
import { AppText } from '@/components/Text';
import { colors, typography } from '@/constants/typography';
import { spacing } from '@/constants/spacing';

export default function Index() {
  const router = useRouter();
  const { onboardingDone, isLoading } = useApp();

  useEffect(() => {
    if (isLoading) return;
    if (onboardingDone) {
      router.replace('/(tabs)');
    } else {
      router.replace('/onboarding');
    }
  }, [onboardingDone, isLoading, router]);

  return (
    <View style={styles.container}>
      <AppText variant="title1" style={styles.title}>
        Pocket Coach
      </AppText>
      <ActivityIndicator size="large" color={colors.primary} style={styles.spinner} />
      <AppText variant="caption" color="textMuted">
        Loading…
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
    padding: spacing.xl,
  },
  title: {
    marginBottom: spacing.lg,
  },
  spinner: {
    marginVertical: spacing.md,
  },
});
