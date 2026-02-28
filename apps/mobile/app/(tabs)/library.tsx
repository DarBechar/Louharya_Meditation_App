import { useState } from 'react';
import { ScrollView, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useMeditations, useCategories } from '../../hooks/useMeditations';
import { MeditationCard } from '../../components/MeditationCard';
import { Colors, Spacing, FontSize, Radius } from '../../constants/theme';

export default function LibraryTab() {
  const { data: categories } = useCategories();
  const params = useLocalSearchParams<{ categoryId?: string }>();
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | undefined>(params.categoryId);
  const { data: meditations, isLoading } = useMeditations(selectedCategoryId);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Library</Text>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filters}>
          <TouchableOpacity
            style={[styles.chip, !selectedCategoryId && styles.chipActive]}
            onPress={() => setSelectedCategoryId(undefined)}
          >
            <Text style={[styles.chipText, !selectedCategoryId && styles.chipTextActive]}>All</Text>
          </TouchableOpacity>
          {categories?.map((c) => (
            <TouchableOpacity
              key={c.id}
              style={[styles.chip, selectedCategoryId === c.id && styles.chipActive]}
              onPress={() => setSelectedCategoryId(c.id)}
            >
              <Text style={[styles.chipText, selectedCategoryId === c.id && styles.chipTextActive]}>{c.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {isLoading ? (
          <Text style={styles.loading}>Loading…</Text>
        ) : (
          meditations?.map((m) => (
            <MeditationCard key={m.id} meditation={m} onPress={() => router.push(`/meditation/${m.id}`)} compact />
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  scroll: { paddingHorizontal: Spacing.lg, paddingBottom: Spacing.xxl, gap: Spacing.md },
  title: { color: Colors.text, fontSize: FontSize.xxl, fontWeight: '800', paddingTop: Spacing.lg },
  filters: { gap: Spacing.sm, paddingVertical: Spacing.xs },
  chip: { paddingHorizontal: Spacing.md, paddingVertical: Spacing.xs, borderRadius: Radius.full, borderWidth: 1, borderColor: Colors.border, backgroundColor: Colors.surface },
  chipActive: { backgroundColor: Colors.accent, borderColor: Colors.accent },
  chipText: { color: Colors.textMuted, fontSize: FontSize.sm },
  chipTextActive: { color: Colors.text, fontWeight: '600' },
  loading: { color: Colors.textMuted, fontSize: FontSize.sm },
});
