import CategoryChart from '@/components/dashboard/CategoryChart';
import ImpactStrip from '@/components/dashboard/ImpactStrip';
import RecyclingRateChart from '@/components/dashboard/RecyclingRateChart';
import StreakRow from '@/components/dashboard/StreakRow';
import { useImpact } from '@/hooks/useImpact';
import { useStreak } from '@/hooks/useStreak';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

function getTodayLabel() {
  return new Date().toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric',
  });
}

function SectionLabel({ icon, label, color, bg }: {
  icon: any; label: string; color: string; bg: string;
}) {
  return (
    <View style={styles.sectionLabelRow}>
      <View style={[styles.sectionLabelIcon, { backgroundColor: bg }]}>
        <Ionicons name={icon} size={14} color={color} />
      </View>
      <Text style={styles.sectionLabelText}>{label}</Text>
    </View>
  );
}

export default function Dashboard() {
  const { totalSorted, co2Saved, landfillDiverted, breakdown, recyclingRateTrend } = useImpact();
  const { daysThisWeek } = useStreak();

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* ── Header ─────────────────────────────────────────── */}
      <Animated.View entering={FadeInUp.delay(50).springify()} style={styles.header}>
        <View style={styles.heroBg} />
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.greeting}>{getGreeting()} 👋</Text>
            <Text style={styles.headingLarge}>Your Impact</Text>
            <Text style={styles.todayLabel}>{getTodayLabel()}</Text>
          </View>
          <View style={styles.leafBadge}>
            <Ionicons name="leaf" size={22} color="#16A34A" />
          </View>
        </View>
      </Animated.View>

      {/* ── Impact strip ───────────────────────────────────── */}
      <Animated.View entering={FadeInDown.delay(150).springify()}>
        <SectionLabel icon="stats-chart" label="THIS WEEK'S STATS" color="#2563EB" bg="#DBEAFE" />
        <ImpactStrip
          totalSorted={totalSorted}
          co2Saved={co2Saved}
          landfillDiverted={landfillDiverted}
        />
      </Animated.View>

      {/* ── Category breakdown ─────────────────────────────── */}
      <Animated.View entering={FadeInDown.delay(250).springify()}>
        <SectionLabel icon="pie-chart" label="BREAKDOWN BY CATEGORY" color="#D97706" bg="#FEF3C7" />
        <View style={styles.card}>
          <CategoryChart breakdown={breakdown} />
        </View>
      </Animated.View>

      {/* ── Recycling rate chart ────────────────────────────── */}
      <Animated.View entering={FadeInDown.delay(350).springify()}>
        <SectionLabel icon="trending-up" label="RECYCLING RATE OVER TIME" color="#16A34A" bg="#DCFCE7" />
        <RecyclingRateChart data={recyclingRateTrend} />
      </Animated.View>

      {/* ── Daily streak ───────────────────────────────────── */}
      <Animated.View entering={FadeInDown.delay(450).springify()}>
        <SectionLabel icon="flame" label="DAILY STREAK" color="#DC2626" bg="#FEE2E2" />
        <StreakRow daysThisWeek={daysThisWeek} />
      </Animated.View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    paddingBottom: 40,
  },

  // Header
  header: {
    marginBottom: 4,
  },
  heroBg: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#F3F4F6',
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    borderBottomWidth: 1,
    borderColor: '#E5E7EB',
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    paddingTop: 56,
    paddingBottom: 28,
  },
  greeting: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '500',
    marginBottom: 4,
    letterSpacing: 0.2,
  },
  headingLarge: {
    fontSize: 28,
    fontWeight: '800',
    color: '#111827',
    letterSpacing: -0.5,
  },
  todayLabel: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 4,
    letterSpacing: 0.2,
  },
  leafBadge: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: '#DCFCE7',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#BBF7D0',
  },

  // Section label
  sectionLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 24,
    marginBottom: 10,
    paddingHorizontal: 20,
  },
  sectionLabelIcon: {
    width: 24,
    height: 24,
    borderRadius: 7,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionLabelText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#9CA3AF',
    letterSpacing: 1,
  },

  // Generic card wrapper for components that don't self-wrap
  card: {
    marginHorizontal: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
});