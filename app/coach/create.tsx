import { useState } from 'react';
import { View, StyleSheet, ScrollView, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppText } from '@/components/Text';
import { Button } from '@/components/Button';
import { useApp } from '@/context/AppContext';
import { track } from '@/lib/analytics';
import type { Coach } from '@/types/coach';
import { spacing } from '@/constants/spacing';
import { colors } from '@/constants/typography';

export default function CreateCoach() {
  const router = useRouter();
  const { addCustomCoach } = useApp();
  const [name, setName] = useState('');
  const [tone, setTone] = useState('');
  const [purpose, setPurpose] = useState('');
  const [rules, setRules] = useState('');
  const [saving, setSaving] = useState(false);

  const save = async () => {
    if (!name.trim()) return;
    setSaving(true);
    const id = `custom-${Date.now()}`;
    const coach: Coach = {
      id,
      name: name.trim(),
      tagline: purpose.trim() || 'Your custom coach',
      longDescription: purpose.trim() || `A coach that matches your style: ${tone.trim() || 'supportive'}.`,
      styleRules: rules
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean),
      starterPrompts: [
        'What should I focus on first?',
        'Give me one small step',
        'Help me think this through',
        'What would you do in my place?',
        'Summarize my options',
      ],
      category: 'habits',
      isPro: false,
      isCustom: true,
    };
    await addCustomCoach(coach);
    track('create_coach', { coachId: id });
    setSaving(false);
    router.replace(`/coach/${id}`);
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={80}
      >
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <AppText variant="largeTitle" style={styles.title}>
            Create your coach
          </AppText>
          <AppText variant="body" color="textSecondary" style={styles.subtitle}>
            Name, tone, purpose, and a few rules. Keep it simple.
          </AppText>

          <AppText variant="label" style={styles.label}>Name</AppText>
          <TextInput
            style={styles.input}
            placeholder="e.g. Calm Decision Buddy"
            placeholderTextColor={colors.textMuted}
            value={name}
            onChangeText={setName}
          />

          <AppText variant="label" style={styles.label}>Tone (optional)</AppText>
          <TextInput
            style={styles.input}
            placeholder="e.g. Warm, direct, no fluff"
            placeholderTextColor={colors.textMuted}
            value={tone}
            onChangeText={setTone}
          />

          <AppText variant="label" style={styles.label}>Purpose (optional)</AppText>
          <TextInput
            style={[styles.input, styles.inputMultiline]}
            placeholder="What should this coach help with?"
            placeholderTextColor={colors.textMuted}
            value={purpose}
            onChangeText={setPurpose}
            multiline
          />

          <AppText variant="label" style={styles.label}>Rules (one per line, optional)</AppText>
          <TextInput
            style={[styles.input, styles.inputMultiline, { minHeight: 80 }]}
            placeholder="e.g. Keep responses under 3 sentences"
            placeholderTextColor={colors.textMuted}
            value={rules}
            onChangeText={setRules}
            multiline
          />

          <View style={styles.actions}>
            <Button title="Create coach" onPress={save} loading={saving} disabled={!name.trim()} />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  flex: {
    flex: 1,
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
  subtitle: {
    marginBottom: spacing.lg,
  },
  label: {
    marginBottom: spacing.xs,
  },
  input: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontSize: 16,
    color: colors.text,
    marginBottom: spacing.md,
  },
  inputMultiline: {
    minHeight: 60,
  },
  actions: {
    marginTop: spacing.lg,
  },
});
