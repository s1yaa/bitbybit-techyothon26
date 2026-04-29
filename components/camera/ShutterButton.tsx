import { Ionicons } from '@expo/vector-icons'
import React from 'react'
import { StyleSheet, TouchableOpacity, View } from 'react-native'

interface ShutterButtonProps {
  onPress: () => void
  onGalleryPress: () => void
  onFlashToggle: () => void
  flashEnabled: boolean
  disabled?: boolean
}

export function ShutterButton({
  onPress,
  onGalleryPress,
  onFlashToggle,
  flashEnabled,
  disabled = false,
}: ShutterButtonProps) {
  return (
    <View style={styles.row}>
      <TouchableOpacity
        style={styles.sideButton}
        onPress={onGalleryPress}
        activeOpacity={0.7}
        accessibilityLabel="Open gallery"
      >
        <Ionicons name="images-outline" size={24} color="rgba(255,255,255,0.8)" />
      </TouchableOpacity>

      <TouchableOpacity
        onPress={onPress}
        disabled={disabled}
        activeOpacity={0.8}
        style={[styles.shutterOuter, disabled && styles.shutterDisabled]}
        accessibilityLabel="Take photo"
      >
        <View style={styles.shutterInner} />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.sideButton}
        onPress={onFlashToggle}
        activeOpacity={0.7}
        accessibilityLabel={flashEnabled ? 'Flash on' : 'Flash off'}
      >
        <Ionicons
          name={flashEnabled ? 'flash' : 'flash-off-outline'}
          size={24}
          color={flashEnabled ? '#FFD060' : 'rgba(255,255,255,0.8)'}
        />
      </TouchableOpacity>
    </View>
  )
}

const SHUTTER_OUTER = 72
const SHUTTER_INNER = 58

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 40,
  },
  sideButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  shutterOuter: {
    width: SHUTTER_OUTER,
    height: SHUTTER_OUTER,
    borderRadius: SHUTTER_OUTER / 2,
    borderWidth: 3,
    borderColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  shutterInner: {
    width: SHUTTER_INNER,
    height: SHUTTER_INNER,
    borderRadius: SHUTTER_INNER / 2,
    backgroundColor: '#7DB87A',
  },
  shutterDisabled: {
    opacity: 0.4,
  },
})