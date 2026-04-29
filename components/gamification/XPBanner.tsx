import type { EcoLevelInfo } from '@/lib/badges';
import { Ionicons } from '@expo/vector-icons';
import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';

interface Props {
  ecoLevel: EcoLevelInfo;
  unlockedBadges: number;
  totalBadges: number;
}

const LEVEL_ICONS = ['🌱', '🌿', '🍃', '🌳', '🌲'];

export default function XPBanner({ ecoLevel, unlockedBadges, totalBadges }: Props) {
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    anim.setValue(0);
    Animated.timing(anim, {
      toValue: ecoLevel.progress,
      duration: 1000,
      useNativeDriver: false,
    }).start();
  }, [ecoLevel.progress]);

  const fillWidth = anim.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] });
  const ptsToNext = ecoLevel.nextLevelPoints !== null
    ? ecoLevel.nextLevelPoints - ecoLevel.points
    : null;
  const levelIcon = LEVEL_ICONS[Math.min(ecoLevel.level - 1, LEVEL_ICONS.length - 1)];

  return (
    <View style={styles.card}>
      {/* Level circle + info */}
      <View style={styles.row}>
        <View style={[styles.circle, { backgroundColor: ecoLevel.color }]}>
          <Text style={styles.circleText}>{levelIcon}</Text>
        </View>
        <View style={styles.info}>
          <View style={styles.titleRow}>
            <Text style={styles.levelTitle}>{ecoLevel.title}</Text>
            <View style={styles.xpPill}>
              <Ionicons name="star" size={10} color="#D97706" />
              <Text style={styles.xpPillText}>{ecoLevel.points} XP</Text>
            </View>
          </View>
          <Text style={styles.sub}>
            {ptsToNext !== null
              ? `${ptsToNext} XP to level ${ecoLevel.level + 1}`
              : '🎉 Maximum level reached!'}
          </Text>
        </View>
        <View style={styles.badgePill}>
          <Text style={styles.badgePillText}>🏅 {unlockedBadges}/{totalBadges}</Text>
        </View>
      </View>

      {/* Animated progress bar */}
      <View style={styles.track}>
        <Animated.View
          style={[styles.fill, { width: fillWidth, backgroundColor: ecoLevel.color }]}
        />
        {/* Milestone dots */}
        {[0.33, 0.66].map((pos) => (
          <View key={pos} style={[styles.milestoneDot, { left: `${pos * 100}%` as any }]} />
        ))}
      </View>

      {/* Level labels */}
      <View style={styles.levelLabels}>
        <Text style={styles.levelLabel}>Lv.{ecoLevel.level}</Text>
        <Text style={styles.progressPct}>{Math.round(ecoLevel.progress * 100)}%</Text>
        <Text style={styles.levelLabel}>
          {ecoLevel.nextLevelPoints !== null ? `Lv.${ecoLevel.level + 1}` : 'MAX'}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 12,
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  row: { flexDirection: 'row', alignItems: 'center', marginBottom: 14, gap: 10 },
  circle: {
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: 'center',
    justifyContent: 'center',
  },
  circleText: { fontSize: 22 },
  info: { flex: 1 },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  levelTitle: { fontSize: 15, fontWeight: '700', color: '#111827' },
  xpPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#FEF3C7',
    borderRadius: 10,
    paddingHorizontal: 7,
    paddingVertical: 2,
  },
  xpPillText: { fontSize: 10, fontWeight: '700', color: '#D97706' },
  sub: { fontSize: 11, color: '#9CA3AF', marginTop: 3 },
  badgePill: {
    backgroundColor: '#F0FDF4',
    borderRadius: 10,
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: '#BBF7D0',
  },
  badgePillText: { fontSize: 11, fontWeight: '700', color: '#16A34A' },
  track: {
    height: 10,
    backgroundColor: '#F3F4F6',
    borderRadius: 5,
    overflow: 'hidden',
    position: 'relative',
  },
  fill: { height: '100%', borderRadius: 5 },
  milestoneDot: {
    position: 'absolute',
    top: 3,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255,255,255,0.7)',
  },
  levelLabels: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 5 },
  levelLabel: { fontSize: 10, color: '#9CA3AF' },
  progressPct: { fontSize: 10, color: '#6B7280', fontWeight: '600' },
});
