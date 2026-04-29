import { Ionicons } from '@expo/vector-icons'
import { CameraType, CameraView, FlashMode, useCameraPermissions } from 'expo-camera'
import * as ImagePicker from 'expo-image-picker'
import { router } from 'expo-router'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import {
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'

import { ScanFrame } from '../../components/camera/ScanFrame'
import { ShutterButton } from '../../components/camera/ShutterButton'
import LoadingOverlay from '../../components/ui/LoadingOverlay'
import OfflineBanner from '../../components/ui/OfflineBanner'
import { useClassify } from '../../hooks/useClassify'
import { useClassificationStore } from '../../store/classificationStore'
import { useUserStore } from '../../store/userStore'

export default function ScanScreen() {
  const cameraRef = useRef<CameraView>(null)
  const [facing] = useState<CameraType>('back')
  const [flash, setFlash] = useState<FlashMode>('off')
  const [isOffline] = useState(false)
  const [isCapturing, setIsCapturing] = useState(false)
  const [permission, requestPermission] = useCameraPermissions()

  const { classify, isLoading } = useClassify()
  const result = useClassificationStore((s) => s.result)
  const reset = useClassificationStore((s) => s.reset)
  const streakDays = useUserStore((s) => s.streakDays)

  // Track whether we intentionally started a capture in this session
  const didCapture = useRef(false)

  // Clear any stale result from a previous scan when this screen mounts
  useEffect(() => {
    reset()
    didCapture.current = false
  }, [])

  // Navigate to result only after a capture we started ourselves
  useEffect(() => {
    if (result && !isLoading && didCapture.current) {
      didCapture.current = false
      router.push('/(result)/result' as any)
    }
  }, [result, isLoading])

  const handleCapture = useCallback(async () => {
    if (!cameraRef.current || isLoading || isCapturing) return

    try {
      setIsCapturing(true)
      didCapture.current = true
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.8,
        base64: false,
        skipProcessing: Platform.OS === 'android',
      })

      if (photo?.uri) {
        await classify(photo.uri)
      } else {
        // Photo failed; reset the flag so the guard stays correct
        didCapture.current = false
      }
    } catch (err) {
      console.error('[scan] capture error:', err)
      didCapture.current = false
    } finally {
      setIsCapturing(false)
    }
  }, [isLoading, isCapturing, classify])

  const handleGallery = useCallback(async () => {
    if (isLoading || isCapturing) return

    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
    if (status !== 'granted') return

    const picked = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
      allowsEditing: false,
    })

    if (!picked.canceled && picked.assets[0]?.uri) {
      didCapture.current = true
      await classify(picked.assets[0].uri)
    }
  }, [isLoading, isCapturing, classify])

  const toggleFlash = useCallback(() => {
    setFlash((prev) => (prev === 'off' ? 'on' : 'off'))
  }, [])

  if (!permission) return <View style={styles.root} />

  if (!permission.granted) {
    return (
      <View style={[styles.root, styles.centered]}>
        <Ionicons name="camera-outline" size={48} color="rgba(255,255,255,0.3)" />
        <Text style={styles.permText}>Camera access is required</Text>
        <TouchableOpacity style={styles.permButton} onPress={requestPermission}>
          <Text style={styles.permButtonText}>Grant permission</Text>
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" />

      <CameraView
        ref={cameraRef}
        style={StyleSheet.absoluteFill}
        facing={facing}
        flash={flash}
      />

      <ScanFrame />

      <View style={styles.topBar}>
        <Text style={styles.appTitle}>SortIt</Text>

        {streakDays > 0 && (
          <View style={styles.streakBadge}>
            <View style={styles.streakDot} />
            <Text style={styles.streakText}>{streakDays}d streak</Text>
          </View>
        )}
      </View>

      <View style={styles.bannerWrapper}>
        <OfflineBanner visible={isOffline} />
      </View>

      <View style={styles.bottomBar}>
        <ShutterButton
          onPress={handleCapture}
          onGalleryPress={handleGallery}
          onFlashToggle={toggleFlash}
          flashEnabled={flash === 'on'}
          disabled={isLoading || isCapturing}
        />
      </View>

      <LoadingOverlay visible={isLoading || isCapturing} message="Identifying waste…" />
    </View>
  )
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#0e0e0e',
  },
  centered: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  topBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingTop: 56,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  appTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 0.5,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  streakDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#7DB87A',
  },
  streakText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '500',
  },
  bannerWrapper: {
    position: 'absolute',
    bottom: 140,
    left: 0,
    right: 0,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 48,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  permText: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 16,
    textAlign: 'center',
  },
  permButton: {
    backgroundColor: '#7DB87A',
    borderRadius: 12,
    paddingHorizontal: 24,
    paddingVertical: 12,
    marginTop: 8,
  },
  permButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
})