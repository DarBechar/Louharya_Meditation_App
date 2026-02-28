import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { getMySessions } from '@/services/api';
import { Session, SessionStats } from '@/types';
import { Colors, Spacing, FontSize, BorderRadius } from '@/constants/theme';

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return s > 0 ? `${m}m ${s}s` : `${m}m`;
}

export default function ProgressScreen() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [stats, setStats] = useState<SessionStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMySessions()
      .then(({ sessions, stats }) => {
        setSessions(sessions);
        setStats(stats);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <LinearGradient colors={['#0F0A1E', '#1A0F2E']} style={styles.gradient}>
      <SafeAreaView style={styles.safe}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
          <Text style={styles.title}>Your Journey</Text>

          {loading ? (
            <ActivityIndicator color={Colors.primary} style={styles.loader} />
          ) : (
            <>
              {/* Stats cards */}
              {stats && (
                <View style={styles.statsRow}>
                  <View style={styles.statCard}>
                    <Text style={styles.statValue}>{stats.totalSessions}</Text>
                    <Text style={styles.statLabel}>Sessions</Text>
                  </View>
                  <View style={styles.statCard}>
                    <Text style={styles.statValue}>{stats.totalMinutes}</Text>
                    <Text style={styles.statLabel}>Minutes</Text>
                  </View>
                  <View style={styles.statCard}>
                    <Text style={styles.statValue}>
                      {stats.totalSessions > 0
                        ? Math.round(stats.totalMinutes / stats.totalSessions)
                        : 0}
                    </Text>
                    <Text style={styles.statLabel}>Avg. Min</Text>
                  </View>
                </View>
              )}

              {/* Session history */}
              <Text style={styles.sectionTitle}>Recent Sessions</Text>
              {sessions.length === 0 ? (
                <View style={styles.empty}>
                  <Text style={styles.emptyTitle}>No sessions yet</Text>
                  <Text style={styles.emptyText}>
                    Complete your first meditation to start tracking your progress.
                  </Text>
                </View>
              ) : (
                sessions.map((session) => (
                  <View key={session.id} style={styles.sessionCard}>
                    <View
                      style={[
                        styles.sessionAccent,
                        { backgroundColor: session.meditation.category.color },
                      ]}
                    />
                    <View style={styles.sessionContent}>
                      <Text style={styles.sessionTitle}>{session.meditation.title}</Text>
                      <Text style={styles.sessionMeta}>
                        {formatDate(session.completedAt)} •{' '}
                        {formatDuration(session.durationComplete)} completed
                      </Text>
                      <Text
                        style={[
                          styles.sessionCategory,
                          { color: session.meditation.category.color },
                        ]}
                      >
                        {session.meditation.category.name}
                      </Text>
                    </View>
                  </View>
                ))
              )}
            </>
          )}
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  safe: { flex: 1 },
  scroll: { padding: Spacing.lg, paddingBottom: Spacing.xxl },
  title: {
    fontSize: FontSize.xxl,
    fontWeight: '300',
    color: Colors.textPrimary,
    marginBottom: Spacing.xl,
  },
  loader: { marginTop: Spacing.xxl },
  statsRow: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginBottom: Spacing.xl,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    alignItems: 'center',
  },
  statValue: {
    fontSize: FontSize.xxl,
    fontWeight: '300',
    color: Colors.primaryLight,
  },
  statLabel: {
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  sectionTitle: {
    fontSize: FontSize.lg,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
  },
  empty: { alignItems: 'center', marginTop: Spacing.xl },
  emptyTitle: { fontSize: FontSize.lg, color: Colors.textPrimary, marginBottom: Spacing.sm },
  emptyText: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  sessionCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.md,
    flexDirection: 'row',
    overflow: 'hidden',
  },
  sessionAccent: { width: 4 },
  sessionContent: { flex: 1, padding: Spacing.md },
  sessionTitle: {
    fontSize: FontSize.md,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  sessionMeta: { fontSize: FontSize.sm, color: Colors.textSecondary },
  sessionCategory: { fontSize: FontSize.xs, fontWeight: '600', marginTop: Spacing.xs },
});
