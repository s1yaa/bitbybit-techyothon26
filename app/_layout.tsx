import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native'
import { useFonts } from 'expo-font'
import { Stack } from 'expo-router'
import * as SplashScreen from 'expo-splash-screen'
import { StatusBar } from 'expo-status-bar'
import { useEffect } from 'react'
import { useColorScheme } from 'react-native'
import 'react-native-reanimated'
import { supabase } from '@/lib/supabase'
import { useUserStore } from '@/store/userStore'

SplashScreen.preventAutoHideAsync()

export default function RootLayout() {
  const colorScheme = useColorScheme()

  const [fontsLoaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  })

  const setUser = useUserStore((s) => s.setUser)

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync()
    }
  }, [fontsLoaded])

  useEffect(() => {
    const client = supabase
    if (!client) return

    // Restore existing session or sign in anonymously
    client.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser({ id: session.user.id } as any)
      } else {
        client.auth.signInAnonymously().then(({ data }) => {
          if (data.user) setUser({ id: data.user.id } as any)
        })
      }
    })

    // Keep user in sync if the session refreshes
    const { data: { subscription } } = client.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser({ id: session.user.id } as any)
      }
    })

    return () => subscription.unsubscribe()
  }, [setUser])

  if (!fontsLoaded) return null

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <>
        <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />

        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />

          <Stack.Screen name="(tabs)" />

          <Stack.Screen
            name="(result)"
            options={{
              presentation: 'modal',
              animation: 'slide_from_bottom',
            }}
          />
        </Stack>
      </>
    </ThemeProvider>
  )
}