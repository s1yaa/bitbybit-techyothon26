import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import type * as NotificationsType from 'expo-notifications';
import { Stack, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

let Notifications: typeof NotificationsType | null = null;
if (Platform.OS !== 'web' && Constants.appOwnership !== 'expo') {
  try {
    Notifications = require('expo-notifications');
  } catch (e) {
    console.warn('Expo Notifications not supported in this environment.');
  }
}

const C = {
  bg: '#FFFFFF',
  surface: '#F3F4F6',
  card: '#FFFFFF',
  border: '#E5E7EB',
  accent: '#16A34A',
  accentDim: '#DCFCE7',
  amber: '#D97706',
  amberDim: '#FEF3C7',
  blue: '#2563EB',
  blueDim: '#DBEAFE',
  red: '#DC2626',
  redDim: '#FEE2E2',
  textPrimary: '#111827',
  textSecondary: '#6B7280',
  textMuted: '#9CA3AF',
};

const ZONES = [
  {
    id: 'north',
    name: 'North Zone',
    schedule: [
      { day: 3, name: 'Tuesday', type: 'Dry Waste', icon: 'cube-outline', color: C.amber },
      { day: 6, name: 'Friday', type: 'Wet Waste', icon: 'water-outline', color: C.blue },
    ]
  },
  {
    id: 'south',
    name: 'South Zone',
    schedule: [
      { day: 4, name: 'Wednesday', type: 'Dry Waste', icon: 'cube-outline', color: C.amber },
      { day: 7, name: 'Saturday', type: 'Wet Waste', icon: 'water-outline', color: C.blue },
    ]
  },
  {
    id: 'east',
    name: 'East Zone',
    schedule: [
      { day: 2, name: 'Monday', type: 'Dry Waste', icon: 'cube-outline', color: C.amber },
      { day: 5, name: 'Thursday', type: 'Wet Waste', icon: 'water-outline', color: C.blue },
    ]
  },
];

const ZONE_STORAGE_KEY = '@ecobin_zone';

export default function NotificationsScreen() {
  const router = useRouter();
  const [selectedZoneId, setSelectedZoneId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSavedZone();
  }, []);

  const loadSavedZone = async () => {
    try {
      const savedZone = await AsyncStorage.getItem(ZONE_STORAGE_KEY);
      if (savedZone) {
        setSelectedZoneId(savedZone);
      }
    } catch (e) {
      console.error('Failed to load zone', e);
    } finally {
      setLoading(false);
    }
  };

  const scheduleReminders = async (zoneId: string) => {
    if (Platform.OS === 'web' || !Notifications) {
      Alert.alert('Unsupported', 'Push notifications are not supported in this environment (e.g. Web or Expo Go on Android).');
      return;
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      Alert.alert('Permission required', 'Please enable notifications in your phone settings to receive reminders.');
      return;
    }

    await Notifications.cancelAllScheduledNotificationsAsync();

    const zone = ZONES.find(z => z.id === zoneId);
    if (!zone) return;

    for (const pickup of zone.schedule) {
      let notifyDay = pickup.day - 1;
      if (notifyDay === 0) notifyDay = 7;

      await Notifications.scheduleNotificationAsync({
        content: {
          title: `Tomorrow: ${pickup.type} Collection! ♻️`,
          body: `Don't forget to put out your ${pickup.type.toLowerCase()} for the ${zone.name} pickup tomorrow.`,
          sound: true,
        },
        trigger: {
          weekday: notifyDay,
          hour: 20,
          minute: 0,
          repeats: true
        } as any,
      });
    }

    await AsyncStorage.setItem(ZONE_STORAGE_KEY, zoneId);
    setSelectedZoneId(zoneId);

    Alert.alert('Reminders Set!', `You will be reminded at 8:00 PM the night before your collection days in ${zone.name}.`);
  };

  const handleTestNotification = async () => {
    if (Platform.OS === 'web' || !Notifications) return;
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Test Notification 🌿",
        body: "Your smart reminders are working perfectly!",
        sound: true,
      },
      trigger: null,
    });
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Stack.Screen options={{ headerShown: false }} />

      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={C.textPrimary} />
        </Pressable>
        <Text style={styles.headerTitle}>Smart Reminders</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        <Animated.View entering={FadeInDown.delay(100).springify()}>
          <View style={styles.iconContainer}>
            <View style={styles.iconCircle}>
              <Ionicons name="notifications" size={32} color={C.accent} />
            </View>
          </View>
          <Text style={styles.description}>
            Select your residential zone to receive a friendly local push notification the night before your garbage collection day.
          </Text>
        </Animated.View>

        <View style={styles.zonesContainer}>
          {ZONES.map((zone, index) => {
            const isSelected = selectedZoneId === zone.id;
            return (
              <Animated.View key={zone.id} entering={FadeInDown.delay(200 + index * 100).springify()}>
                <Pressable
                  style={[styles.zoneCard, isSelected && styles.zoneCardSelected]}
                  onPress={() => scheduleReminders(zone.id)}
                >
                  <View style={styles.zoneHeader}>
                    <Text style={[styles.zoneName, isSelected && { color: C.accent }]}>{zone.name}</Text>
                    {isSelected ? (
                      <Ionicons name="checkmark-circle" size={24} color={C.accent} />
                    ) : (
                      <View style={styles.emptyCircle} />
                    )}
                  </View>
                  <View style={styles.scheduleList}>
                    {zone.schedule.map((s, i) => (
                      <View key={i} style={styles.scheduleRow}>
                        <View style={[styles.scheduleIconWrap, { backgroundColor: `${s.color}20` }]}>
                          <Ionicons name={s.icon as any} size={14} color={s.color} />
                        </View>
                        <Text style={styles.scheduleText}>
                          <Text style={{ fontWeight: '600', color: C.textPrimary }}>{s.name}</Text> • {s.type}
                        </Text>
                      </View>
                    ))}
                  </View>
                </Pressable>
              </Animated.View>
            );
          })}
        </View>

        {Platform.OS !== 'web' && (
          <Animated.View entering={FadeInDown.delay(500).springify()}>
            <Pressable style={styles.testBtn} onPress={handleTestNotification}>
              <Ionicons name="paper-plane" size={18} color={C.accent} />
              <Text style={styles.testBtnText}>Send Test Notification</Text>
            </Pressable>
          </Animated.View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: C.bg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: C.bg,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
  },
  backBtn: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: C.textPrimary,
  },
  scroll: {
    flex: 1,
    backgroundColor: C.surface,
  },
  content: {
    padding: 24,
    paddingBottom: 48,
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: C.accentDim,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#BBF7D0',
  },
  description: {
    fontSize: 15,
    color: C.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
  },
  zonesContainer: {
    gap: 16,
  },
  zoneCard: {
    backgroundColor: C.card,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: C.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  zoneCardSelected: {
    borderColor: C.accent,
    backgroundColor: '#F0FDF4',
    borderWidth: 2,
  },
  zoneHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  zoneName: {
    fontSize: 18,
    fontWeight: '700',
    color: C.textPrimary,
  },
  emptyCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: C.border,
  },
  scheduleList: {
    gap: 12,
  },
  scheduleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  scheduleIconWrap: {
    width: 28,
    height: 28,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scheduleText: {
    fontSize: 14,
    color: C.textSecondary,
  },
  testBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 32,
    padding: 16,
    borderRadius: 16,
    backgroundColor: C.accentDim,
    borderWidth: 1,
    borderColor: '#BBF7D0',
  },
  testBtnText: {
    color: C.accent,
    fontSize: 16,
    fontWeight: '700',
  }
});
