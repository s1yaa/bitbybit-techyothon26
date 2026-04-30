import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

const mockFeedEvents = [
  { id: '1', user: 'Alex', action: 'sorted a Plastic Bottle', points: '+10 XP', time: 'Just now', icon: 'water', color: '#3B82F6' },
  { id: '2', user: 'Sam', action: 'recycled Cardboard', points: '+15 XP', time: '2m ago', icon: 'cube', color: '#D97706' },
  { id: '3', user: 'Jordan', action: 'composted Food Waste', points: '+20 XP', time: '5m ago', icon: 'leaf', color: '#16A34A' },
  { id: '4', user: 'Casey', action: 'sorted an Aluminum Can', points: '+10 XP', time: '12m ago', icon: 'cafe', color: '#6366F1' },
];

export default function CampusImpactView() {
  const [feed, setFeed] = useState(mockFeedEvents);

  useEffect(() => {
    const interval = setInterval(() => {
      const newItems = [
        { id: Math.random().toString(), user: 'Student_' + Math.floor(Math.random() * 999), action: 'sorted a Glass Jar', points: '+15 XP', time: 'Just now', icon: 'wine', color: '#8B5CF6' },
        { id: Math.random().toString(), user: 'Prof. Smith', action: 'recycled Paper', points: '+5 XP', time: 'Just now', icon: 'document-text', color: '#10B981' },
      ];
      const randomNewItem = newItems[Math.floor(Math.random() * newItems.length)];
      setFeed(prev => [randomNewItem, ...prev.slice(0, 4)].map((item, index) => ({ ...item, time: index === 0 ? 'Just now' : index === 1 ? '1m ago' : item.time })));
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View entering={FadeInDown.delay(100).springify()} style={styles.statsCard}>
        <View style={styles.locationHeader}>
          <Ionicons name="business" size={24} color="#2563EB" />
          <Text style={styles.locationText}>Techyothon Hall</Text>
        </View>

        <View style={styles.mainStatContainer}>
          <Text style={styles.mainStatNumber}>1,204</Text>
          <Text style={styles.mainStatLabel}>Items Sorted Today</Text>
        </View>

        <View style={styles.subStatsRow}>
          <View style={styles.subStat}>
            <Ionicons name="leaf" size={16} color="#16A34A" />
            <Text style={styles.subStatText}>450kg CO₂ Saved</Text>
          </View>
          <View style={styles.subStatDivider} />
          <View style={styles.subStat}>
            <Ionicons name="people" size={16} color="#D97706" />
            <Text style={styles.subStatText}>89 Contributors</Text>
          </View>
        </View>
      </Animated.View>

      <View style={styles.feedSection}>
        <View style={styles.sectionHeaderRow}>
          <View style={[styles.sectionLabelIcon, { backgroundColor: '#FEE2E2' }]}>
            <Ionicons name="radio" size={14} color="#DC2626" />
          </View>
          <Text style={styles.sectionLabelText}>LIVE CAMPUS FEED</Text>
          <View style={styles.liveIndicator}>
            <View style={styles.liveDot} />
            <Text style={styles.liveText}>LIVE</Text>
          </View>
        </View>

        <View style={styles.feedCard}>
          {feed.map((item, index) => (
            <Animated.View
              key={item.id}
              entering={FadeInDown.springify()}
              style={[styles.feedItem, index === feed.length - 1 && styles.lastFeedItem]}
            >
              <View style={[styles.feedIconContainer, { backgroundColor: item.color + '20' }]}>
                <Ionicons name={item.icon as any} size={20} color={item.color} />
              </View>
              <View style={styles.feedContent}>
                <Text style={styles.feedUserText}>
                  <Text style={styles.feedUserName}>{item.user}</Text> {item.action}
                </Text>
                <Text style={styles.feedTime}>{item.time}</Text>
              </View>
              <View style={styles.feedPoints}>
                <Text style={styles.feedPointsText}>{item.points}</Text>
              </View>
            </Animated.View>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  statsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 24,
    elevation: 8,
    alignItems: 'center',
    marginBottom: 32,
  },
  locationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 20,
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  locationText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1D4ED8',
    letterSpacing: 0.5,
  },
  mainStatContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  mainStatNumber: {
    fontSize: 56,
    fontWeight: '900',
    color: '#111827',
    letterSpacing: -2,
    lineHeight: 64,
  },
  mainStatLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  subStatsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    padding: 12,
    borderRadius: 16,
    width: '100%',
    justifyContent: 'center',
    gap: 16,
  },
  subStat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  subStatText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#475569',
  },
  subStatDivider: {
    width: 1,
    height: 24,
    backgroundColor: '#E2E8F0',
  },
  feedSection: {
    marginBottom: 24,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
    paddingHorizontal: 4,
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
    flex: 1,
  },
  liveIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF2F2',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#EF4444',
  },
  liveText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#EF4444',
    letterSpacing: 0.5,
  },
  feedCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  feedItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    gap: 12,
  },
  lastFeedItem: {
    borderBottomWidth: 0,
    paddingBottom: 0,
  },
  feedIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  feedContent: {
    flex: 1,
  },
  feedUserText: {
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 20,
  },
  feedUserName: {
    fontWeight: '700',
    color: '#111827',
  },
  feedTime: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 2,
  },
  feedPoints: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  feedPointsText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#16A34A',
  },
});
