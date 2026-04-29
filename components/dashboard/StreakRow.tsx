import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Props {
  daysThisWeek: boolean[];
}

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export default function StreakRow({ daysThisWeek }: Props) {
  const streakCount = daysThisWeek.filter(Boolean).length;

  return (
    <View style={styles.card}>
      <View style={styles.summaryRow}>
        <View style={styles.summaryLeft}>
          <View style={styles.flameWrap}>
            <Ionicons name="flame" size={18} color="#DC2626" />
          </View>
          <View>
            <Text style={styles.streakCount}>{streakCount} active days</Text>
            <Text style={styles.streakSub}>this week</Text>
          </View>
        </View>
        <View style={[
          styles.weekBadge,
          { backgroundColor: streakCount >= 5 ? '#DCFCE7' : '#FEF3C7' }
        ]}>
          <Text style={[
            styles.weekBadgeText,
            { color: streakCount >= 5 ? '#16A34A' : '#D97706' }
          ]}>
            {streakCount}/7 days
          </Text>
        </View>
      </View>
      <View style={styles.pipsRow}>
        {DAYS.map((day, index) => {
          const active = daysThisWeek[index];
          return (
            <View key={index} style={styles.pipItem}>
              <View style={[
                styles.pip,
                active ? styles.pipActive : styles.pipInactive,
              ]}>
                {active && <Ionicons name="checkmark" size={10} color="#fff" />}
              </View>
              <Text style={[styles.dayLabel, active && styles.dayLabelActive]}>
                {day}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  summaryLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  flameWrap: {
    width: 36,
    height: 36,
    borderRadius: 11,
    backgroundColor: '#FEE2E2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  streakCount: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
  },
  streakSub: {
    fontSize: 11,
    color: '#9CA3AF',
    marginTop: 1,
  },
  weekBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  weekBadgeText: {
    fontSize: 12,
    fontWeight: '700',
  },
  pipsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  pipItem: {
    alignItems: 'center',
    gap: 6,
  },
  pip: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pipActive: {
    backgroundColor: '#16A34A',
    shadowColor: '#16A34A',
    shadowOpacity: 0.35,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
  pipInactive: {
    backgroundColor: '#F3F4F6',
  },
  dayLabel: {
    fontSize: 10,
    color: '#9CA3AF',
    fontWeight: '500',
  },
  dayLabelActive: {
    color: '#16A34A',
    fontWeight: '700',
  },
});