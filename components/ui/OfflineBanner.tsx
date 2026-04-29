import { WASTE_CATEGORIES } from '@/constants/waste'
import { useClassificationStore } from '@/store/classificationStore'
import { WasteCategory } from '@/types'
import { Ionicons } from '@expo/vector-icons'
import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'

interface OfflineBannerProps {
  visible: boolean
}

const MANUAL_CATEGORIES: WasteCategory[] = [
  'recyclable',
  'wet',
  'hazardous',
  'dry',
  'ewaste',
]

export default function OfflineBanner({ visible }: OfflineBannerProps) {
  const setResult = useClassificationStore((s) => s.setResult)

  if (!visible) return null

  function handleManualSelect(category: WasteCategory) {
    const meta = WASTE_CATEGORIES[category]

    setResult({
      category,
      label: meta?.label ?? category,
      explanation: 'Manually selected — no AI classification available.',
      confidence: 0,
      tip: meta?.description ?? '',
    })
  }

  return (
    <View style={styles.banner}>
      <View style={styles.row}>
        <Ionicons name="cloud-offline-outline" size={14} color="#EAB45C" />
        <Text style={styles.message}>
          Offline — select category manually
        </Text>
      </View>

      <View style={styles.buttons}>
        {MANUAL_CATEGORIES.map((cat) => {
          const meta = WASTE_CATEGORIES[cat]

          return (
            <TouchableOpacity
              key={cat}
              style={[
                styles.catButton,
                { borderColor: meta?.color ?? '#888' },
              ]}
              onPress={() => handleManualSelect(cat)}
              activeOpacity={0.7}
            >
              <View
                style={[
                  styles.catDot,
                  { backgroundColor: meta?.color ?? '#888' },
                ]}
              />
              <Text
                style={[
                  styles.catLabel,
                  { color: meta?.color ?? '#888' },
                ]}
              >
                {meta?.label ?? cat}
              </Text>
            </TouchableOpacity>
          )
        })}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  banner: {
    backgroundColor: 'rgba(234,180,92,0.12)',
    borderWidth: 0.5,
    borderColor: 'rgba(234,180,92,0.3)',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginHorizontal: 16,
    marginBottom: 8,
    gap: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  message: {
    fontSize: 13,
    color: '#EAB45C',
    fontWeight: '600',
    flexShrink: 1,
  },
  buttons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  catButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    borderWidth: 1,
    backgroundColor: '#fff',
  },
  catDot: {
    width: 6,
    height: 6,
    borderRadius: 999,
  },
  catLabel: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
})