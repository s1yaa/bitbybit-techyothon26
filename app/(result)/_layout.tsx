import { Stack } from 'expo-router';

export default function ResultLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        presentation: 'modal',
        animation: 'slide_from_bottom',
        contentStyle: { backgroundColor: '#F7F5F0' },
      }}
    />
  );
}