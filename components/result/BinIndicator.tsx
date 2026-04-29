import { WASTE_CATEGORIES } from '@/constants/waste';
import { WasteCategory } from '@/types';
import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withSpring
} from 'react-native-reanimated';

interface BinIndicatorProps {
  category: WasteCategory;
}

function getWrongCategory(correct: WasteCategory): WasteCategory {
  const all: WasteCategory[] = ['recyclable', 'wet', 'hazardous', 'dry', 'ewaste'];
  return all.find((c) => c !== correct) ?? 'dry';
}

function BinCard({
  category,
  isCorrect,
  delay,
}: {
  category: WasteCategory;
  isCorrect: boolean;
  delay: number;
}) {
  const meta = WASTE_CATEGORIES[category];
  const color = meta?.color ?? '#888';
  const scale = useSharedValue(0.88);
  const opacity = useSharedValue(0);

  useEffect(() => {
    opacity.value = withDelay(delay, withSpring(1, { damping: 20 }));
    if (isCorrect) {
      scale.value = withDelay(
        delay,
        withSequence(
          withSpring(1.06, { damping: 10, stiffness: 160 }),
          withSpring(1.0, { damping: 14, stiffness: 140 })
        )
      );
    } else {
      scale.value = withDelay(delay, withSpring(1, { damping: 16 }));
    }
  }, []);

  const animStyle = useAnimatedStyle(() => ({
    opacity: isCorrect ? opacity.value : opacity.value * 0.4,
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View
      style={[
        styles.bin,
        animStyle,
        isCorrect && {
          borderColor: color,
          borderWidth: 1.5,
          backgroundColor: color + '0D',
          shadowColor: color,
          shadowOpacity: 0.18,
          shadowRadius: 10,
          shadowOffset: { width: 0, height: 4 },
          elevation: 5,
        },
        !isCorrect && styles.binWrong,
      ]}
    >
      <View style={[styles.binLid, { backgroundColor: color }]} />

      <View style={[styles.binBody, { borderColor: color + '55' }]}>
        <View style={styles.binLines}>
          <View style={[styles.binLine, { backgroundColor: color + '44' }]} />
          <View style={[styles.binLine, { backgroundColor: color + '44' }]} />
          <View style={[styles.binLine, { backgroundColor: color + '44' }]} />
        </View>
      </View>

      <Text style={[styles.binName, { color: isCorrect ? '#1a1a1a' : '#aaa' }]}>
        {meta?.bin ?? category}
      </Text>
      <Text style={[styles.binAction, { color: isCorrect ? color : '#bbb' }]}>
        {isCorrect ? '✓ Use this bin' : '✕ Not this one'}
      </Text>
    </Animated.View>
  );
}

export default function BinIndicator({ category }: BinIndicatorProps) {
  const wrongCategory = getWrongCategory(category);

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Where does it go?</Text>
      <View style={styles.row}>
        <BinCard category={category} isCorrect delay={150} />
        <BinCard category={wrongCategory} isCorrect={false} delay={280} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  heading: {
    fontSize: 13,
    fontWeight: '700',
    color: '#888',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  bin: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: 0.5,
    borderColor: '#e6e1d8',
    padding: 16,
    alignItems: 'center',
    gap: 6,
  },
  binWrong: {
    backgroundColor: '#fafafa',
    borderColor: '#ececec',
  },
  binLid: {
    width: 44,
    height: 10,
    borderRadius: 6,
    marginBottom: 2,
  },
  binBody: {
    width: 40,
    height: 48,
    borderWidth: 1.5,
    borderRadius: 4,
    borderTopWidth: 0,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  binLines: {
    flexDirection: 'row',
    gap: 5,
    height: '100%',
    alignItems: 'center',
  },
  binLine: {
    width: 2,
    height: 28,
    borderRadius: 1,
  },
  binName: {
    fontSize: 13,
    fontWeight: '700',
    textAlign: 'center',
    marginTop: 4,
    textTransform: 'capitalize',
  },
  binAction: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
});