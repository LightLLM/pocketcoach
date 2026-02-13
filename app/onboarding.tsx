import { useState } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useApp } from '@/context/AppContext';
import { AppText } from '@/components/Text';
import { Button } from '@/components/Button';
import { track } from '@/lib/analytics';
import { spacing } from '@/constants/spacing';
import { colors } from '@/constants/typography';

const { width } = Dimensions.get('window');

export default function Onboarding() {
  const router = useRouter();
  const { setOnboardingDone } = useApp();
  const [step, setStep] = useState(0);

  const finish = async () => {
    track('onboarding_complete');
    await setOnboardingDone(true);
    router.replace('/(tabs)');
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <View style={styles.container}>
        {step === 0 && (
          <>
            <AppText variant="largeTitle" style={styles.title}>
              Minimalist AI{'\n'}coaching in your pocket
            </AppText>
            <AppText variant="body" color="textSecondary" style={styles.body}>
              Choose a coach, add your context, and get clear next steps—without the noise.
            </AppText>
          </>
        )}
        {step === 1 && (
          <>
            <AppText variant="largeTitle" style={styles.title}>
              Your coach.{'\n'}Your rules.
            </AppText>
            <AppText variant="body" color="textSecondary" style={styles.body}>
              Browse templates or create your own. A few chats free every day; go Pro for unlimited access.
            </AppText>
          </>
        )}

        <View style={styles.dots}>
          <View style={[styles.dot, step === 0 && styles.dotActive]} />
          <View style={[styles.dot, step === 1 && styles.dotActive]} />
        </View>

        <View style={styles.actions}>
          {step === 0 ? (
            <Button title="Next" onPress={() => setStep(1)} />
          ) : (
            <Button title="Get started" onPress={finish} />
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xxl,
    justifyContent: 'space-between',
  },
  title: {
    marginBottom: spacing.md,
  },
  body: {
    maxWidth: width * 0.9,
  },
  dots: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.border,
  },
  dotActive: {
    backgroundColor: colors.primary,
    width: 24,
  },
  actions: {
    paddingBottom: spacing.xxl,
  },
});
