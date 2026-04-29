import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import {
  Dimensions,
  Image,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withSpring
} from 'react-native-reanimated';

import BinIndicator from '@/components/result/BinIndicator';
import ClassificationCard from '@/components/result/ClassificationCard';
import TipBox from '@/components/result/TipBox';
import { WASTE_CATEGORIES } from '@/constants/waste';
import { speak } from '@/lib/tts';
import { useClassificationStore } from '@/store/classificationStore';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const IMAGE_HEIGHT = SCREEN_WIDTH * 0.62;

export default function ResultScreen() {
  const router = useRouter();
  const result = useClassificationStore((s) => s.result);
  const imageUri = useClassificationStore((s) => s.imageUri);
  const reset = useClassificationStore((s) => s.reset);

  const imageScale = useSharedValue(0.94);
  const imageOpacity = useSharedValue(0);
  const ctaScale = useSharedValue(0.9);
  const ctaOpacity = useSharedValue(0);
  const badgeOpacity = useSharedValue(0);
  const badgeScale = useSharedValue(0.7);

  useEffect(() => {
    if (!result) return;

    speak(result.category, result.label);

    imageOpacity.value = withSpring(1, { damping: 20 });
    imageScale.value = withSpring(1, { damping: 16, stiffness: 120 });

    badgeOpacity.value = withDelay(300, withSpring(1, { damping: 14 }));
    badgeScale.value = withDelay(
      300,
      withSequence(
        withSpring(1.12, { damping: 10, stiffness: 200 }),
        withSpring(1.0, { damping: 12 })
      )
    );

    ctaOpacity.value = withDelay(600, withSpring(1, { damping: 20 }));
    ctaScale.value = withDelay(600, withSpring(1, { damping: 14, stiffness: 140 }));
  }, [result]);

  const imageStyle = useAnimatedStyle(() => ({
    opacity: imageOpacity.value,
    transform: [{ scale: imageScale.value }],
  }));

  const badgeStyle = useAnimatedStyle(() => ({
    opacity: badgeOpacity.value,
    transform: [{ scale: badgeScale.value }],
  }));

  const ctaStyle = useAnimatedStyle(() => ({
    opacity: ctaOpacity.value,
    transform: [{ scale: ctaScale.value }],
  }));

  if (!result) {
    return (
      <View style={styles.emptyState}>
        <Text style={styles.emptyIcon}>🔍</Text>
        <Text style={styles.emptyText}>Nothing to show yet.</Text>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backBtnText}>← Go back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const confidencePct = Math.round((result.confidence ?? 0) * 100);
  const accentColor = WASTE_CATEGORIES[result.category]?.color ?? '#2d6b23';
  const tip = WASTE_CATEGORIES[result.category]?.description ?? 'Dispose of this item responsibly.';

  function handleSorted() {
    reset();
    router.replace('/(tabs)/dashboard' as any);
  }

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" />

      <TouchableOpacity
        style={styles.backButton}
        onPress={() => router.back()}
        hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
      >
        <Text style={styles.backArrow}>←</Text>
        <Text style={styles.backLabel}>Back</Text>
      </TouchableOpacity>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View style={[styles.imageWrapper, imageStyle]}>
          {imageUri ? (
            <Image source={{ uri: imageUri }} style={styles.image} resizeMode="cover" />
          ) : (
            <View style={[styles.image, styles.imagePlaceholder, { backgroundColor: accentColor + '15' }]}>
              <Text style={styles.textLookupIcon}>🔍</Text>
              <Text style={styles.textLookupLabel}>{result.label}</Text>
            </View>
          )}

          <View style={styles.imageScrim} />

          {result.confidence > 0 && (
            <Animated.View style={[styles.confidenceBadge, badgeStyle]}>
              <View style={[styles.confidenceDot, { backgroundColor: '#22c55e' }]} />
              <Text style={styles.confidenceText}>{confidencePct}% match</Text>
            </Animated.View>
          )}

          <View style={[styles.categoryStripe, { backgroundColor: accentColor }]} />
        </Animated.View>

        <View style={styles.content}>
          <ClassificationCard result={result} />
          <BinIndicator category={result.category} />
          <TipBox tip={tip} />
        </View>
      </ScrollView>

      <Animated.View style={[styles.ctaWrapper, ctaStyle]}>
        <TouchableOpacity style={styles.ctaButton} onPress={handleSorted} activeOpacity={0.85}>
          <Text style={styles.ctaIcon}>✓</Text>
          <Text style={styles.ctaText}>Sorted — log this item</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#F7F5F0',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 120,
  },

  backButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 56 : 36,
    left: 16,
    zIndex: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255,255,255,0.85)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 0.5,
    borderColor: '#ddd',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  backArrow: {
    fontSize: 15,
    color: '#333',
    fontWeight: '600',
  },
  backLabel: {
    fontSize: 13,
    color: '#333',
    fontWeight: '600',
  },

  imageWrapper: {
    width: SCREEN_WIDTH,
    height: IMAGE_HEIGHT,
    overflow: 'hidden',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imagePlaceholder: {
    backgroundColor: '#e8e4dc',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    gap: 8,
  },
  textLookupIcon: {
    fontSize: 42,
    opacity: 0.8,
  },
  textLookupLabel: {
    fontSize: 22,
    fontWeight: '700',
    color: '#333',
    textAlign: 'center',
    textTransform: 'capitalize',
  },
  imageScrim: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 64,
    backgroundColor: '#F7F5F0',
    opacity: 0.55,
  },
  categoryStripe: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 4,
  },

  confidenceBadge: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 100 : 72,
    right: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(255,255,255,0.9)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    borderWidth: 0.5,
    borderColor: 'rgba(34,197,94,0.3)',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  confidenceDot: {
    width: 6,
    height: 6,
    borderRadius: 999,
  },
  confidenceText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#16a34a',
    letterSpacing: 0.2,
  },

  content: {
    paddingHorizontal: 16,
    paddingTop: 20,
    gap: 14,
  },

  ctaWrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    paddingBottom: Platform.OS === 'ios' ? 34 : 20,
    backgroundColor: '#F7F5F0',
    borderTopWidth: 0.5,
    borderTopColor: '#e2ddd5',
  },
  ctaButton: {
    backgroundColor: '#2d6b23',
    borderRadius: 14,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    shadowColor: '#2d6b23',
    shadowOpacity: 0.28,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
  ctaIcon: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '800',
  },
  ctaText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: 0.2,
  },

  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F7F5F0',
    gap: 12,
  },
  emptyIcon: {
    fontSize: 48,
  },
  emptyText: {
    fontSize: 16,
    color: '#888',
    fontWeight: '600',
  },
  backBtn: {
    marginTop: 8,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#2d6b23',
    borderRadius: 12,
  },
  backBtnText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
  },
});