import { Tabs } from 'expo-router';

import { AppIcon, type AppIconName } from '@/components/ui/AppIcon';
import { colors } from '@/theme/tokens';

const tabIcons: Record<string, AppIconName> = {
  index: 'home',
  practice: 'practice',
  review: 'review',
  profile: 'profile',
};

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.muted,
        tabBarIcon: ({ color, size }) => <AppIcon color={color} name={tabIcons[route.name]} size={size - 2} />,
        tabBarLabelStyle: { fontSize: 12, fontWeight: '700', marginTop: 2 },
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.line,
          height: 72,
          paddingBottom: 10,
          paddingTop: 8,
        },
      })}
    >
      <Tabs.Screen name="index" options={{ title: '홈' }} />
      <Tabs.Screen name="practice" options={{ title: '연습' }} />
      <Tabs.Screen name="review" options={{ title: '복습' }} />
      <Tabs.Screen name="profile" options={{ title: '나' }} />
    </Tabs>
  );
}
