import { useUserStore } from '@/store/userStore';
import { Pressable, StyleSheet, Text, View } from 'react-native';

export default function Profile() {
  const { user, totalScans: totalSorted, streakDays: streakCount, reset } = useUserStore();
  const userId = user?.id;

  const name = userId ? `User ${userId.slice(0, 4)}` : 'Guest';
  const initials = name.charAt(0).toUpperCase();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{initials}</Text>
        </View>
        <Text style={styles.name}>{name}</Text>
      </View>

      <View style={styles.statsCard}>
        <View style={styles.statRow}>
          <Text style={styles.statLabel}>Total sorted</Text>
          <Text style={styles.statValue}>{totalSorted}</Text>
        </View>

        <View style={styles.statRow}>
          <Text style={styles.statLabel}>Streak</Text>
          <Text style={styles.statValue}>{streakCount} days</Text>
        </View>
      </View>

      <Pressable style={styles.button} onPress={reset}>
        <Text style={styles.buttonText}>Sign out</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F5F0',
    paddingHorizontal: 16,
    paddingTop: 32,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#7DB87A',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  avatarText: {
    fontSize: 28,
    fontWeight: '600',
    color: '#ffffff',
  },
  name: {
    fontSize: 18,
    fontWeight: '500',
    color: '#111827',
  },
  statsCard: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    borderWidth: 0.5,
    borderColor: '#e5e2da',
    padding: 16,
    marginBottom: 24,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  statLabel: {
    fontSize: 14,
    color: '#6b7280',
  },
  statValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
  },
  button: {
    backgroundColor: '#ef4444',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: '500',
  },
});