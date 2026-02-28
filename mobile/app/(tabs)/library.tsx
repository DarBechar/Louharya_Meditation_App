import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { getMeditations, getCategories } from '@/services/api';
import { Meditation, Category } from '@/types';
import { Colors, Spacing, FontSize, BorderRadius } from '@/constants/theme';
import MeditationCard from '@/components/MeditationCard';
import CategoryChip from '@/components/CategoryChip';

export default function LibraryScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ categoryId?: string }>();

  const [meditations, setMeditations] = useState<Meditation[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(params.categoryId);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [meds, cats] = await Promise.all([
        getMeditations({ categoryId: selectedCategory, search: search || undefined }),
        categories.length ? Promise.resolve(categories) : getCategories(),
      ]);
      setMeditations(meds);
      if (!categories.length) setCategories(cats);
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, search]);

  useEffect(() => {
    const timer = setTimeout(load, search ? 300 : 0);
    return () => clearTimeout(timer);
  }, [load]);

  function toggleCategory(id: string) {
    setSelectedCategory((prev) => (prev === id ? undefined : id));
  }

  return (
    <LinearGradient colors={['#0F0A1E', '#1A0F2E']} style={styles.gradient}>
      <SafeAreaView style={styles.safe}>
        <View style={styles.container}>
          {/* Header */}
          <Text style={styles.title}>Meditation Library</Text>

          {/* Search */}
          <TextInput
            style={styles.searchInput}
            placeholder="Search meditations..."
            placeholderTextColor={Colors.textMuted}
            value={search}
            onChangeText={setSearch}
          />

          {/* Category filter */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.categories}
            contentContainerStyle={{ paddingHorizontal: Spacing.lg }}
          >
            {categories.map((cat) => (
              <CategoryChip
                key={cat.id}
                category={cat}
                selected={selectedCategory === cat.id}
                onPress={() => toggleCategory(cat.id)}
              />
            ))}
          </ScrollView>

          {/* Results */}
          {loading ? (
            <ActivityIndicator color={Colors.primary} style={styles.loader} />
          ) : (
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.list}
            >
              {meditations.length === 0 ? (
                <View style={styles.empty}>
                  <Text style={styles.emptyTitle}>No meditations found</Text>
                  <Text style={styles.emptyText}>Try a different search or category.</Text>
                </View>
              ) : (
                meditations.map((m) => (
                  <MeditationCard
                    key={m.id}
                    meditation={m}
                    onPress={() => router.push(`/meditation/${m.id}`)}
                  />
                ))
              )}
            </ScrollView>
          )}
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  safe: { flex: 1 },
  container: { flex: 1 },
  title: {
    fontSize: FontSize.xxl,
    fontWeight: '300',
    color: Colors.textPrimary,
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
    marginTop: Spacing.sm,
  },
  searchInput: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    color: Colors.textPrimary,
    fontSize: FontSize.md,
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
  },
  categories: { marginBottom: Spacing.md },
  loader: { marginTop: Spacing.xxl },
  list: { paddingHorizontal: Spacing.lg, paddingBottom: Spacing.xxl },
  empty: { alignItems: 'center', marginTop: Spacing.xxl },
  emptyTitle: { fontSize: FontSize.lg, color: Colors.textPrimary, marginBottom: Spacing.sm },
  emptyText: { fontSize: FontSize.sm, color: Colors.textSecondary },
});
