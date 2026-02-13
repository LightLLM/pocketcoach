import { useState, useMemo } from 'react';
import { View, StyleSheet, FlatList, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppText } from '@/components/Text';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Chip } from '@/components/Chip';
import { useApp } from '@/context/AppContext';
import { COACH_CATEGORIES } from '@/data/coaches';
import type { Coach } from '@/types/coach';
import { spacing } from '@/constants/spacing';
import { colors } from '@/constants/typography';

export default function Home() {
  const router = useRouter();
  const { allCoaches } = useApp();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<Coach['category'] | 'all'>('all');

  const filtered = useMemo(() => {
    let list = allCoaches;
    if (category !== 'all') {
      list = list.filter((c) => c.category === category);
    }
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.tagline.toLowerCase().includes(q)
      );
    }
    return list;
  }, [allCoaches, category, search]);

  const onCoachPress = (coach: Coach) => {
    router.push(`/coach/${coach.id}`);
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <AppText variant="largeTitle">Coaches</AppText>
        <AppText variant="body" color="textSecondary" style={styles.subtitle}>
          Pick one or create your own
        </AppText>
      </View>

      <TextInput
        style={styles.search}
        placeholder="Search coaches…"
        placeholderTextColor={colors.textMuted}
        value={search}
        onChangeText={setSearch}
      />

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          <View style={styles.chips}>
            <Chip
              label="All"
              selected={category === 'all'}
              onPress={() => setCategory('all')}
            />
            {COACH_CATEGORIES.map((cat) => (
              <Chip
                key={cat.key}
                label={cat.label}
                selected={category === cat.key}
                onPress={() => setCategory(cat.key)}
              />
            ))}
          </View>
        }
        renderItem={({ item: coach }) => (
          <Card style={styles.card} onPress={() => onCoachPress(coach)}>
            <View style={styles.cardHeader}>
              <AppText variant="title2">{coach.name}</AppText>
              {coach.isPro && (
                <View style={styles.proBadge}>
                  <AppText variant="caption" color="textMuted">Pro</AppText>
                </View>
              )}
            </View>
            <AppText variant="bodySmall" color="textSecondary">
              {coach.tagline}
            </AppText>
          </Card>
        )}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />

      <View style={styles.fab}>
        <Button
          title="Create your coach"
          variant="secondary"
          onPress={() => router.push('/coach/create')}
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
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
  },
  subtitle: {
    marginTop: spacing.xxs,
  },
  search: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.sm,
    height: 44,
    backgroundColor: colors.surface,
    borderRadius: 12,
    paddingHorizontal: spacing.md,
    fontSize: 16,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
  },
  list: {
    paddingHorizontal: spacing.lg,
    paddingBottom: 100,
  },
  card: {
    marginBottom: spacing.sm,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.xxs,
  },
  proBadge: {
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
    backgroundColor: colors.surfaceSubtle,
    borderRadius: 6,
  },
  fab: {
    position: 'absolute',
    left: spacing.lg,
    right: spacing.lg,
    bottom: spacing.lg,
  },
});
