import { useState, useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { AppText } from '@/components/Text';
import { Button } from '@/components/Button';
import { useApp } from '@/context/AppContext';
import { sendChatMessage } from '@/lib/aiClient';
import type { Coach, ChatMessage } from '@/types/coach';
import { spacing } from '@/constants/spacing';
import { colors } from '@/constants/typography';

const QUICK_PROMPTS = ['Summarize', 'Next step', 'Make it smaller', 'One question'];

export default function Chat() {
  const { coachId } = useLocalSearchParams<{ coachId: string }>();
  const router = useRouter();
  const { allCoaches, userProfile, chatSessions, updateChatSession, canSendMessage, incrementDailyMessageCount } = useApp();
  const coach = allCoaches.find((c) => c.id === coachId) as Coach | undefined;
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const listRef = useRef<FlatList>(null);
  const session = coach ? chatSessions[coach.id] : null;
  const messages = session?.messages ?? [];

  useEffect(() => {
    if (!coach) return;
    listRef.current?.scrollToEnd({ animated: true });
  }, [messages.length, coach]);

  if (!coach) {
    return (
      <SafeAreaView style={styles.safe} edges={['top']}>
        <View style={styles.center}>
          <AppText variant="body" color="textSecondary">Coach not found</AppText>
          <Button title="Back" variant="ghost" onPress={() => router.back()} style={styles.backBtn} />
        </View>
      </SafeAreaView>
    );
  }

  const canSend = canSendMessage();
  const handleSend = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;
    if (!canSend) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      router.push('/paywall');
      return;
    }

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setInput('');
    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      role: 'user',
      content: trimmed,
      timestamp: Date.now(),
    };
    const nextMessages = [...messages, userMsg];
    await updateChatSession(coach.id, {
      coachId: coach.id,
      messages: nextMessages,
      updatedAt: Date.now(),
    });

    setLoading(true);
    await incrementDailyMessageCount();
    try {
      const history = nextMessages.map((m) => ({ role: m.role, content: m.content }));
      const reply = await sendChatMessage(coach, userProfile ?? null, trimmed, history);
      const assistantMsg: ChatMessage = {
        id: `a-${Date.now()}`,
        role: 'assistant',
        content: reply,
        timestamp: Date.now(),
      };
      updateChatSession(coach.id, {
        coachId: coach.id,
        messages: [...nextMessages, assistantMsg],
        updatedAt: Date.now(),
      });
    } catch (e) {
      console.warn('Chat send failed', e);
      const errMsg: ChatMessage = {
        id: `e-${Date.now()}`,
        role: 'assistant',
        content: 'Something went wrong. Try again in a moment.',
        timestamp: Date.now(),
      };
      updateChatSession(coach.id, {
        coachId: coach.id,
        messages: [...nextMessages, errMsg],
        updatedAt: Date.now(),
      });
    } finally {
      setLoading(false);
    }
  };

  const onQuickPrompt = (prompt: string) => {
    const last = messages.filter((m) => m.role === 'assistant').pop();
    const context = last ? `Context: ${last.content.slice(0, 100)}...\n\n` : '';
    handleSend(context + prompt);
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backTouch}>
          <AppText variant="label" color="primary">Back</AppText>
        </TouchableOpacity>
        <AppText variant="title2" numberOfLines={1} style={styles.title}>
          {coach.name}
        </AppText>
        <View style={styles.placeholder} />
      </View>

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={0}
      >
        {messages.length === 0 ? (
          <View style={styles.empty}>
            <AppText variant="body" color="textSecondary" style={styles.emptyText}>
              Say something or tap a prompt below.
            </AppText>
            <View style={styles.quickRow}>
              {coach.starterPrompts.slice(0, 3).map((p, i) => (
                <TouchableOpacity
                  key={i}
                  style={styles.quickChip}
                  onPress={() => handleSend(p)}
                  disabled={loading || !canSend}
                >
                  <AppText variant="bodySmall" color="textSecondary">{p}</AppText>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ) : (
          <FlatList
            ref={listRef}
            data={messages}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.list}
            renderItem={({ item }) => (
              <View style={[styles.bubble, item.role === 'user' ? styles.bubbleUser : styles.bubbleAssistant]}>
                <AppText variant="body" style={item.role === 'user' ? styles.textUser : undefined}>
                  {item.content}
                </AppText>
              </View>
            )}
            ListFooterComponent={
              loading ? (
                <View style={styles.loadingRow}>
                  <ActivityIndicator size="small" color={colors.primary} />
                  <AppText variant="caption" color="textMuted" style={styles.loadingText}>
                    Thinking…
                  </AppText>
                </View>
              ) : null
            }
          />
        )}

        <View style={styles.quickPrompts}>
          {QUICK_PROMPTS.map((p, i) => (
            <TouchableOpacity
              key={i}
              style={styles.quickChip}
              onPress={() => onQuickPrompt(p)}
              disabled={loading || !canSend}
            >
              <AppText variant="caption" color="textSecondary">{p}</AppText>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            placeholder={canSend ? 'Message…' : 'Daily limit reached — go Pro'}
            placeholderTextColor={colors.textMuted}
            value={input}
            onChangeText={setInput}
            onSubmitEditing={() => handleSend(input)}
            editable={!loading}
            returnKeyType="send"
          />
          <Button
            title="Send"
            onPress={() => handleSend(input)}
            disabled={!input.trim() || loading || !canSend}
            style={styles.sendBtn}
          />
        </View>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.surface,
  },
  backTouch: {
    padding: spacing.xs,
  },
  title: {
    flex: 1,
    textAlign: 'center',
  },
  placeholder: {
    width: 50,
  },
  list: {
    padding: spacing.lg,
    paddingBottom: spacing.sm,
  },
  bubble: {
    maxWidth: '85%',
    padding: spacing.md,
    borderRadius: 16,
    marginBottom: spacing.sm,
  },
  bubbleUser: {
    alignSelf: 'flex-end',
    backgroundColor: colors.primary,
  },
  bubbleAssistant: {
    alignSelf: 'flex-start',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  textUser: {
    color: colors.surface,
  },
  loadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.sm,
  },
  loadingText: {
    marginLeft: spacing.xs,
  },
  empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  emptyText: {
    marginBottom: spacing.lg,
    textAlign: 'center',
  },
  quickRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: spacing.xs,
  },
  quickPrompts: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  quickChip: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    backgroundColor: colors.surfaceSubtle,
    borderRadius: 9999,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    padding: spacing.md,
    paddingBottom: spacing.lg,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  input: {
    flex: 1,
    height: 44,
    backgroundColor: colors.background,
    borderRadius: 22,
    paddingHorizontal: spacing.md,
    fontSize: 16,
    color: colors.text,
  },
  sendBtn: {
    minHeight: 44,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backBtn: {
    marginTop: spacing.md,
  },
});
