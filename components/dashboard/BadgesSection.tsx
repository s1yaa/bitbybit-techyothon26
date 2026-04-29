import type { BadgeProgress } from '@/lib/badges';
import { StyleSheet, Text, View } from 'react-native';

interface Props {
  badges: BadgeProgress[];
}

function BadgeCard({ badge }: { badge: BadgeProgress }) {
  const { unlocked, progress, current, target, emoji, title, description } = badge;

  return (
    <View style={[styles.card, unlocked && styles.cardUnlocked]}>
      <View style={[styles.emojiCircle, unlocked ? styles.emojiCircleUnlocked : styles.emojiCircleLocked]}>
        <Text style={[styles.emoji, !unlocked && styles.emojiLocked]}>{emoji}</Text>
      </View>
      <Text style={[styles.badgeTitle, unlocked && styles.badgeTitleUnlocked]} numberOfLines={1}>
        {title}
      </Text>
      <Text style={styles.badgeDesc} numberOfLines={2}>{description}</Text>
      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${progress * 100}%`, backgroundColor: unlocked ? '#22c55e' : '#7DB87A' }]} />
      </View>
      <Text style={[styles.progressLabel, unlocked && styles.progressLabelUnlocked]}>
        {unlocked ? '✓ Unlocked!' : `${current} / ${target}`}
      </Text>
    </View>
  );
}

export default function BadgesSection({ badges }: Props) {
  const beginner = badges.filter((b) => b.tier === 'beginner');
  const advanced = badges.filter((b) => b.tier === 'advanced');

  return (
    <View style={styles.container}>
      <Text style={styles.tierLabel}>BEGINNER BADGES</Text>
      <View style={styles.grid}>
        {beginner.map((b) => <BadgeCard key={b.id} badge={b} />)}
      </View>

      <Text style={[styles.tierLabel, { marginTop: 20 }]}>ADVANCED BADGES</Text>
      <View style={styles.grid}>
        {advanced.map((b) => <BadgeCard key={b.id} badge={b} />)}
      </View>
    </View>
  );
}

const CARD_W = '48%';

const styles = StyleSheet.create({
  container: { paddingHorizontal: 12 },
  tierLabel: {
    fontSize: 10,
    color: '#6b7280',
    letterSpacing: 1,
    marginBottom: 10,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  card: {
    width: CARD_W,
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1.5,
    borderColor: '#f3f4f6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  cardUnlocked: {
    borderColor: '#bbf7d0',
    backgroundColor: '#f0fdf4',
  },
  emojiCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  emojiCircleUnlocked: { backgroundColor: '#dcfce7' },
  emojiCircleLocked: { backgroundColor: '#f3f4f6' },
  emoji: { fontSize: 20 },
  emojiLocked: { opacity: 0.45 },
  badgeTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#374151',
    marginBottom: 2,
  },
  badgeTitleUnlocked: { color: '#15803d' },
  badgeDesc: {
    fontSize: 10,
    color: '#9ca3af',
    marginBottom: 10,
    lineHeight: 14,
  },
  progressTrack: {
    height: 5,
    backgroundColor: '#e5e7eb',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 6,
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  progressLabel: {
    fontSize: 10,
    color: '#9ca3af',
    fontWeight: '500',
  },
  progressLabelUnlocked: {
    color: '#16a34a',
    fontWeight: '700',
  },
});
