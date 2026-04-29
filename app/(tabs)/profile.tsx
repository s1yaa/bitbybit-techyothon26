import { supabase } from '@/lib/supabase';
import { useUserStore } from '@/store/userStore';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect } from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Animated, {
  FadeInDown,
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

// ─── Palette ────────────────────────────────────────────────────────────────
const C = {
  bg: '#FFFFFF',
  surface: '#F3F4F6',
  card: '#FFFFFF',
  border: '#E5E7EB',
  accent: '#16A34A',      // eco-green
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

// ─── Glowing pulse ring around avatar ───────────────────────────────────────
function PulseRing() {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(0.6);

  useEffect(() => {
    scale.value = withRepeat(
      withSequence(withTiming(1.18, { duration: 1200 }), withTiming(1, { duration: 1200 })),
      -1,
      false,
    );
    opacity.value = withRepeat(
      withSequence(withTiming(0.15, { duration: 1200 }), withTiming(0.6, { duration: 1200 })),
      -1,
      false,
    );
  }, []);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        {
          position: 'absolute',
          width: 128,
          height: 128,
          borderRadius: 64,
          borderWidth: 2,
          borderColor: C.accent,
        },
        animStyle,
      ]}
    />
  );
}

// ─── Stat card ───────────────────────────────────────────────────────────────
function StatCard({
  icon,
  value,
  label,
  iconColor,
  bgColor,
  delay,
}: {
  icon: any;
  value: number;
  label: string;
  iconColor: string;
  bgColor: string;
  delay: number;
}) {
  return (
    <Animated.View entering={FadeInDown.delay(delay).springify()} style={styles.statCard}>
      <View style={[styles.statIconWrap, { backgroundColor: bgColor }]}>
        <Ionicons name={icon} size={22} color={iconColor} />
      </View>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </Animated.View>
  );
}

// ─── Setting row ─────────────────────────────────────────────────────────────
function SettingRow({
  icon,
  label,
  iconColor,
  iconBg,
  onPress,
  isLast,
}: {
  icon: any;
  label: string;
  iconColor: string;
  iconBg: string;
  onPress?: () => void;
  isLast?: boolean;
}) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.settingRow,
        !isLast && styles.settingRowBorder,
        pressed && styles.settingRowPressed,
      ]}
      onPress={onPress}
    >
      <View style={styles.settingLeft}>
        <View style={[styles.settingIconWrap, { backgroundColor: iconBg }]}>
          <Ionicons name={icon} size={18} color={iconColor} />
        </View>
        <Text style={styles.settingLabel}>{label}</Text>
      </View>
      <Ionicons name="chevron-forward" size={16} color={C.textMuted} />
    </Pressable>
  );
}

// ─── Main screen ─────────────────────────────────────────────────────────────
export default function Profile() {
  const { user, totalScans: totalSorted, streakDays: streakCount, reset } = useUserStore();
  const userId = user?.id;

  const name = userId ? `Eco User #${userId.slice(0, 6).toUpperCase()}` : 'Guest';
  const initials = userId ? userId.slice(0, 2).toUpperCase() : 'G';

  const handleSignOut = async () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: async () => {
          if (supabase) await supabase.auth.signOut();
          reset();
        },
      },
    ]);
  };

  const handleEditAvatar = () =>
    Alert.alert('Edit Photo', 'Profile photo editing coming soon!');

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* ── Hero Header ─────────────────────────────────────── */}
      <View style={styles.hero}>
        {/* dark gradient strip */}
        <View style={styles.heroBg} />

        <Animated.View entering={FadeInUp.delay(100).springify()} style={styles.avatarWrap}>
          <PulseRing />
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
          <Pressable
            style={({ pressed }) => [styles.cameraBadge, pressed && { opacity: 0.7 }]}
            onPress={handleEditAvatar}
          >
            <Ionicons name="camera" size={14} color="#fff" />
          </Pressable>
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(200).springify()} style={{ alignItems: 'center' }}>
          <Text style={styles.name}>{name}</Text>
          <View style={styles.tagRow}>
            <View style={styles.tag}>
              <Ionicons name="leaf" size={11} color={C.accent} />
              <Text style={styles.tagText}>Eco Warrior</Text>
            </View>
          </View>
          <Text style={styles.email}>{user?.email ?? 'Anonymous member'}</Text>
        </Animated.View>
      </View>

      {/* ── Stats ───────────────────────────────────────────── */}
      <View style={styles.statsRow}>
        <StatCard
          icon="leaf"
          value={totalSorted}
          label="Items Sorted"
          iconColor={C.accent}
          bgColor={C.accentDim}
          delay={300}
        />
        <StatCard
          icon="flame"
          value={streakCount}
          label="Day Streak"
          iconColor={C.amber}
          bgColor={C.amberDim}
          delay={400}
        />
        <StatCard
          icon="star"
          value={Math.floor(totalSorted * 10)}
          label="Eco Points"
          iconColor={C.blue}
          bgColor={C.blueDim}
          delay={500}
        />
      </View>

      {/* ── Account Settings ─────────────────────────────────── */}
      <Animated.View entering={FadeInDown.delay(600).springify()} style={styles.section}>
        <Text style={styles.sectionTitle}>Account Settings</Text>
        <View style={styles.card}>
          <SettingRow
            icon="person"
            label="Edit Profile"
            iconColor="#818CF8"
            iconBg="#1E1B4B"
            onPress={() => Alert.alert('Edit Profile', 'Profile editing coming soon!')}
          />
          <SettingRow
            icon="notifications"
            label="Notifications"
            iconColor={C.amber}
            iconBg={C.amberDim}
            onPress={() => Alert.alert('Notifications', 'Notification settings coming soon!')}
          />
          <SettingRow
            icon="shield-checkmark"
            label="Privacy"
            iconColor={C.accent}
            iconBg={C.accentDim}
            onPress={() => Alert.alert('Privacy', 'Privacy settings coming soon!')}
            isLast
          />
        </View>
      </Animated.View>

      {/* ── App Section ──────────────────────────────────────── */}
      <Animated.View entering={FadeInDown.delay(700).springify()} style={styles.section}>
        <Text style={styles.sectionTitle}>App</Text>
        <View style={styles.card}>
          <SettingRow
            icon="information-circle"
            label="About BitByBit"
            iconColor={C.blue}
            iconBg={C.blueDim}
            onPress={() => Alert.alert('BitByBit', 'Making the world greener, one scan at a time 🌿')}
          />
          <SettingRow
            icon="star"
            label="Rate the App"
            iconColor={C.amber}
            iconBg={C.amberDim}
            onPress={() => Alert.alert('Rate', 'Thanks for your support! 🌟')}
            isLast
          />
        </View>
      </Animated.View>

      {/* ── Sign Out ─────────────────────────────────────────── */}
      <Animated.View entering={FadeInDown.delay(800).springify()}>
        <Pressable
          style={({ pressed }) => [styles.signOutBtn, pressed && { opacity: 0.75 }]}
          onPress={handleSignOut}
        >
          <View style={styles.signOutInner}>
            <Ionicons name="log-out-outline" size={20} color={C.red} />
            <Text style={styles.signOutText}>Sign Out</Text>
          </View>
        </Pressable>
      </Animated.View>

      <Text style={styles.version}>BitByBit v1.0.0</Text>
    </ScrollView>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: C.bg,
  },
  content: {
    paddingBottom: 48,
  },

  // Hero
  hero: {
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 32,
    paddingHorizontal: 24,
    position: 'relative',
    marginBottom: 4,
  },
  heroBg: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: C.surface,
    borderBottomLeftRadius: 36,
    borderBottomRightRadius: 36,
    borderBottomWidth: 1,
    borderColor: C.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
  },
  avatarWrap: {
    width: 110,
    height: 110,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: C.accentDim,
    borderWidth: 3,
    borderColor: C.accent,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: C.accent,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
  },
  avatarText: {
    fontSize: 36,
    fontWeight: '800',
    color: C.accent,
    letterSpacing: 1,
  },
  cameraBadge: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: C.blue,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: C.bg,
    shadowColor: C.blue,
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
  name: {
    fontSize: 20,
    fontWeight: '800',
    color: C.textPrimary,
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  tagRow: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 8,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: C.accentDim,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#22543D',
  },
  tagText: {
    fontSize: 11,
    color: C.accent,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  email: {
    fontSize: 13,
    color: C.textMuted,
    marginTop: 2,
  },

  // Stats
  statsRow: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 20,
    marginTop: 24,
    marginBottom: 28,
  },
  statCard: {
    flex: 1,
    backgroundColor: C.card,
    borderRadius: 20,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: C.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  statIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 22,
    fontWeight: '800',
    color: C.textPrimary,
    letterSpacing: -0.5,
  },
  statLabel: {
    fontSize: 10,
    color: C.textSecondary,
    marginTop: 2,
    fontWeight: '600',
    letterSpacing: 0.3,
    textAlign: 'center',
  },

  // Section
  section: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: C.textMuted,
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 10,
    marginLeft: 4,
  },
  card: {
    backgroundColor: C.card,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: C.border,
  },

  // Setting row
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  settingRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: C.border,
  },
  settingRowPressed: {
    backgroundColor: '#F9FAFB',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  settingIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingLabel: {
    fontSize: 15,
    color: C.textPrimary,
    fontWeight: '500',
  },

  // Sign out
  signOutBtn: {
    marginHorizontal: 20,
    marginTop: 8,
    backgroundColor: C.redDim,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#FECACA',
    overflow: 'hidden',
  },
  signOutInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 16,
  },
  signOutText: {
    color: C.red,
    fontWeight: '700',
    fontSize: 16,
    letterSpacing: 0.3,
  },

  version: {
    textAlign: 'center',
    color: C.textMuted,
    fontSize: 12,
    marginTop: 28,
    letterSpacing: 0.5,
  },
});