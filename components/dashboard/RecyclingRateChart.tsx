import type { RecyclingRatePoint } from '@/lib/impact';
import { Dimensions, StyleSheet, Text, View } from 'react-native';

interface Props {
  data: RecyclingRatePoint[];
}

const SCREEN_W = Dimensions.get('window').width;
const CHART_H = 110;

function formatLabel(iso: string): string {
  const d = new Date(iso + 'T00:00:00');
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function isToday(iso: string): boolean {
  return iso === new Date().toISOString().split('T')[0];
}

export default function RecyclingRateChart({ data }: Props) {
  const activeDays = data.filter((d) => d.total > 0);
  const avgRate =
    activeDays.length === 0
      ? 0
      : Math.round(
          activeDays.reduce((sum, d) => sum + d.rate, 0) / activeDays.length
        );
  const showLabel = (i: number) => i % 2 === 0;

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.title}>Recycling Rate</Text>
          <Text style={styles.subtitle}>Last 14 days · recyclable items %</Text>
        </View>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{avgRate}% avg</Text>
        </View>
      </View>
      <View style={styles.chartArea}>
        {[100, 75, 50, 25].map((pct) => (
          <View
            key={pct}
            style={[styles.guideLine, { bottom: (pct / 100) * CHART_H }]}
          />
        ))}
        {[100, 50].map((pct) => (
          <Text
            key={`lbl${pct}`}
            style={[styles.guideLabel, { bottom: (pct / 100) * CHART_H - 6 }]}
          >
            {pct}%
          </Text>
        ))}
        <View style={styles.barsRow}>
          {data.map((point, i) => {
            const barH = Math.max((point.rate / 100) * CHART_H, point.total > 0 ? 3 : 0);
            const today = isToday(point.date);
            const hasData = point.total > 0;

            return (
              <View key={point.date} style={styles.barWrapper}>
                {hasData && (
                  <Text style={[styles.barValue, today && styles.barValueToday]}>
                    {point.rate}%
                  </Text>
                )}
                <View style={styles.barTrack}>
                  <View
                    style={[
                      styles.bar,
                      {
                        height: barH,
                        backgroundColor: today
                          ? '#4ade80'
                          : hasData
                          ? '#7DB87A'
                          : '#e5e7eb',
                        opacity: hasData ? 1 : 0.4,
                      },
                    ]}
                  />
                </View>
                {showLabel(i) && (
                  <Text style={[styles.dateLabel, today && styles.dateLabelToday]}>
                    {today ? 'Today' : formatLabel(point.date)}
                  </Text>
                )}
              </View>
            );
          })}
        </View>
      </View>
      <View style={styles.legendRow}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: '#4ade80' }]} />
          <Text style={styles.legendText}>Today</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: '#7DB87A' }]} />
          <Text style={styles.legendText}>Has data</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: '#e5e7eb' }]} />
          <Text style={styles.legendText}>No scans</Text>
        </View>
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
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
  },
  subtitle: {
    fontSize: 11,
    color: '#9CA3AF',
    marginTop: 2,
  },
  badge: {
    backgroundColor: '#DCFCE7',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: '#BBF7D0',
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#16A34A',
  },
  chartArea: {
    height: CHART_H + 24,  // extra room for guide labels
    position: 'relative',
  },
  guideLine: {
    position: 'absolute',
    left: 28,
    right: 0,
    height: 1,
    backgroundColor: '#f3f4f6',
  },
  guideLabel: {
    position: 'absolute',
    left: 0,
    fontSize: 9,
    color: '#d1d5db',
    width: 26,
    textAlign: 'right',
  },
  barsRow: {
    position: 'absolute',
    left: 32,
    right: 0,
    bottom: 0,
    top: 0,
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  barWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingHorizontal: 1,
  },
  barValue: {
    fontSize: 8,
    color: '#6b7280',
    marginBottom: 2,
  },
  barValueToday: {
    color: '#16a34a',
    fontWeight: '700',
  },
  barTrack: {
    width: '80%',
    height: CHART_H,
    justifyContent: 'flex-end',
  },
  bar: {
    width: '100%',
    borderRadius: 4,
  },
  dateLabel: {
    fontSize: 8,
    color: '#9ca3af',
    marginTop: 4,
    textAlign: 'center',
  },
  dateLabelToday: {
    color: '#16a34a',
    fontWeight: '600',
  },
  legendRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    marginTop: 10,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    fontSize: 10,
    color: '#9ca3af',
  },
});
