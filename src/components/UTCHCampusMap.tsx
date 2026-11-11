import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import Svg, {
  Rect,
  Path,
  Circle,
  G,
  Text as SvgText,
  Line,
  Polygon,
} from 'react-native-svg';
import { Ionicons } from '@expo/vector-icons';
import { LostItem } from '../types';
import { THEME } from '../constants/theme';

interface UTCHCampusMapProps {
  items: LostItem[];
  selectedItemId: string | null;
  onSelectItem: (item: LostItem) => void;
  onMapPressCoords?: (coords: { x: number; y: number }) => void;
  isPickingLocation?: boolean;
}

const MAP_WIDTH = 640;
const MAP_HEIGHT = 780;

export const UTCHCampusMap: React.FC<UTCHCampusMapProps> = ({
  items,
  selectedItemId,
  onSelectItem,
  onMapPressCoords,
  isPickingLocation = false,
}) => {
  const horizontalScrollRef = useRef<React.ElementRef<typeof ScrollView>>(null);
  const verticalScrollRef = useRef<React.ElementRef<typeof ScrollView>>(null);
  const [zoomLevel, setZoomLevel] = React.useState<number>(1);

  // If selectedItemId changes, auto-center on the item's coordinates
  useEffect(() => {
    if (selectedItemId) {
      const selectedItem = items.find((i) => i.id === selectedItemId);
      if (selectedItem) {
        const targetX = (selectedItem.coords.x / 100) * MAP_WIDTH * zoomLevel - Dimensions.get('window').width / 2;
        const targetY = (selectedItem.coords.y / 100) * MAP_HEIGHT * zoomLevel - 200;

        horizontalScrollRef.current?.scrollTo({
          x: Math.max(0, targetX),
          animated: true,
        });
        verticalScrollRef.current?.scrollTo({
          y: Math.max(0, targetY),
          animated: true,
        });
      }
    }
  }, [selectedItemId, zoomLevel, items]);

  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 0.25, 2.0));
  };

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - 0.25, 0.8));
  };

  const handleReset = () => {
    setZoomLevel(1);
    horizontalScrollRef.current?.scrollTo({ x: 80, y: 0, animated: true });
    verticalScrollRef.current?.scrollTo({ y: 60, animated: true });
  };

  return (
    <View style={styles.container}>
      {/* Zoom / Map Controls */}
      <View style={styles.controlsOverlay}>
        <TouchableOpacity style={styles.ctrlBtn} onPress={handleZoomIn} activeOpacity={0.8}>
          <Ionicons name="add" size={20} color={THEME.colors.primaryDark} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.ctrlBtn} onPress={handleZoomOut} activeOpacity={0.8}>
          <Ionicons name="remove" size={20} color={THEME.colors.primaryDark} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.ctrlBtn} onPress={handleReset} activeOpacity={0.8}>
          <Ionicons name="scan-outline" size={18} color={THEME.colors.primaryDark} />
        </TouchableOpacity>
      </View>

      <View style={styles.campusTag}>
        <View style={styles.liveDot} />
        <Text style={styles.campusTagText}>Campus UTCH Chihuahua</Text>
      </View>

      <ScrollView
        ref={verticalScrollRef}
        style={styles.outerScroll}
        contentContainerStyle={styles.outerScrollContent}
        maximumZoomScale={2.5}
        minimumZoomScale={0.7}
        showsVerticalScrollIndicator={false}
      >
        <ScrollView
          ref={horizontalScrollRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.horizontalScrollContent}
        >
          <View
            style={[
              styles.mapCanvas,
              {
                width: MAP_WIDTH * zoomLevel,
                height: MAP_HEIGHT * zoomLevel,
              },
            ]}
          >
            <Svg
              width={MAP_WIDTH * zoomLevel}
              height={MAP_HEIGHT * zoomLevel}
              viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`}
            >
              <Rect x="0" y="0" width={MAP_WIDTH} height={MAP_HEIGHT} fill="#F3F5F1" />

              {/* Green Zones / Jardines UTCH */}
              <Path
                d="M 120 220 L 320 220 L 300 380 L 100 370 Z"
                fill="#E1EEDD"
                stroke="#CCE0C6"
                strokeWidth="1"
              />
              <Path
                d="M 360 220 L 580 220 L 590 380 L 380 380 Z"
                fill="#E1EEDD"
                stroke="#CCE0C6"
                strokeWidth="1"
              />
              <Path
                d="M 100 440 L 260 430 L 260 620 L 90 610 Z"
                fill="#E4EFE0"
                stroke="#CFE2CB"
                strokeWidth="1"
              />
              <Path
                d="M 330 460 L 590 460 L 580 720 L 320 700 Z"
                fill="#DEEBD9"
                stroke="#C6DCC0"
                strokeWidth="1"
              />

              <Path
                d="M 0 100 Q 300 130 640 180"
                fill="none"
                stroke="#D6E0E8"
                strokeWidth="48"
                strokeLinecap="round"
              />
              <Path
                d="M 0 100 Q 300 130 640 180"
                fill="none"
                stroke="#A7B9C9"
                strokeWidth="2"
              />
              <Path
                d="M 0 100 Q 300 130 640 180"
                fill="none"
                stroke="#FFFFFF"
                strokeWidth="2"
                strokeDasharray="14,10"
              />

              <SvgText
                x="140"
                y="110"
                fill="#4B5E6D"
                fontSize="14"
                fontWeight="bold"
                letterSpacing="1"
                transform="rotate(4, 140, 110)"
              >
                Av. de la Cantera
              </SvgText>

              <G transform="translate(470, 70)">
                <Rect
                  x="0"
                  y="0"
                  width="130"
                  height="34"
                  rx="6"
                  fill="#FFF7ED"
                  stroke="#FDBA74"
                  strokeWidth="1.5"
                />
                <Circle cx="16" cy="17" r="10" fill="#EA580C" />
                <SvgText x="16" y="21" fill="#FFFFFF" fontSize="10" textAnchor="middle" fontWeight="bold">
                  🍴
                </SvgText>
                <SvgText x="32" y="22" fill="#9A3412" fontSize="12" fontWeight="700">
                  Señor Camarón
                </SvgText>
              </G>

              <Path
                d="M 330 130 L 330 200 L 290 280 L 290 380 L 270 410"
                fill="none"
                stroke="#DFE6EC"
                strokeWidth="28"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <Path
                d="M 330 200 L 460 210 L 480 320 L 420 380 L 280 410"
                fill="none"
                stroke="#DFE6EC"
                strokeWidth="24"
                strokeLinejoin="round"
              />
              <Path
                d="M 270 410 L 170 430 L 160 560 L 250 630"
                fill="none"
                stroke="#DFE6EC"
                strokeWidth="22"
                strokeLinejoin="round"
              />
              <Path
                d="M 270 410 L 380 480 L 480 520 L 480 660"
                fill="none"
                stroke="#DFE6EC"
                strokeWidth="22"
                strokeLinejoin="round"
              />

              <Circle
                cx="270"
                cy="410"
                r="38"
                fill="#DFE6EC"
                stroke="#B5C3CF"
                strokeWidth="2"
              />
              <Circle cx="270" cy="410" r="22" fill="#C9D6CE" stroke="#8CA293" strokeWidth="2" />
              {/* Statue Center Dot */}
              <Circle cx="270" cy="410" r="8" fill="#5F7D67" />
              <SvgText
                x="320"
                y="415"
                fill="#475569"
                fontSize="13"
                fontWeight="700"
              >
                El Cazador
              </SvgText>

              {/* Store: OXXO UTCH */}
              <G transform="translate(380, 155)">
                <Rect
                  x="0"
                  y="0"
                  width="116"
                  height="30"
                  rx="6"
                  fill="#EFF6FF"
                  stroke="#93C5FD"
                  strokeWidth="1.5"
                />
                <Circle cx="15" cy="15" r="9" fill="#2563EB" />
                <SvgText x="15" y="19" fill="#FFFFFF" fontSize="10" textAnchor="middle" fontWeight="bold">
                  🏪
                </SvgText>
                <SvgText x="30" y="20" fill="#1D4ED8" fontSize="12" fontWeight="700">
                  OXXO UTCH
                </SvgText>
              </G>

              <G transform="translate(140, 230)">
                <Polygon
                  points="0,0 120,20 100,110 -15,85"
                  fill="#E6ECE2"
                  stroke="#9CAD97"
                  strokeWidth="2"
                />
                <Rect
                  x="15"
                  y="20"
                  width="70"
                  height="45"
                  fill="#D8E2D3"
                  stroke="#879982"
                  strokeWidth="1.5"
                />
                {/* Badge icon */}
                <Circle cx="50" cy="42" r="14" fill="#64748B" />
                <SvgText x="50" y="47" fill="#FFFFFF" fontSize="12" textAnchor="middle">
                  🏛️
                </SvgText>
              </G>
              <SvgText
                x="200"
                y="355"
                fill="#334155"
                fontSize="12"
                fontWeight="700"
                textAnchor="middle"
              >
                {'UTCH "Inclusión"'}
              </SvgText>
              <SvgText
                x="200"
                y="370"
                fill="#64748B"
                fontSize="11"
                fontWeight="600"
                textAnchor="middle"
              >
                y Laboratorios
              </SvgText>

              <G transform="translate(420, 240)">
                <Polygon
                  points="0,10 90,0 120,95 20,110"
                  fill="#E6ECE2"
                  stroke="#9CAD97"
                  strokeWidth="2"
                />
                <Rect
                  x="20"
                  y="20"
                  width="75"
                  height="50"
                  fill="#D8E2D3"
                  stroke="#879982"
                  strokeWidth="1.5"
                />
              </G>
              <SvgText
                x="490"
                y="365"
                fill="#334155"
                fontSize="14"
                fontWeight="700"
                textAnchor="middle"
              >
                UTCH
              </SvgText>

              <G transform="translate(100, 460)">
                <Polygon
                  points="10,0 95,15 80,95 0,75"
                  fill="#E6ECE2"
                  stroke="#9CAD97"
                  strokeWidth="2"
                />
                <Circle cx="48" cy="45" r="14" fill="#64748B" />
                <SvgText x="48" y="50" fill="#FFFFFF" fontSize="12" textAnchor="middle">
                  🎓
                </SvgText>
              </G>
              <SvgText
                x="145"
                y="565"
                fill="#334155"
                fontSize="12"
                fontWeight="700"
                textAnchor="middle"
              >
                Tecnologías de la
              </SvgText>
              <SvgText
                x="145"
                y="580"
                fill="#64748B"
                fontSize="11"
                fontWeight="600"
                textAnchor="middle"
              >
                Información
              </SvgText>

              <G transform="translate(85, 620)">
                <Rect
                  x="0"
                  y="0"
                  width="90"
                  height="65"
                  fill="#E6ECE2"
                  stroke="#9CAD97"
                  strokeWidth="2"
                  rx="4"
                />
                <Circle cx="45" cy="32" r="14" fill="#3B82F6" />
                <SvgText x="45" y="37" fill="#FFFFFF" fontSize="11" textAnchor="middle">
                  🏛️
                </SvgText>
              </G>
              <SvgText
                x="130"
                y="705"
                fill="#334155"
                fontSize="13"
                fontWeight="700"
                textAnchor="middle"
              >
                Rectoría
              </SvgText>

              <G transform="translate(320, 320)">
                <Rect
                  x="0"
                  y="0"
                  width="65"
                  height="45"
                  fill="#EAEFE7"
                  stroke="#9CAD97"
                  strokeWidth="1.5"
                  rx="4"
                />
                <SvgText x="32" y="27" fill="#64748B" fontSize="10" textAnchor="middle">
                  ☕ Cafetería
                </SvgText>
              </G>

              <G transform="translate(420, 500)">
                <Rect
                  x="0"
                  y="0"
                  width="120"
                  height="160"
                  fill="#D4E4D0"
                  stroke="#7CA074"
                  strokeWidth="2"
                  rx="4"
                />
                <Line x1="0" y1="80" x2="120" y2="80" stroke="#FFFFFF" strokeWidth="2" />
                <Circle cx="60" cy="80" r="22" stroke="#FFFFFF" strokeWidth="2" fill="none" />
                <SvgText
                  x="60"
                  y="45"
                  fill="#2D5A27"
                  fontSize="12"
                  fontWeight="bold"
                  textAnchor="middle"
                >
                  Canchas UTCH
                </SvgText>
              </G>

              <G transform="translate(450, 400)">
                <Rect
                  x="0"
                  y="0"
                  width="100"
                  height="60"
                  fill="#E2E7EB"
                  stroke="#BCC8D1"
                  strokeWidth="1"
                  strokeDasharray="4,4"
                />
                <SvgText x="50" y="35" fill="#64748B" fontSize="12" fontWeight="bold" textAnchor="middle">
                  Estacionamiento P1
                </SvgText>
              </G>
            </Svg>

            {items.map((item) => {
              const posX = (item.coords.x / 100) * MAP_WIDTH * zoomLevel;
              const posY = (item.coords.y / 100) * MAP_HEIGHT * zoomLevel;
              const isSelected = item.id === selectedItemId;

              return (
                <TouchableOpacity
                  key={item.id}
                  style={[
                    styles.pinContainer,
                    {
                      left: posX - 22,
                      top: posY - 22,
                    },
                  ]}
                  onPress={() => onSelectItem(item)}
                  activeOpacity={0.8}
                >
                  {isSelected && (
                    <View style={styles.selectedRipple} />
                  )}

                  <View
                    style={[
                      styles.pinCircle,
                      isSelected && styles.pinCircleSelected,
                      item.type === 'lost' && styles.pinCircleLost,
                    ]}
                  >
                    <Ionicons
                      name="star"
                      size={18}
                      color="#FFFFFF"
                    />
                  </View>

                  <View
                    style={[
                      styles.pinArrow,
                      isSelected && styles.pinArrowSelected,
                      item.type === 'lost' && styles.pinArrowLost,
                    ]}
                  />

                  <View style={styles.pinLabelBadge}>
                    <Text style={styles.pinLabelText} numberOfLines={1}>
                      {item.title}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.colors.mapBackground,
    position: 'relative',
  },
  outerScroll: {
    flex: 1,
  },
  outerScrollContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  horizontalScrollContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapCanvas: {
    position: 'relative',
    backgroundColor: '#F3F5F1',
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
  pinContainer: {
    position: 'absolute',
    width: 44,
    height: 52,
    alignItems: 'center',
    zIndex: 10,
  },
  selectedRipple: {
    position: 'absolute',
    top: -6,
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 3,
    borderColor: THEME.colors.primaryLight,
    backgroundColor: 'rgba(101, 199, 66, 0.25)',
  },
  pinCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: THEME.colors.pinDarkGreen,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.35,
    shadowRadius: 4,
    elevation: 6,
  },
  pinCircleSelected: {
    backgroundColor: '#073319',
    borderColor: THEME.colors.primaryLight,
    borderWidth: 2.5,
    transform: [{ scale: 1.15 }],
  },
  pinCircleLost: {
    backgroundColor: '#0D522C',
  },
  pinArrow: {
    width: 0,
    height: 0,
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderTopWidth: 8,
    borderStyle: 'solid',
    backgroundColor: 'transparent',
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: THEME.colors.pinDarkGreen,
    marginTop: -1,
  },
  pinArrowSelected: {
    borderTopColor: '#073319',
  },
  pinArrowLost: {
    borderTopColor: '#0D522C',
  },
  pinLabelBadge: {
    backgroundColor: 'rgba(13, 82, 44, 0.92)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    marginTop: 2,
    maxWidth: 90,
  },
  pinLabelText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '600',
    textAlign: 'center',
  },
});
