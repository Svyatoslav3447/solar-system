import '@/global.css';

import { configureReanimatedLogger, ReanimatedLogLevel } from 'react-native-reanimated';
import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import { useColorScheme } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AppStoreProvider } from '@solar-system/store';

configureReanimatedLogger({
  level: ReanimatedLogLevel.warn,
  strict: false,
});

export default function TabLayout() {
  const colorScheme = useColorScheme();
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <AppStoreProvider>
          <Stack screenOptions={{ headerShown: false }} />
        </AppStoreProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
