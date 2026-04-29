import React from 'react'
import { StyleSheet, Text, View } from 'react-native'

const CORNER_SIZE = 28
const CORNER_THICKNESS = 2.5
const CORNER_COLOR = '#7DB87A'

function Corner({ position }: { position: 'tl' | 'tr' | 'bl' | 'br' }) {
  const isTop = position === 'tl' || position === 'tr'
  const isLeft = position === 'tl' || position === 'bl'

  return (
    <View
      style={[
        styles.corner,
        isTop ? styles.cornerTop : styles.cornerBottom,
        isLeft ? styles.cornerLeft : styles.cornerRight,
      ]}
    >
      <View
        style={[
          styles.bar,
          styles.barHorizontal,
          isTop ? styles.barTop : styles.barBottom,
          isLeft ? styles.barLeft : styles.barRight,
        ]}
      />
      <View
        style={[
          styles.bar,
          styles.barVertical,
          isTop ? styles.barTop : styles.barBottom,
          isLeft ? styles.barLeft : styles.barRight,
        ]}
      />
    </View>
  )
}

export function ScanFrame() {
  return (
    <View style={styles.container} pointerEvents="none">
      <View style={styles.dimTop} />
      <View style={styles.dimMiddleRow}>
        <View style={styles.dimSide} />
        <View style={styles.scanWindow}>
          <Corner position="tl" />
          <Corner position="tr" />
          <Corner position="bl" />
          <Corner position="br" />
        </View>
        <View style={styles.dimSide} />
      </View>
      <View style={styles.dimBottom}>
        <Text style={styles.hint}>Point at waste to identify</Text>
      </View>
    </View>
  )
}

const WINDOW_SIZE = 280

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dimTop: {
    width: '100%',
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.55)',
  },
  dimBottom: {
    width: '100%',
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.55)',
    alignItems: 'center',
    paddingTop: 20,
  },
  dimMiddleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    height: WINDOW_SIZE,
  },
  dimSide: {
    flex: 1,
    height: WINDOW_SIZE,
    backgroundColor: 'rgba(0,0,0,0.55)',
  },
  scanWindow: {
    width: WINDOW_SIZE,
    height: WINDOW_SIZE,
    position: 'relative',
  },
  corner: {
    position: 'absolute',
    width: CORNER_SIZE,
    height: CORNER_SIZE,
  },
  cornerTop: { top: 0 },
  cornerBottom: { bottom: 0 },
  cornerLeft: { left: 0 },
  cornerRight: { right: 0 },
  bar: {
    position: 'absolute',
    backgroundColor: CORNER_COLOR,
    borderRadius: 2,
  },
  barHorizontal: {
    width: CORNER_SIZE,
    height: CORNER_THICKNESS,
  },
  barVertical: {
    width: CORNER_THICKNESS,
    height: CORNER_SIZE,
  },
  barTop: { top: 0 },
  barBottom: { bottom: 0 },
  barLeft: { left: 0 },
  barRight: { right: 0 },
  hint: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 13,
    letterSpacing: 0.3,
    fontWeight: '400',
  },
})