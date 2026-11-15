import React from 'react';
import { Redirect, Tabs } from 'expo-router';
import { CustomBottomBar } from '../../components/CustomBottomBar';
import { useLostItems } from '../../context/LostItemsContext';

export default function TabLayout() {
  const { authReady, isLoggedIn } = useLostItems();

  if (!authReady) return null;
  if (!isLoggedIn) return <Redirect href="/" />;

  return (
    <Tabs
      tabBar={() => <CustomBottomBar />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="map"
        options={{
          title: 'Mapa',
        }}
      />
      <Tabs.Screen
        name="feed"
        options={{
          title: 'Notificaciones',
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Ajustes',
        }}
      />
    </Tabs>
  );
}
