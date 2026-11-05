import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter, usePathname } from 'expo-router';
import { THEME } from '../constants/theme';

export const CustomBottomBar: React.FC = () => {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const pathname = usePathname();

  const isMap = pathname.includes('/map') || pathname === '/';
  const isFeed = pathname.includes('/feed');
  const isSettings = pathname.includes('/settings');

  return (
    <View style={[styles.container, { paddingBottom: Math.max(insets.bottom, 12) }]}>
      <View style={styles.bar}>
        {/* Tab 1: Map (Compass) */}
        <TouchableOpacity
          onPress={() => router.push('/(tabs)/map')}
          style={[styles.circleButton, isMap && styles.circleButtonActive]}
          activeOpacity={0.8}
          accessibilityLabel="Mapa del campus UTCH"
        >
          <Ionicons
            name="compass-outline"
            size={28}
            color={isMap ? THEME.colors.primaryDark : '#FFFFFF'}
          />
        </TouchableOpacity>

        {/* Tab 2: Social Feed / Community (User icon as in mockup) */}
        <TouchableOpacity
          onPress={() => router.push('/(tabs)/feed')}
          style={[styles.circleButton, isFeed && styles.circleButtonActive]}
          activeOpacity={0.8}
          accessibilityLabel="Feed de objetos perdidos"
        >
          <Ionicons
            name="people-outline"
            size={26}
            color={isFeed ? THEME.colors.primaryDark : '#FFFFFF'}
          />
        </TouchableOpacity>

        {/* Tab 3: Settings (Sliders / Ajustes) */}
        <TouchableOpacity
          onPress={() => router.push('/(tabs)/settings')}
          style={[styles.circleButton, isSettings && styles.circleButtonActive]}
          activeOpacity={0.8}
          accessibilityLabel="Ajustes de cuenta"
        >
          <MaterialCommunityIcons
            name="tune-variant"
            size={26}
            color={isSettings ? THEME.colors.primaryDark : '#FFFFFF'}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: THEME.colors.primaryDark,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.15)',
  },
  bar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 20,
    height: 56,
  },
  circleButton: {
    width: 46,
    height: 46,
    borderRadius: 23,
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  circleButtonActive: {
    backgroundColor: '#FFFFFF',
    borderColor: '#FFFFFF',
    transform: [{ scale: 1.06 }],
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
    elevation: 4,
  },
});
