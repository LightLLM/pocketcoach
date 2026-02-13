import { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppText } from '@/components/Text';
import { Button } from '@/components/Button';
import { useApp } from '@/context/AppContext';
import { track } from '@/lib/analytics';
import { spacing } from '@/constants/spacing';
import { colors } from '@/constants/typography';

export default function Profile() {
  const { userProfile, setUserProfile } = useApp();
  const [values, setValues] = useState('');
  const [goals, setGoals] = useState('');
  const [constraints, setConstraints] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (userProfile) {
      setValues(userProfile.values ?? '');
      setGoals(userProfile.goals ?? '');
      setConstraints(userProfile.constraints ?? '');
    }
  }, [userProfile]);

  const save = async () => {
    setSaving(true);
    await setUserProfile({
      values: values.trim() || undefined,
      goals: goals.trim() || undefined,
      constraints: constraints.trim() || undefined,
    });
    track('profile_updated');
    setSaving(false);
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
            Your context
          </AppText>
          <AppText variant="body" color="textSecondary" style={styles.subtitle}>
            Optional. Coaches use this to personalize advice.
          </AppText>

          <AppText variant="label" style={styles.label}>Values</AppText>
          <TextInput
            style={[styles.input, styles.inputMultiline]}
            placeholder="What matters most to you?"
            placeholderTextColor={colors.textMuted}
            value={values}
            onChangeText={setValues}
            multiline
          />

          <AppText variant="label" style={styles.label}>Goals</AppText>
          <TextInput
            style={[styles.input, styles.inputMultiline]}
            placeholder="Short-term or long-term goals"
            placeholderTextColor={colors.textMuted}
            value={goals}
            onChangeText={setGoals}
            multiline
          />

          <AppText variant="label" style={styles.label}>Constraints</AppText>
          <TextInput
            style={[styles.input, styles.inputMultiline]}
            placeholder="Time, energy, or other limits"
            placeholderTextColor={colors.textMuted}
            value={constraints}
            onChangeText={setConstraints}
            multiline
          />

          <Button title="Save" onPress={save} loading={saving} style={styles.saveBtn} />
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
    minHeight: 80,
  },
  saveBtn: {
    marginTop: spacing.md,
  },
});
