import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { getFeaturedMeditations, getCategories } from '@/services/api';
import { Meditation, Category } from '@/types';
import { Colors, Spacing, FontSize, BorderRadius } from '@/constants/theme';
import MeditationCard from '@/components/MeditationCard';
import CategoryChip from '@/components/CategoryChip';

export default function HomeScreen() {
  const { user } = useAuth();
  const router = useRouter();
  const [featured, setFeatured] = useState<Meditation[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getFeaturedMeditations(), getCategories()])
      .then(([f, c]) => {
        setFeatured(f);
        setCategories(c);
      })
      .finally(() => setLoading(false));
  }, []);

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <LinearGradient colors={['#0F0A1E', '#1A0F2E']} style={styles.gradient}>
      <SafeAreaView style={styles.safe}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.greeting}>
              {greeting()}, {user?.name.split(' ')[0]}
            </Text>
            <Text style={styles.subGreeting}>What practice calls you today?</Text>
          </View>

          {/* Quote / Daily intention */}
          <View style={styles.intentionCard}>
            <Text style={styles.intentionLabel}>Today&apos;s Intention</Text>
            <Text style={styles.intentionText}>
              &ldquo;The path to transformation begins with returning to your Source Frequency.&rdquo;
            </Text>
            <Text style={styles.intentionAuthor}>— Louharya</Text>
          </View>

          {/* Categories */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Explore</Text>
            {loading ? (
              <ActivityIndicator color={Colors.primary} style={{ marginTop: Spacing.md }} />
            ) : (
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chips}>
                {categories.map((cat) => (
                  <CategoryChip
                    key={cat.id}
                    category={cat}
                    onPress={() =>
                      router.push({
                        pathname: '/(tabs)/library',
                        params: { categoryId: cat.id },
                      })
                    }
                  />
                ))}
              </ScrollView>
            )}
          </View>

          {/* Featured meditations */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Featured Practices</Text>
            {loading ? (
              <ActivityIndicator color={Colors.primary} style={{ marginTop: Spacing.md }} />
            ) : featured.length === 0 ? (
              <Text style={styles.emptyText}>No meditations available yet.</Text>
            ) : (
              featured.map((m) => (
                <MeditationCard
                  key={m.id}
                  meditation={m}
                  onPress={() => router.push(`/meditation/${m.id}`)}
                />
              ))
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  safe: { flex: 1 },
  scroll: { padding: Spacing.lg, paddingBottom: Spacing.xxl },
  header: { marginBottom: Spacing.xl },
  greeting: {
    fontSize: FontSize.xxl,
    fontWeight: '300',
    color: Colors.textPrimary,
    letterSpacing: 0.5,
  },
  subGreeting: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
  },
  intentionCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.xl,
    borderLeftWidth: 3,
    borderLeftColor: Colors.primary,
  },
  intentionLabel: {
    fontSize: FontSize.xs,
    color: Colors.primary,
    fontWeight: '600',
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: Spacing.sm,
  },
  intentionText: {
    fontSize: FontSize.md,
    color: Colors.textPrimary,
    lineHeight: 24,
    fontStyle: 'italic',
  },
  intentionAuthor: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    marginTop: Spacing.sm,
  },
  section: { marginBottom: Spacing.xl },
  sectionTitle: {
    fontSize: FontSize.lg,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
  },
  chips: { flexDirection: 'row' },
  emptyText: { color: Colors.textMuted, fontSize: FontSize.sm },
});
