import { ScrollView, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useMeditation } from '../../hooks/useMeditations';
import { useToggleFavorite } from '../../hooks/useFavorites';
import { Button } from '../../components/ui/Button';
import { Colors, Spacing, FontSize, Radius } from '../../constants/theme';

export default function MeditationDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: meditation, isLoading } = useMeditation(id);
  const { isFavorite, toggle, isLoading: favLoading } = useToggleFavorite(id ?? '');

  if (isLoading || !meditation) {
    return (
      <View style={styles.center}>
        <Text style={{ color: Colors.textMuted }}>Loading…</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: Colors.background }}>
      <LinearGradient colors={['#1A0A2E', Colors.background]} style={styles.gradient} />
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scroll}>
          <View style={styles.topRow}>
            <TouchableOpacity onPress={() => router.back()} style={styles.closeBtn}>
              <Text style={{ color: Colors.textMuted, fontSize: FontSize.lg }}>✕</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={toggle} disabled={favLoading} style={styles.favBtn}>
              <Text style={{ fontSize: 22 }}>{isFavorite ? '♥' : '♡'}</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.domain}>{meditation.domain}</Text>
          <Text style={styles.title}>{meditation.title}</Text>

          <View style={styles.meta}>
            <MetaBadge label={`${meditation.durationMinutes} min`} />
            <MetaBadge label={meditation.difficulty} />
          </View>

          <Text style={styles.description}>{meditation.description}</Text>

          <Text style={styles.stepsTitle}>Practice Steps</Text>
          {meditation.content?.steps?.map((step, i) => (
            <View key={i} style={styles.stepRow}>
              <View style={styles.stepNum}>
                <Text style={styles.stepNumText}>{i + 1}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.stepTitle}>{step.title}</Text>
                <Text style={styles.stepInstr}>{step.instruction}</Text>
              </View>
            </View>
          ))}
        </ScrollView>

        <View style={styles.footer}>
          <Button label="Begin practice" onPress={() => router.push(`/player/${id}`)} />
        </View>
      </SafeAreaView>
    </View>
  );
}

function MetaBadge({ label }: { label: string }) {
  return (
    <View style={{ backgroundColor: Colors.surface, borderRadius: Radius.full, paddingHorizontal: Spacing.md, paddingVertical: Spacing.xs, borderWidth: 1, borderColor: Colors.border }}>
      <Text style={{ color: Colors.textMuted, fontSize: FontSize.sm, textTransform: 'capitalize' }}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.background },
  gradient: { position: 'absolute', top: 0, left: 0, right: 0, height: 300 },
  scroll: { paddingHorizontal: Spacing.lg, paddingBottom: 120, gap: Spacing.md },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: Spacing.md },
  closeBtn: { padding: Spacing.xs },
  favBtn: { padding: Spacing.xs },
  domain: { color: Colors.accent, fontSize: FontSize.xs, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1.5 },
  title: { color: Colors.text, fontSize: FontSize.display, fontWeight: '800', lineHeight: 44 },
  meta: { flexDirection: 'row', gap: Spacing.sm },
  description: { color: Colors.textMuted, fontSize: FontSize.md, lineHeight: 26 },
  stepsTitle: { color: Colors.text, fontSize: FontSize.lg, fontWeight: '700' },
  stepRow: { flexDirection: 'row', gap: Spacing.md, backgroundColor: Colors.surface, borderRadius: Radius.md, padding: Spacing.md, borderWidth: 1, borderColor: Colors.border },
  stepNum: { width: 28, height: 28, borderRadius: 14, backgroundColor: Colors.accent, alignItems: 'center', justifyContent: 'center' },
  stepNumText: { color: Colors.text, fontWeight: '700', fontSize: FontSize.sm },
  stepTitle: { color: Colors.text, fontWeight: '600', fontSize: FontSize.md },
  stepInstr: { color: Colors.textMuted, fontSize: FontSize.sm, lineHeight: 20, marginTop: 2 },
  footer: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: Spacing.lg, backgroundColor: Colors.background },
});
