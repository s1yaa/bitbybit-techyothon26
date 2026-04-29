import { useBadges } from '@/hooks/useBadges';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';

// ─── Types ───────────────────────────────────────────────────────────────────
interface LeaderEntry {
  rank: number;
  name: string;
  avatar: string;
  xp: number;
  level: string;
  badge: string;
  isMe?: boolean;
}

// ─── Mock data ────────────────────────────────────────────────────────────────
const WEEKLY_DATA: LeaderEntry[] = [
  { rank: 1, name: 'GreenQueen', avatar: 'GQ', xp: 2840, level: 'Forest Guardian', badge: '🌲' },
  { rank: 2, name: 'EcoNinja07', avatar: 'EN', xp: 2210, level: 'Forest Guardian', badge: '🌲' },
  { rank: 3, name: 'RecycleKing', avatar: 'RK', xp: 1950, level: 'Tree', badge: '🌳' },
  { rank: 4, name: 'LeafLover', avatar: 'LL', xp: 1620, level: 'Tree', badge: '🌳' },
  { rank: 5, name: 'ZeroWaste_Z', avatar: 'ZW', xp: 1380, level: 'Branch', badge: '🌿' },
  { rank: 6, name: 'CompostQueen', avatar: 'CQ', xp: 1140, level: 'Branch', badge: '🌿' },
  { rank: 7, name: 'EarthFirst', avatar: 'EF', xp: 890, level: 'Leaf', badge: '🍃' },
  { rank: 8, name: 'PlasticFree', avatar: 'PF', xp: 740, level: 'Leaf', badge: '🍃' },
  { rank: 9, name: 'BioBuddy', avatar: 'BB', xp: 590, level: 'Sprout', badge: '🌱' },
  { rank: 10, name: 'SortStar', avatar: 'SS', xp: 420, level: 'Sprout', badge: '🌱' },
];

const ALLTIME_DATA: LeaderEntry[] = [
  { rank: 1, name: 'GreenQueen', avatar: 'GQ', xp: 14200, level: 'Forest Guardian', badge: '🌲' },
  { rank: 2, name: 'CompostQueen', avatar: 'CQ', xp: 11800, level: 'Forest Guardian', badge: '🌲' },
  { rank: 3, name: 'EcoNinja07', avatar: 'EN', xp: 10400, level: 'Forest Guardian', badge: '🌲' },
  { rank: 4, name: 'RecycleKing', avatar: 'RK', xp: 8900, level: 'Tree', badge: '🌳' },
  { rank: 5, name: 'LeafLover', avatar: 'LL', xp: 7200, level: 'Tree', badge: '🌳' },
  { rank: 6, name: 'ZeroWaste_Z', avatar: 'ZW', xp: 5800, level: 'Branch', badge: '🌿' },
  { rank: 7, name: 'EarthFirst', avatar: 'EF', xp: 4300, level: 'Branch', badge: '🌿' },
  { rank: 8, name: 'PlasticFree', avatar: 'PF', xp: 3100, level: 'Leaf', badge: '🍃' },
  { rank: 9, name: 'BioBuddy', avatar: 'BB', xp: 2200, level: 'Leaf', badge: '🍃' },
  { rank: 10, name: 'SortStar', avatar: 'SS', xp: 1600, level: 'Sprout', badge: '🌱' },
];

// ─── Podium card ─────────────────────────────────────────────────────────────
const PODIUM_CONFIG = [
  { height: 90, color: '#F59E0B', bg: '#FEF3C7', border: '#FDE68A', crown: '👑', delay: 100 },
  { height: 110, color: '#EAB308', bg: '#FEFCE8', border: '#FEF08A', crown: '🥇', delay: 50 },
  { height: 70, color: '#9CA3AF', bg: '#F9FAFB', border: '#E5E7EB', crown: '🥉', delay: 150 },
];
const PODIUM_ORDER = [1, 0, 2]; // silver left, gold center, bronze right

function PodiumCard({ entry, configIndex }: { entry: LeaderEntry; configIndex: number }) {
  const cfg = PODIUM_CONFIG[configIndex];
  return (
    <Animated.View
      entering={FadeInUp.delay(cfg.delay).springify()}
      style={[styles.podiumCard, { borderColor: cfg.border, backgroundColor: cfg.bg }]}
    >
      <Text style={styles.podiumCrown}>{cfg.crown}</Text>
      <View style={[styles.podiumAvatar, { borderColor: cfg.color }]}>
        <Text style={[styles.podiumAvatarText, { color: cfg.color }]}>{entry.avatar}</Text>
      </View>
      <Text style={styles.podiumName} numberOfLines={1}>{entry.name}</Text>
      <Text style={styles.podiumBadge}>{entry.badge}</Text>
      <View style={[styles.podiumPillar, { height: cfg.height, backgroundColor: cfg.color }]}>
        <Text style={styles.podiumRank}>#{entry.rank}</Text>
        <Text style={styles.podiumXP}>{(entry.xp / 1000).toFixed(1)}k</Text>
      </View>
    </Animated.View>
  );
}

// ─── Rank row ─────────────────────────────────────────────────────────────────
function RankRow({ entry, index }: { entry: LeaderEntry; index: number }) {
  const isMe = !!entry.isMe;
  return (
    <Animated.View
      entering={FadeInDown.delay(index * 60).springify()}
      style={[styles.rankRow, isMe && styles.rankRowMe]}
    >
      <Text style={[styles.rankNum, isMe && styles.rankNumMe]}>#{entry.rank}</Text>
      <View style={[styles.rankAvatar, isMe && styles.rankAvatarMe]}>
        <Text style={[styles.rankAvatarText, isMe && styles.rankAvatarTextMe]}>{entry.avatar}</Text>
      </View>
      <View style={styles.rankInfo}>
        <Text style={[styles.rankName, isMe && styles.rankNameMe]}>
          {entry.name}{isMe ? ' (You)' : ''}
        </Text>
        <Text style={styles.rankLevel}>{entry.badge} {entry.level}</Text>
      </View>
      <View style={styles.rankXPWrap}>
        <Text style={[styles.rankXP, isMe && styles.rankXPMe]}>{entry.xp.toLocaleString()}</Text>
        <Text style={styles.rankXPLabel}>XP</Text>
      </View>
    </Animated.View>
  );
}

// ─── Main Screen ──────────────────────────────────────────────────────────────
export default function Leaderboard() {
  const [tab, setTab] = useState<'weekly' | 'alltime'>('weekly');
  const { ecoLevel } = useBadges();

  const baseData = tab === 'weekly' ? WEEKLY_DATA : ALLTIME_DATA;
  const myXP = ecoLevel.points;
  const myRank = baseData.filter((e) => e.xp > myXP).length + 1;

  // Build full list with user injected
  const myEntry: LeaderEntry = {
    rank: myRank,
    name: 'You',
    avatar: 'ME',
    xp: myXP,
    level: ecoLevel.title,
    badge: '🌱',
    isMe: true,
  };

  const top3 = baseData.slice(0, 3);
  const rest = baseData.slice(3);
  const isInTop10 = myRank <= 10;

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* ── Header ──────────────────────────────────────────── */}
      <Animated.View entering={FadeInUp.delay(0).springify()} style={styles.header}>
        <View style={styles.heroBg} />
        <View style={styles.headerInner}>
          <View>
            <Text style={styles.headerSub}>Community</Text>
            <Text style={styles.headerTitle}>Leaderboard 🏆</Text>
          </View>
          <View style={styles.myRankBadge}>
            <Text style={styles.myRankLabel}>Your rank</Text>
            <Text style={styles.myRankNum}>#{myRank}</Text>
          </View>
        </View>

        {/* Toggle */}
        <View style={styles.toggle}>
          <Pressable
            style={[styles.toggleBtn, tab === 'weekly' && styles.toggleBtnActive]}
            onPress={() => setTab('weekly')}
          >
            <Text style={[styles.toggleText, tab === 'weekly' && styles.toggleTextActive]}>
              This Week
            </Text>
          </Pressable>
          <Pressable
            style={[styles.toggleBtn, tab === 'alltime' && styles.toggleBtnActive]}
            onPress={() => setTab('alltime')}
          >
            <Text style={[styles.toggleText, tab === 'alltime' && styles.toggleTextActive]}>
              All Time
            </Text>
          </Pressable>
        </View>
      </Animated.View>

      {/* ── Podium ──────────────────────────────────────────── */}
      <Animated.View entering={FadeInDown.delay(100).springify()} style={styles.podiumRow}>
        {PODIUM_ORDER.map((dataIdx, i) => (
          <PodiumCard key={top3[dataIdx].rank} entry={top3[dataIdx]} configIndex={i} />
        ))}
      </Animated.View>

      {/* ── Rank list 4–10 ──────────────────────────────────── */}
      <Animated.View entering={FadeInDown.delay(200).springify()} style={styles.rankList}>
        <Text style={styles.listLabel}>
          <Ionicons name="list" size={12} /> RANKINGS
        </Text>
        {rest.map((entry, i) => (
          <RankRow key={entry.rank} entry={entry} index={i} />
        ))}
      </Animated.View>

      {/* ── Your rank (pinned if outside top 10) ────────────── */}
      {!isInTop10 && (
        <Animated.View entering={FadeInDown.delay(400).springify()} style={styles.myRankSection}>
          <Text style={styles.listLabel}>YOUR POSITION</Text>
          <RankRow entry={myEntry} index={0} />
          <Text style={styles.keepGoingText}>
            Keep scanning to climb the ranks! 🚀
          </Text>
        </Animated.View>
      )}

      {isInTop10 && myXP > 0 && (
        <View style={styles.congrats}>
          <Text style={styles.congratsText}>🎉 You're in the top 10! Keep it up!</Text>
        </View>
      )}

      {myXP === 0 && (
        <View style={styles.congrats}>
          <Text style={styles.congratsText}>📷 Scan your first item to join the leaderboard!</Text>
        </View>
      )}
    </ScrollView>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#FFFFFF' },
  content: { paddingBottom: 48 },

  // Header
  header: { marginBottom: 8 },
  heroBg: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#F0FDF4',
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    borderBottomWidth: 1,
    borderColor: '#BBF7D0',
  },
  headerInner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    paddingTop: 56,
    paddingBottom: 16,
  },
  headerSub: { fontSize: 12, color: '#6B7280', fontWeight: '500', marginBottom: 4 },
  headerTitle: { fontSize: 26, fontWeight: '800', color: '#111827', letterSpacing: -0.5 },
  myRankBadge: {
    backgroundColor: '#16A34A',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 8,
    alignItems: 'center',
  },
  myRankLabel: { fontSize: 10, color: 'rgba(255,255,255,0.8)', fontWeight: '600' },
  myRankNum: { fontSize: 22, fontWeight: '800', color: '#fff' },

  // Toggle
  toggle: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginBottom: 20,
    backgroundColor: '#E5E7EB',
    borderRadius: 12,
    padding: 3,
  },
  toggleBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 10,
    alignItems: 'center',
  },
  toggleBtnActive: { backgroundColor: '#fff', shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 4, elevation: 2 },
  toggleText: { fontSize: 13, fontWeight: '600', color: '#9CA3AF' },
  toggleTextActive: { color: '#111827' },

  // Podium
  podiumRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    paddingHorizontal: 16,
    gap: 8,
    marginBottom: 24,
  },
  podiumCard: {
    flex: 1,
    alignItems: 'center',
    borderRadius: 20,
    borderWidth: 1.5,
    paddingTop: 12,
    overflow: 'hidden',
  },
  podiumCrown: { fontSize: 20, marginBottom: 6 },
  podiumAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  podiumAvatarText: { fontSize: 13, fontWeight: '800' },
  podiumName: { fontSize: 11, fontWeight: '700', color: '#111827', marginBottom: 2, paddingHorizontal: 4 },
  podiumBadge: { fontSize: 14, marginBottom: 6 },
  podiumPillar: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  podiumRank: { fontSize: 16, fontWeight: '800', color: '#fff' },
  podiumXP: { fontSize: 11, color: 'rgba(255,255,255,0.85)', fontWeight: '600' },

  // Rank list
  rankList: { paddingHorizontal: 16, marginBottom: 8 },
  listLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#9CA3AF',
    letterSpacing: 1,
    marginBottom: 10,
    marginLeft: 4,
  },
  rankRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 14,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    gap: 10,
  },
  rankRowMe: {
    backgroundColor: '#F0FDF4',
    borderColor: '#86EFAC',
    borderWidth: 1.5,
  },
  rankNum: { width: 28, fontSize: 13, fontWeight: '700', color: '#9CA3AF', textAlign: 'center' },
  rankNumMe: { color: '#16A34A' },
  rankAvatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rankAvatarMe: { backgroundColor: '#DCFCE7' },
  rankAvatarText: { fontSize: 12, fontWeight: '800', color: '#6B7280' },
  rankAvatarTextMe: { color: '#16A34A' },
  rankInfo: { flex: 1 },
  rankName: { fontSize: 14, fontWeight: '700', color: '#111827' },
  rankNameMe: { color: '#15803D' },
  rankLevel: { fontSize: 11, color: '#9CA3AF', marginTop: 1 },
  rankXPWrap: { alignItems: 'flex-end' },
  rankXP: { fontSize: 15, fontWeight: '800', color: '#111827' },
  rankXPMe: { color: '#16A34A' },
  rankXPLabel: { fontSize: 9, color: '#9CA3AF', fontWeight: '600' },

  // My rank section
  myRankSection: { paddingHorizontal: 16, marginTop: 8 },
  keepGoingText: { textAlign: 'center', fontSize: 12, color: '#6B7280', marginTop: 8, marginBottom: 4 },

  // Congrats
  congrats: {
    marginHorizontal: 20,
    marginTop: 12,
    backgroundColor: '#F0FDF4',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#BBF7D0',
  },
  congratsText: { textAlign: 'center', fontSize: 13, color: '#16A34A', fontWeight: '600' },
});
