import WasteBadge from '@/components/ui/WasteBadge';
import { WASTE_CATEGORIES } from '@/constants/waste';
import { ClassificationResult } from '@/types';
import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
} from 'react-native-reanimated';

interface ClassificationCardProps {
  result: ClassificationResult;
}

export default function ClassificationCard({ result }: ClassificationCardProps) {
  const translateY = useSharedValue(18);
  const opacity = useSharedValue(0);

  useEffect(() => {
    opacity.value = withDelay(100, withSpring(1, { damping: 20 }));
    translateY.value = withDelay(100, withSpring(0, { damping: 18, stiffness: 120 }));
  }, []);

  const animStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  const accentColor = WASTE_CATEGORIES[result.category]?.color ?? '#2d6b23';

  return (
    <Animated.View style={[styles.card, animStyle]}>
      <WasteBadge category={result.category} />
      <Text style={styles.label}>{result.label}</Text>
      <View style={[styles.divider, { backgroundColor: accentColor + '22' }]} />
      <Text style={styles.explanation}>{result.explanation}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: 0.5,
    borderColor: '#e6e1d8',
    padding: 20,
    gap: 10,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  label: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1a1a1a',
    letterSpacing: -0.3,
    lineHeight: 28,
  },
  divider: {
    height: 1,
    borderRadius: 1,
    marginVertical: 2,
  },
  explanation: {
    fontSize: 14,
    color: '#555',
    lineHeight: 21,
    letterSpacing: 0.1,
  },
});