import type { EcoLevelInfo } from '@/lib/badges';
import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';

interface Props {
  ecoLevel: EcoLevelInfo;
  unlockedCount: number;
  totalBadges: number;
}

export default function EcoProgressBar({ ecoLevel, unlockedCount, totalBadges }: Props) {
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(anim, {
      toValue: ecoLevel.progress,
      duration: 900,
      useNativeDriver: false,
    }).start();
  }, [ecoLevel.progress]);

  const fillWidth = anim.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] });
  const ptsToNext = ecoLevel.nextLevelPoints !== null
    ? ecoLevel.nextLevelPoints - ecoLevel.points
    : null;

  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        <View style={[styles.levelCircle, { backgroundColor: ecoLevel.color }]}>
          <Text style={styles.levelNum}>{ecoLevel.level}</Text>
        </View>
        <View style={styles.info}>
          <Text style={styles.levelTitle}>{ecoLevel.title}</Text>
          <Text style={styles.pts}>{ecoLevel.points} eco pts</Text>
        </View>
        <View style={styles.badgePill}>
          <Text style={styles.badgePillText}>🏅 {unlockedCount}/{totalBadges} badges</Text>
        </View>
      </View>
      <View style={styles.track}>
        <Animated.View style={[styles.fill, { width: fillWidth, backgroundColor: ecoLevel.color }]} />
        {[0.25, 0.5, 0.75].map((pos) => (
          <View key={pos} style={[styles.dot, { left: `${pos * 100}%` }]} />
        ))}
      </View>
      <View style={styles.bottomRow}>
        <Text style={styles.lvLabel}>Lv.{ecoLevel.level}</Text>
        <Text style={styles.nextLabel}>
          {ptsToNext !== null ? `${ptsToNext} pts to Lv.${ecoLevel.level + 1}` : '🌟 Max Level!'}
        </Text>
        <Text style={styles.lvLabel}>
          {ecoLevel.nextLevelPoints !== null ? `Lv.${ecoLevel.level + 1}` : ''}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 12,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  topRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 14 },
  levelCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  levelNum: { fontSize: 18, fontWeight: '700', color: '#fff' },
  info: { flex: 1 },
  levelTitle: { fontSize: 15, fontWeight: '700', color: '#111827' },
  pts: { fontSize: 11, color: '#6b7280', marginTop: 2 },
  badgePill: {
    backgroundColor: '#f0fdf4',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: '#bbf7d0',
  },
  badgePillText: { fontSize: 11, fontWeight: '600', color: '#16a34a' },
  track: {
    height: 12,
    backgroundColor: '#f3f4f6',
    borderRadius: 6,
    overflow: 'hidden',
    position: 'relative',
  },
  fill: { height: '100%', borderRadius: 6 },
  dot: {
    position: 'absolute',
    top: 4,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255,255,255,0.6)',
  },
  bottomRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 6 },
  lvLabel: { fontSize: 10, color: '#9ca3af' },
  nextLabel: { fontSize: 10, color: '#6b7280', fontWeight: '500' },
});
