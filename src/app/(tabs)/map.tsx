import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { CustomHeader } from '../../components/CustomHeader';
import { ItemDetailModal } from '../../components/ItemDetailModal';
import { PublishModal } from '../../components/PublishModal';
import { THEME } from '../../constants/theme';
import { useLostItems } from '../../context/LostItemsContext';

export default function MapScreen() {
  const router = useRouter();
  const { items, selectedItemId, setSelectedItemId } = useLostItems();

  const [searchQuery, setSearchQuery] = useState('');
  const [publishVisible, setPublishVisible] = useState(false);

  // Directly derive active detail item from selectedItemId
  const detailItem = items.find((i) => i.id === selectedItemId) ?? null;
  const detailVisible = Boolean(selectedItemId);

  const handleCloseDetail = () => {
    setSelectedItemId(null);
  };

  return (
    <View style={styles.container}>
      {/* Top Header matching Page 2: PerdidosUTCH + Bell Icon */}
      <CustomHeader
        title="PerdidosUTCH"
        showBell={true}
        onBellPress={() => router.push('/(tabs)/feed')}
      />

      {/* Campus Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={18} color="#64748B" style={{ marginRight: 8 }} />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar objeto en UTCH (mochila, credencial...)"
            placeholderTextColor="#94A3B8"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={18} color="#94A3B8" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Static UTCH Campus Map Image */}
      <View style={styles.mapContainer}>
        <Image
          source={require('../../../assets/images/mapa.jpg')}
          style={styles.mapImage}
          resizeMode="cover"
        />

        {/* Floating Action Button: + Publicar Objeto */}
        <TouchableOpacity
          style={styles.fabButton}
          onPress={() => setPublishVisible(true)}
          activeOpacity={0.85}
          accessibilityLabel="Publicar objeto perdido o encontrado"
        >
          <Ionicons name="camera" size={20} color="#FFFFFF" style={{ marginRight: 6 }} />
          <Text style={styles.fabText}>Publicar Objeto</Text>
        </TouchableOpacity>
      </View>

      {/* Detail Modal when pin is pressed */}
      <ItemDetailModal
        item={detailItem}
        visible={detailVisible}
        onClose={handleCloseDetail}
      />

      {/* Publish Modal */}
      <PublishModal
        visible={publishVisible}
        onClose={() => setPublishVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  searchContainer: {
    backgroundColor: THEME.colors.primaryDark,
    paddingHorizontal: 16,
    paddingBottom: 10,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: '#1E293B',
    paddingVertical: 0,
  },
  mapContainer: {
    flex: 1,
    position: 'relative',
  },
  mapImage: {
    width: '100%',
    height: '100%',
  },
  fabButton: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
    backgroundColor: THEME.colors.primaryLight,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 6,
    zIndex: 30,
  },
  fabText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
});
