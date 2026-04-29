import { WASTE_CATEGORIES } from '@/constants/waste'
import { WasteCategory } from '@/types'
import React from 'react'
import { StyleSheet, Text, View } from 'react-native'

interface WasteBadgeProps {
  category: WasteCategory
  size?: 'sm' | 'md'
}

export default function WasteBadge({
  category,
  size = 'md',
}: WasteBadgeProps) {
  const meta = WASTE_CATEGORIES[category]

  const color = meta?.color ?? '#888'
  const label = meta?.label ?? category
  const isSmall = size === 'sm'

  return (
    <View
      style={[
        styles.pill,
        {
          backgroundColor: color + '1A',
          borderColor: color + '40',
        },
        isSmall && styles.pillSm,
      ]}
    >
      <View
        style={[
          styles.dot,
          { backgroundColor: color },
          isSmall && styles.dotSm,
        ]}
      />

      <Text
        style={[
          styles.label,
          { color },
          isSmall && styles.labelSm,
        ]}
      >
        {label}
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    gap: 6,
  },
  pillSm: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 999,
  },
  dotSm: {
    width: 5,
    height: 5,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 0.2,
    textTransform: 'capitalize',
  },
  labelSm: {
    fontSize: 11,
  },
})