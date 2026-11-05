import React from 'react';
import { Tabs } from 'expo-router';
import { CustomBottomBar } from '../../components/CustomBottomBar';

export default function TabLayout() {
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
