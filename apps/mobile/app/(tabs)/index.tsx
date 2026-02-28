import { ScrollView, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFeaturedMeditations, useCategories } from '../../hooks/useMeditations';
import { MeditationCard } from '../../components/MeditationCard';
import { useAuthStore } from '../../store/auth.store';
import { Colors, Spacing, FontSize } from '../../constants/theme';

export default function HomeTab() {
  const user = useAuthStore((s) => s.user);
  const { data: featured, isLoading: loadingFeatured } = useFeaturedMeditations();
  const { data: categories } = useCategories();

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.greeting}>Good day,</Text>
          <Text style={styles.name}>{user?.name ?? 'Practitioner'}</Text>
        </View>

        <Text style={styles.sectionTitle}>Featured Practices</Text>
        {loadingFeatured ? (
          <Text style={styles.loading}>Loading…</Text>
        ) : (
          featured?.map((m) => (
            <MeditationCard key={m.id} meditation={m} onPress={() => router.push(`/meditation/${m.id}`)} />
          ))
        )}

        <Text style={styles.sectionTitle}>Domains</Text>
        <View style={styles.domains}>
          {categories?.map((c) => (
            <TouchableOpacity
              key={c.id}
              style={styles.domainChip}
              onPress={() => router.push(`/(tabs)/library?categoryId=${c.id}`)}
              activeOpacity={0.7}
            >
              <Text style={styles.domainText}>{c.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  scroll: { paddingHorizontal: Spacing.lg, paddingBottom: Spacing.xxl, gap: Spacing.md },
  header: { paddingTop: Spacing.lg },
  greeting: { color: Colors.textMuted, fontSize: FontSize.md },
  name: { color: Colors.text, fontSize: FontSize.xxl, fontWeight: '800' },
  sectionTitle: { color: Colors.text, fontSize: FontSize.lg, fontWeight: '700', marginTop: Spacing.md },
  loading: { color: Colors.textMuted, fontSize: FontSize.sm },
  domains: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  domainChip: { backgroundColor: Colors.surface, borderRadius: 9999, paddingHorizontal: Spacing.md, paddingVertical: Spacing.xs, borderWidth: 1, borderColor: Colors.border },
  domainText: { color: Colors.textMuted, fontSize: FontSize.sm },
});
