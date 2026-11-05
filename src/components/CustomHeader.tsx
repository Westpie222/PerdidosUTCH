import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { THEME } from '../constants/theme';
import { useLostItems } from '../context/LostItemsContext';

interface CustomHeaderProps {
  title?: string;
  showBell?: boolean;
  onBellPress?: () => void;
  showBack?: boolean;
}

export const CustomHeader: React.FC<CustomHeaderProps> = ({
  title = 'PerdidosUTCH',
  showBell = true,
  onBellPress,
  showBack = false,
}) => {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { items } = useLostItems();

  const handleBellPress = () => {
    if (onBellPress) {
      onBellPress();
    } else {
      router.push('/(tabs)/feed');
    }
  };

  return (
    <View style={[styles.headerContainer, { paddingTop: Math.max(insets.top, Platform.OS === 'android' ? 14 : 12) }]}>
      <View style={styles.headerContent}>
        <View style={styles.leftRow}>
          {showBack && (
            <TouchableOpacity
              onPress={() => router.back()}
              style={styles.backBtn}
              activeOpacity={0.7}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons name="chevron-back" size={26} color="#FFFFFF" />
            </TouchableOpacity>
          )}
          <Text style={styles.titleText}>{title}</Text>
        </View>

        {showBell && (
          <TouchableOpacity
            onPress={handleBellPress}
            style={styles.bellBtn}
            activeOpacity={0.7}
            accessibilityLabel="Feed de notificaciones de objetos perdidos"
          >
            <Ionicons name="notifications" size={28} color={THEME.colors.bellAccent} />
            {items.length > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{items.length}</Text>
              </View>
            )}
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: THEME.colors.primaryDark,
    paddingHorizontal: 20,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.12)',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 44,
  },
  leftRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backBtn: {
    marginRight: 8,
  },
  titleText: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  bellBtn: {
    position: 'relative',
    padding: 4,
  },
  badge: {
    position: 'absolute',
    top: 2,
    right: 2,
    backgroundColor: '#EF4444',
    borderRadius: 9,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
    borderWidth: 1.5,
    borderColor: THEME.colors.primaryDark,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
});
