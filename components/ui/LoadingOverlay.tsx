import React, { useEffect } from 'react'
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native'
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated'

interface LoadingOverlayProps {
  visible: boolean
  message?: string
}

export default function LoadingOverlay({
  visible,
  message = 'Identifying waste…',
}: LoadingOverlayProps) {
  const opacity = useSharedValue(0)
  const scale = useSharedValue(0.95)

  useEffect(() => {
    if (!visible) return

    opacity.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 800, easing: Easing.inOut(Easing.ease) }),
        withTiming(0.5, { duration: 800, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      false
    )

    scale.value = withRepeat(
      withSequence(
        withTiming(1.05, { duration: 800, easing: Easing.inOut(Easing.ease) }),
        withTiming(0.95, { duration: 800, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      false
    )
  }, [visible])

  const animStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }))

  if (!visible) return null

  return (
    <View style={styles.overlay}>
      <View style={styles.card}>
        <ActivityIndicator size="large" color="#2d6b23" />

        <Animated.Text style={[styles.text, animStyle]}>
          Analysing…
        </Animated.Text>

        <Text style={styles.subtext}>{message}</Text>
        <Text style={styles.powered}>Powered by Gemini</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(14,14,14,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingVertical: 36,
    paddingHorizontal: 48,
    alignItems: 'center',
    gap: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
  },
  text: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2d6b23',
    marginTop: 4,
  },
  subtext: {
    fontSize: 13,
    color: '#666',
  },
  powered: {
    fontSize: 11,
    color: '#aaa',
    marginTop: 4,
  },
})