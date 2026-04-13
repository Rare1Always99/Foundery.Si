import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { AlertProvider } from '@/template';
import { AppProvider } from '../contexts/AppContext';
import { ConstellationProvider } from '../contexts/ConstellationContext';

export default function RootLayout() {
  return (
    <AlertProvider>
      <AppProvider>
        <ConstellationProvider>
          <StatusBar style="light" />
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(tabs)" />
            <Stack.Screen
              name="command/[id]"
              options={{
                presentation: 'modal',
                animation: 'slide_from_bottom',
              }}
            />
            <Stack.Screen
              name="workspace/[id]"
              options={{
                animation: 'slide_from_right',
              }}
            />
            <Stack.Screen
              name="new-workspace"
              options={{
                presentation: 'modal',
                animation: 'slide_from_bottom',
              }}
            />
            <Stack.Screen
              name="node/[id]"
              options={{
                animation: 'slide_from_right',
              }}
            />
            <Stack.Screen
              name="verdict/[id]"
              options={{
                presentation: 'modal',
                animation: 'slide_from_bottom',
              }}
            />
          </Stack>
        </ConstellationProvider>
      </AppProvider>
    </AlertProvider>
  );
}
