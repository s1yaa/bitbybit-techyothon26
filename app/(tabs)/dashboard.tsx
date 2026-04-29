import { ScrollView, StyleSheet, Text, View } from 'react-native';

import CategoryChart from '@/components/dashboard/CategoryChart';
import ImpactStrip from '@/components/dashboard/ImpactStrip';
import RecyclingRateChart from '@/components/dashboard/RecyclingRateChart';
import StreakRow from '@/components/dashboard/StreakRow';

import { useImpact } from '@/hooks/useImpact';
import { useStreak } from '@/hooks/useStreak';

export default function Dashboard() {
  const {
    totalSorted,
    co2Saved,
    landfillDiverted,
    breakdown,
    recyclingRateTrend,
  } = useImpact();

  const { daysThisWeek } = useStreak();

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 24 }}>
      <View style={styles.header}>
        <Text style={styles.subheading}>THIS WEEK</Text>
        <Text style={styles.heading}>Your impact</Text>
      </View>

      <ImpactStrip
        totalSorted={totalSorted}
        co2Saved={co2Saved}
        landfillDiverted={landfillDiverted}
      />

      <Text style={styles.sectionLabel}>BREAKDOWN</Text>
      <CategoryChart breakdown={breakdown} />

      <Text style={styles.sectionLabel}>RECYCLING RATE OVER TIME</Text>
      <RecyclingRateChart data={recyclingRateTrend} />

      <Text style={styles.sectionLabel}>DAILY STREAK</Text>
      <StreakRow daysThisWeek={daysThisWeek} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F5F0',
  },
  header: {
    paddingHorizontal: 12,
    marginTop: 16,
  },
  subheading: {
    fontSize: 10,
    color: '#6b7280',
    letterSpacing: 1,
  },
  heading: {
    fontSize: 24,
    fontWeight: '600',
    color: '#111827',
    marginTop: 4,
  },
  sectionLabel: {
    fontSize: 10,
    color: '#6b7280',
    letterSpacing: 1,
    marginTop: 20,
    marginBottom: 8,
    paddingHorizontal: 12,
  },
});