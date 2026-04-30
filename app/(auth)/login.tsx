import { supabase } from '@/lib/supabase';
import { useUserStore } from '@/store/userStore';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Animated, {
  FadeInDown,
  FadeInUp,
} from 'react-native-reanimated';

type Mode = 'signin' | 'signup';

export default function LoginScreen() {
  const setUser = useUserStore((s) => s.setUser);

  const [mode, setMode] = useState<Mode>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navigateToApp = useCallback((userId: string, userEmail?: string) => {
    setUser({
      id: userId,
      email: userEmail,
      streakDays: 0,
      totalScans: 0,
      preferences: { ttsEnabled: true, notificationsEnabled: false },
    });
    router.replace('/(tabs)/scan');
  }, [setUser]);

  const handleEmailAuth = useCallback(async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Missing fields', 'Please enter both email and password.');
      return;
    }
    if (password.length < 6) {
      Alert.alert('Weak password', 'Password must be at least 6 characters.');
      return;
    }
    if (!supabase) {
      Alert.alert('Error', 'Auth is not configured. Check your environment variables.');
      return;
    }

    setIsLoading(true);
    try {
      if (mode === 'signup') {
        const { data, error } = await supabase.auth.signUp({
          email: email.trim(),
          password,
        });
        if (error) throw error;
        if (data.user) navigateToApp(data.user.id, data.user.email ?? undefined);
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });
        if (error) throw error;
        if (data.user) navigateToApp(data.user.id, data.user.email ?? undefined);
      }
    } catch (err: any) {
      Alert.alert(
        mode === 'signup' ? 'Sign up failed' : 'Sign in failed',
        err.message ?? 'Something went wrong. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  }, [mode, email, password, navigateToApp]);

  const handleGuest = useCallback(async () => {
    if (!supabase) {
      navigateToApp('guest-' + Date.now());
      return;
    }
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInAnonymously();
      if (error) throw error;
      if (data.user) navigateToApp(data.user.id);
    } catch (err: any) {
      Alert.alert('Error', err.message ?? 'Could not sign in anonymously.');
    } finally {
      setIsLoading(false);
    }
  }, [navigateToApp]);

  const toggleMode = () => setMode((m) => (m === 'signin' ? 'signup' : 'signin'));

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar barStyle="light-content" />

      <View style={styles.blob1} />
      <View style={styles.blob2} />

      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Animated.View entering={FadeInUp.delay(60).springify()} style={styles.hero}>
          <View style={styles.logoRing}>
            <Ionicons name="leaf" size={36} color="#16A34A" />
          </View>
          <Text style={styles.appName}>SortIt</Text>
          <Text style={styles.tagline}>Smart waste, cleaner planet 🌿</Text>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(150).springify()} style={styles.card}>
          <View style={styles.tabRow}>
            <Pressable
              style={[styles.tab, mode === 'signin' && styles.tabActive]}
              onPress={() => setMode('signin')}
            >
              <Text style={[styles.tabText, mode === 'signin' && styles.tabTextActive]}>
                Sign In
              </Text>
            </Pressable>
            <Pressable
              style={[styles.tab, mode === 'signup' && styles.tabActive]}
              onPress={() => setMode('signup')}
            >
              <Text style={[styles.tabText, mode === 'signup' && styles.tabTextActive]}>
                Sign Up
              </Text>
            </Pressable>
          </View>

          <View style={styles.fieldWrap}>
            <Text style={styles.fieldLabel}>Email</Text>
            <View style={styles.inputRow}>
              <Ionicons name="mail-outline" size={18} color="#6B7280" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="you@example.com"
                placeholderTextColor="#9CA3AF"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                value={email}
                onChangeText={setEmail}
                returnKeyType="next"
              />
            </View>
          </View>

          <View style={styles.fieldWrap}>
            <Text style={styles.fieldLabel}>Password</Text>
            <View style={styles.inputRow}>
              <Ionicons name="lock-closed-outline" size={18} color="#6B7280" style={styles.inputIcon} />
              <TextInput
                style={[styles.input, { flex: 1 }]}
                placeholder="••••••••"
                placeholderTextColor="#9CA3AF"
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                autoCorrect={false}
                value={password}
                onChangeText={setPassword}
                returnKeyType="done"
                onSubmitEditing={handleEmailAuth}
              />
              <Pressable onPress={() => setShowPassword((v) => !v)} style={styles.eyeBtn}>
                <Ionicons
                  name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                  size={18}
                  color="#9CA3AF"
                />
              </Pressable>
            </View>
          </View>

          <TouchableOpacity
            style={[styles.primaryBtn, isLoading && styles.primaryBtnDisabled]}
            onPress={handleEmailAuth}
            disabled={isLoading}
            activeOpacity={0.85}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Text style={styles.primaryBtnText}>
                {mode === 'signin' ? 'Sign In' : 'Create Account'}
              </Text>
            )}
          </TouchableOpacity>

          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or</Text>
            <View style={styles.dividerLine} />
          </View>

          <TouchableOpacity
            style={styles.guestBtn}
            onPress={handleGuest}
            disabled={isLoading}
            activeOpacity={0.8}
          >
            <Ionicons name="person-outline" size={16} color="#6B7280" />
            <Text style={styles.guestBtnText}>Continue as Guest</Text>
          </TouchableOpacity>

          <Pressable onPress={toggleMode} style={styles.toggleRow}>
            <Text style={styles.toggleText}>
              {mode === 'signin' ? "Don't have an account? " : 'Already have an account? '}
              <Text style={styles.toggleLink}>
                {mode === 'signin' ? 'Sign Up' : 'Sign In'}
              </Text>
            </Text>
          </Pressable>
        </Animated.View>

        <Animated.Text entering={FadeInDown.delay(300).springify()} style={styles.footerNote}>
          Your scan history is saved to your account and synced across devices.
        </Animated.Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#0F172A',
  },

  blob1: {
    position: 'absolute',
    top: -60,
    right: -80,
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: '#14532D',
    opacity: 0.35,
  },
  blob2: {
    position: 'absolute',
    bottom: 80,
    left: -100,
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: '#1E3A5F',
    opacity: 0.3,
  },

  scroll: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 48,
  },

  hero: {
    alignItems: 'center',
    marginBottom: 36,
  },
  logoRing: {
    width: 80,
    height: 80,
    borderRadius: 28,
    backgroundColor: '#DCFCE7',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    shadowColor: '#16A34A',
    shadowOpacity: 0.35,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 8 },
    elevation: 10,
  },
  appName: {
    fontSize: 36,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.5,
    marginBottom: 6,
  },
  tagline: {
    fontSize: 15,
    color: '#94A3B8',
    fontWeight: '400',
    letterSpacing: 0.2,
  },

  card: {
    backgroundColor: '#1E293B',
    borderRadius: 28,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    shadowColor: '#000',
    shadowOpacity: 0.4,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 12 },
    elevation: 12,
  },

  tabRow: {
    flexDirection: 'row',
    backgroundColor: '#0F172A',
    borderRadius: 14,
    padding: 4,
    marginBottom: 24,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 11,
    alignItems: 'center',
  },
  tabActive: {
    backgroundColor: '#16A34A',
    shadowColor: '#16A34A',
    shadowOpacity: 0.4,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748B',
  },
  tabTextActive: {
    color: '#FFFFFF',
  },

  fieldWrap: {
    marginBottom: 16,
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#94A3B8',
    letterSpacing: 0.5,
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0F172A',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: '#F1F5F9',
    fontWeight: '400',
  },
  eyeBtn: {
    paddingLeft: 8,
  },

  primaryBtn: {
    backgroundColor: '#16A34A',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    shadowColor: '#16A34A',
    shadowOpacity: 0.45,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
  primaryBtnDisabled: {
    opacity: 0.6,
  },
  primaryBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.2,
  },

  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
    gap: 10,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  dividerText: {
    fontSize: 12,
    color: '#475569',
    fontWeight: '600',
  },

  guestBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#0F172A',
    borderRadius: 14,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  guestBtnText: {
    color: '#94A3B8',
    fontSize: 14,
    fontWeight: '600',
  },

  toggleRow: {
    alignItems: 'center',
    marginTop: 20,
  },
  toggleText: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '400',
  },
  toggleLink: {
    color: '#4ADE80',
    fontWeight: '700',
  },

  footerNote: {
    textAlign: 'center',
    color: '#334155',
    fontSize: 12,
    marginTop: 24,
    lineHeight: 18,
    paddingHorizontal: 8,
  },
});
