import { ScrollView, View, Text, StyleSheet, Alert } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '../../store/auth.store';
import { Button } from '../../components/ui/Button';
import { api } from '../../services/api';
import { Colors, Spacing, FontSize, Radius } from '../../constants/theme';
import type { UserStats } from '@louharya/shared';

export default function ProfileTab() {
  const { user, logout } = useAuthStore();
  const { data: stats } = useQuery<UserStats>({
    queryKey: ['user', 'stats'],
    queryFn: async () => {
      const { data } = await api.get('/sessions/stats');
      return data.data;
    },
  });

  const handleLogout = () => {
    Alert.alert('End session', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Log out', style: 'destructive', onPress: async () => { await logout(); router.replace('/(auth)/welcome'); } },
    ]);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>Profile</Text>
        <Text style={styles.name}>{user?.name}</Text>
        <Text style={styles.email}>{user?.email}</Text>

        {stats && (
          <View style={styles.statsGrid}>
            <StatCard label="Sessions" value={stats.totalSessionsCompleted} />
            <StatCard label="Minutes" value={stats.totalMinutesMeditated} />
            <StatCard label="Streak" value={`${stats.currentStreakDays}d`} />
            <StatCard label="Best Streak" value={`${stats.longestStreakDays}d`} />
          </View>
        )}

        <Button label="Log out" variant="secondary" onPress={handleLogout} style={{ marginTop: Spacing.xl }} />
      </ScrollView>
    </SafeAreaView>
  );
}

function StatCard({ label, value }: { label: string; value: number | string }) {
  return (
    <View style={statStyles.card}>
      <Text style={statStyles.value}>{value}</Text>
      <Text style={statStyles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  scroll: { paddingHorizontal: Spacing.lg, paddingBottom: Spacing.xxl, gap: Spacing.sm },
  title: { color: Colors.text, fontSize: FontSize.xxl, fontWeight: '800', paddingTop: Spacing.lg },
  name: { color: Colors.text, fontSize: FontSize.xl, fontWeight: '700' },
  email: { color: Colors.textMuted, fontSize: FontSize.sm },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm, marginTop: Spacing.lg },
});

const statStyles = StyleSheet.create({
  card: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  value: { color: Colors.accent, fontSize: FontSize.xxl, fontWeight: '800' },
  label: { color: Colors.textMuted, fontSize: FontSize.sm, marginTop: Spacing.xs },
});
