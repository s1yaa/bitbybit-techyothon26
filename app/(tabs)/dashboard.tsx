import BadgesSection from '@/components/dashboard/BadgesSection';
import CategoryChart from '@/components/dashboard/CategoryChart';
import ImpactStrip from '@/components/dashboard/ImpactStrip';
import RecyclingRateChart from '@/components/dashboard/RecyclingRateChart';
import StreakRow from '@/components/dashboard/StreakRow';
import XPBanner from '@/components/gamification/XPBanner';
import { useBadges } from '@/hooks/useBadges';
import { useImpact } from '@/hooks/useImpact';
import { useStreak } from '@/hooks/useStreak';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import CampusImpactView from '@/components/dashboard/CampusImpactView';

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
  const { badgeProgress, ecoLevel, unlockedCount, totalBadges } = useBadges();
  const [viewMode, setViewMode] = useState<'personal' | 'campus'>('personal');

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <Animated.View entering={FadeInUp.delay(50).springify()} style={styles.header}>
        <View style={styles.heroBg} />
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.greeting}>{getGreeting()} 👋</Text>
            <Text style={styles.headingLarge}>{viewMode === 'personal' ? 'Your Impact' : 'Campus Impact'}</Text>
            <Text style={styles.todayLabel}>{getTodayLabel()}</Text>
          </View>
          <View style={styles.leafBadge}>
            <Ionicons name={viewMode === 'personal' ? 'leaf' : 'business'} size={22} color={viewMode === 'personal' ? '#16A34A' : '#2563EB'} />
          </View>
        </View>

        <View style={styles.toggleContainer}>
          <TouchableOpacity 
            style={[styles.toggleButton, viewMode === 'personal' && styles.toggleButtonActive]}
            onPress={() => setViewMode('personal')}
            activeOpacity={0.8}
          >
            <Text style={[styles.toggleText, viewMode === 'personal' && styles.toggleTextActive]}>Personal</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.toggleButton, viewMode === 'campus' && styles.toggleButtonActive]}
            onPress={() => setViewMode('campus')}
            activeOpacity={0.8}
          >
            <Text style={[styles.toggleText, viewMode === 'campus' && styles.toggleTextActive]}>Campus</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>

      {viewMode === 'personal' ? (
        <View style={{ flex: 1 }}>

      <Animated.View entering={FadeInDown.delay(100).springify()}>
        <SectionLabel icon="trophy" label="ECO LEVEL & XP" color="#16A34A" bg="#DCFCE7" />
        <XPBanner
          ecoLevel={ecoLevel}
          unlockedBadges={unlockedCount}
          totalBadges={totalBadges}
        />
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(200).springify()}>
        <SectionLabel icon="stats-chart" label="THIS WEEK'S STATS" color="#2563EB" bg="#DBEAFE" />
        <ImpactStrip
          totalSorted={totalSorted}
          co2Saved={co2Saved}
          landfillDiverted={landfillDiverted}
        />
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(250).springify()}>
        <SectionLabel icon="pie-chart" label="BREAKDOWN BY CATEGORY" color="#D97706" bg="#FEF3C7" />
        <View style={styles.card}>
          <CategoryChart breakdown={breakdown} />
        </View>
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(350).springify()}>
        <SectionLabel icon="trending-up" label="RECYCLING RATE OVER TIME" color="#16A34A" bg="#DCFCE7" />
        <RecyclingRateChart data={recyclingRateTrend} />
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(500).springify()}>
        <SectionLabel icon="flame" label="DAILY STREAK" color="#DC2626" bg="#FEE2E2" />
        <StreakRow daysThisWeek={daysThisWeek} />
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(600).springify()}>
        <SectionLabel icon="medal" label="BADGES" color="#D97706" bg="#FEF3C7" />
        <BadgesSection badges={badgeProgress} />
      </Animated.View>
        </View>
      ) : (
        <CampusImpactView />
      )}
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
    paddingBottom: 16,
  },
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: '#E5E7EB',
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 12,
    padding: 4,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 10,
  },
  toggleButtonActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  toggleText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  toggleTextActive: {
    color: '#111827',
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