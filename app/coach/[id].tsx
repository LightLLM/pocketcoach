import { useLocalSearchParams, useRouter } from 'expo-router';
import { View, StyleSheet, ScrollView, TouchableOpacity, Share } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppText } from '@/components/Text';
import { Button } from '@/components/Button';
import { useApp } from '@/context/AppContext';
import { track } from '@/lib/analytics';
import { spacing } from '@/constants/spacing';
import { colors } from '@/constants/typography';

export default function CoachDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { allCoaches, isPro } = useApp();
  const coach = allCoaches.find((c) => c.id === id);

  if (!coach) {
    return (
      <SafeAreaView style={styles.safe} edges={['top']}>
        <View style={styles.center}>
          <AppText variant="body" color="textSecondary">
            Coach not found
          </AppText>
          <Button title="Back" variant="ghost" onPress={() => router.back()} style={styles.backBtn} />
        </View>
      </SafeAreaView>
    );
  }

  track('view_coach', { coachId: coach.id });

  const needsPro = coach.isPro && !isPro;
  const shareCoach = () => {
    Share.share({
      message: `Try "${coach.name}" on Pocket Coach — ${coach.tagline}\nCoach ID: ${coach.id}`,
      title: coach.name,
    });
  };
  const startChat = () => {
    if (needsPro) {
      router.push('/paywall');
      return;
    }
    track('start_chat', { coachId: coach.id });
    router.push(`/chat/${coach.id}`);
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <TouchableOpacity style={styles.back} onPress={() => router.back()}>
        <AppText variant="label" color="primary">Back</AppText>
      </TouchableOpacity>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <AppText variant="largeTitle" style={styles.title}>
          {coach.name}
        </AppText>
        <AppText variant="body" color="textSecondary" style={styles.tagline}>
          {coach.tagline}
        </AppText>
        <AppText variant="body" style={styles.desc}>
          {coach.longDescription}
        </AppText>
        {coach.starterPrompts.length > 0 && (
          <>
            <AppText variant="label" style={styles.sectionTitle}>
              Try asking
            </AppText>
            {coach.starterPrompts.slice(0, 5).map((p, i) => (
              <View key={i} style={styles.promptRow}>
                <AppText variant="bodySmall" color="textSecondary">
                  • {p}
                </AppText>
              </View>
            ))}
          </>
        )}
        <View style={styles.actions}>
          <Button
            title={needsPro ? 'Unlock with Pro' : 'Start chat'}
            onPress={startChat}
            variant={needsPro ? 'pro' : 'primary'}
          />
          <Button title="Share coach" variant="ghost" onPress={shareCoach} style={styles.shareBtn} />
          {needsPro && (
            <AppText variant="caption" color="textMuted" style={styles.proHint}>
              Pro coaches and unlimited chats
            </AppText>
          )}
        </View>
      </ScrollView>
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
  scroll: {
    flex: 1,
  },
  content: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  title: {
    marginBottom: spacing.xs,
  },
  tagline: {
    marginBottom: spacing.lg,
  },
  desc: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    marginBottom: spacing.sm,
  },
  promptRow: {
    marginBottom: spacing.xs,
  },
  actions: {
    marginTop: spacing.xl,
  },
  shareBtn: {
    marginTop: spacing.sm,
  },
  proHint: {
    marginTop: spacing.xs,
    textAlign: 'center',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  backBtn: {
    marginTop: spacing.md,
  },
});
