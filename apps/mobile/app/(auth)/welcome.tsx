import { View, Text, StyleSheet, ImageBackground } from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../../components/ui/Button';
import { Colors, Spacing, FontSize } from '../../constants/theme';

export default function WelcomeScreen() {
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#0D0D0D', '#1A0A2E', '#0D0D0D']}
        style={StyleSheet.absoluteFillObject}
      />
      <SafeAreaView style={styles.safe}>
        <View style={styles.hero}>
          <Text style={styles.logo}>✦ Louharya</Text>
          <Text style={styles.tagline}>Ancient wisdom for{'\n'}modern stillness</Text>
          <Text style={styles.sub}>
            Seven domains of Louhar practice.{'\n'}One breath at a time.
          </Text>
        </View>

        <View style={styles.actions}>
          <Button label="Begin your practice" onPress={() => router.push('/(auth)/register')} />
          <Button
            label="I already practice"
            variant="ghost"
            onPress={() => router.push('/(auth)/login')}
          />
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safe: { flex: 1, paddingHorizontal: Spacing.lg },
  hero: { flex: 1, justifyContent: 'center', gap: Spacing.lg },
  logo: { color: Colors.gold, fontSize: FontSize.xl, fontWeight: '700', letterSpacing: 2, textTransform: 'uppercase' },
  tagline: { color: Colors.text, fontSize: FontSize.display, fontWeight: '800', lineHeight: 44 },
  sub: { color: Colors.textMuted, fontSize: FontSize.md, lineHeight: 26 },
  actions: { paddingBottom: Spacing.xl, gap: Spacing.sm },
});
