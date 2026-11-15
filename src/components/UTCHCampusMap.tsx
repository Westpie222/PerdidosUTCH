import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { WebView, WebViewMessageEvent } from 'react-native-webview';
import { Ionicons } from '@expo/vector-icons';
import { LostItem } from '../types';
import { THEME } from '../constants/theme';
import {
  CAMPUS_BOUNDS,
  CAMPUS_CENTER,
  CAMPUS_MARGIN,
  getItemPosition,
} from '../constants/campusLocations';

interface UTCHCampusMapProps {
  items: LostItem[];
  selectedItemId: string | null;
  onSelectItem: (item: LostItem) => void;
}

const MAP_HTML = `<!DOCTYPE html>
<html>
<head>
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css">
<style>
  html, body, #map { height: 100%; margin: 0; background: ${THEME.colors.mapBackground}; }
  .pin { width: 22px; height: 22px; border-radius: 50%; border: 3px solid #fff; box-shadow: 0 1px 4px rgba(0,0,0,.45); }
  .pin.found { background: ${THEME.colors.badgeFound}; }
  .pin.lost { background: ${THEME.colors.badgeLost}; }
  .pin.selected { transform: scale(1.35); border-color: ${THEME.colors.primaryDark}; }
</style>
</head>
<body>
<div id="map"></div>
<script src="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js"></script>
<script>
  var CENTER = [${CAMPUS_CENTER.latitude}, ${CAMPUS_CENTER.longitude}];
  var map = L.map('map', {
    center: CENTER,
    zoom: 17,
    minZoom: 17,
    maxZoom: 19,
    zoomControl: false,
    maxBounds: [
      [${CAMPUS_BOUNDS.south - CAMPUS_MARGIN}, ${CAMPUS_BOUNDS.west - CAMPUS_MARGIN}],
      [${CAMPUS_BOUNDS.north + CAMPUS_MARGIN}, ${CAMPUS_BOUNDS.east + CAMPUS_MARGIN}]
    ],
    maxBoundsViscosity: 1.0
  });
  map.attributionControl.setPrefix(false);
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);

  var markers = {};
  function send(message) {
    window.ReactNativeWebView.postMessage(JSON.stringify(message));
  }
  function setItems(list, selectedId) {
    Object.keys(markers).forEach(function (id) { map.removeLayer(markers[id]); });
    markers = {};
    list.forEach(function (item) {
      var selected = item.id === selectedId;
      var marker = L.marker([item.lat, item.lng], {
        icon: L.divIcon({
          className: '',
          html: '<div class="pin ' + item.type + (selected ? ' selected' : '') + '"></div>',
          iconSize: [28, 28],
          iconAnchor: [14, 14]
        }),
        zIndexOffset: selected ? 1000 : 0
      });
      marker.on('click', function () { send({ type: 'select', id: item.id }); });
      marker.addTo(map);
      markers[item.id] = marker;
    });
    if (selectedId && markers[selectedId]) map.panTo(markers[selectedId].getLatLng());
  }
  send({ type: 'ready' });
</script>
</body>
</html>`;

export const UTCHCampusMap: React.FC<UTCHCampusMapProps> = ({
                                                              items,
                                                              selectedItemId,
                                                              onSelectItem,
                                                            }) => {
  const webViewRef = useRef<React.ComponentRef<typeof WebView>>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!ready) return;
    const markers = items.map((item) => {
      const { latitude, longitude } = getItemPosition(item);
      return { id: item.id, type: item.type, lat: latitude, lng: longitude };
    });
    webViewRef.current?.injectJavaScript(
        `setItems(${JSON.stringify(markers)}, ${JSON.stringify(selectedItemId)}); true;`
    );
  }, [ready, items, selectedItemId]);

  const handleMessage = (event: WebViewMessageEvent) => {
    const message = JSON.parse(event.nativeEvent.data) as { type: string; id?: string };
    if (message.type === 'ready') {
      setReady(true);
    } else if (message.type === 'select') {
      const item = items.find((i) => i.id === message.id);
      if (item) onSelectItem(item);
    }
  };

  const runInMap = (code: string) => webViewRef.current?.injectJavaScript(`${code}; true;`);

  return (
      <View style={styles.container}>
        {/* Zoom / Map Controls */}
        <View style={styles.controlsOverlay}>
          <TouchableOpacity style={styles.ctrlBtn} onPress={() => runInMap('map.zoomIn()')} activeOpacity={0.8}>
            <Ionicons name="add" size={20} color={THEME.colors.primaryDark} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.ctrlBtn} onPress={() => runInMap('map.zoomOut()')} activeOpacity={0.8}>
            <Ionicons name="remove" size={20} color={THEME.colors.primaryDark} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.ctrlBtn} onPress={() => runInMap('map.setView(CENTER, 17)')} activeOpacity={0.8}>
            <Ionicons name="scan-outline" size={18} color={THEME.colors.primaryDark} />
          </TouchableOpacity>
        </View>

        {/* Campus Tag Pill */}
        <View style={styles.campusTag}>
          <View style={styles.liveDot} />
          <Text style={styles.campusTagText}>UTCH Chihuahua</Text>
        </View>

        <WebView
            ref={webViewRef}
            style={styles.map}
            source={{ html: MAP_HTML, baseUrl: 'https://perdidosutch.firebaseapp.com/' }}
            originWhitelist={['*']}
            javaScriptEnabled
            onMessage={handleMessage}
        />
      </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.colors.mapBackground,
    position: 'relative',
  },
  map: {
    flex: 1,
    backgroundColor: THEME.colors.mapBackground,
  },
  controlsOverlay: {
    position: 'absolute',
    top: 14,
    right: 14,
    zIndex: 20,
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 12,
    padding: 4,
    borderWidth: 1,
    borderColor: '#DDE2D9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  ctrlBtn: {
    width: 38,
    height: 38,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    marginVertical: 2,
  },
  campusTag: {
    position: 'absolute',
    top: 14,
    left: 14,
    zIndex: 20,
    backgroundColor: 'rgba(255,255,255,0.95)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#DDE2D9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: THEME.colors.primaryDark,
    marginRight: 6,
  },
  campusTagText: {
    fontSize: 12,
    fontWeight: '700',
    color: THEME.colors.primaryDark,
  },
});
