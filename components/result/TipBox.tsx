import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
} from 'react-native-reanimated';

interface TipBoxProps {
  tip: string;
}

export default function TipBox({ tip }: TipBoxProps) {
  const translateX = useSharedValue(-12);
  const opacity = useSharedValue(0);

  useEffect(() => {
    opacity.value = withDelay(400, withSpring(1, { damping: 20 }));
    translateX.value = withDelay(400, withSpring(0, { damping: 18, stiffness: 120 }));
  }, []);

  const animStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <Animated.View style={[styles.box, animStyle]}>
      <Text style={styles.icon}>💡</Text>
      <View style={styles.textArea}>
        <Text style={styles.heading}>Tip</Text>
        <Text style={styles.tip}>{tip}</Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  box: {
    backgroundColor: '#FBF7EE',
    borderWidth: 1,
    borderColor: '#e8c84a55',
    borderRadius: 14,
    padding: 14,
    flexDirection: 'row',
    gap: 10,
    alignItems: 'flex-start',
  },
  icon: {
    fontSize: 18,
    marginTop: 1,
  },
  textArea: {
    flex: 1,
    gap: 3,
  },
  heading: {
    fontSize: 11,
    fontWeight: '700',
    color: '#b07d00',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  tip: {
    fontSize: 12,
    color: '#6b5200',
    lineHeight: 18,
    letterSpacing: 0.1,
  },
});