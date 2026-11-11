import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { CustomHeader } from '../../components/CustomHeader';
import { UTCHCampusMap } from '../../components/UTCHCampusMap';
import { ItemDetailModal } from '../../components/ItemDetailModal';
import { PublishModal } from '../../components/PublishModal';
import { THEME } from '../../constants/theme';
import { useLostItems } from '../../context/LostItemsContext';
import { LostItem } from '../../types';

export default function MapScreen() {
  const router = useRouter();
  const { items, selectedItemId, setSelectedItemId } = useLostItems();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'found' | 'lost'>('all');
  const [publishVisible, setPublishVisible] = useState(false);

  const detailItem = items.find((i) => i.id === selectedItemId) ?? null;
  const detailVisible = Boolean(selectedItemId);

  const filteredItems = items.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.locationName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType =
      filterType === 'all' || item.type === filterType;

    return matchesSearch && matchesType;
  });

  const handleSelectItem = (item: LostItem) => {
    setSelectedItemId(item.id);
  };

  const handleCloseDetail = () => {
    setSelectedItemId(null);
  };

  return (
    <View style={styles.container}>
      <CustomHeader
        title="PerdidosUTCH"
        showBell={true}
        onBellPress={() => router.push('/(tabs)/feed')}
      />

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

      <View style={styles.filterBar}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
          <TouchableOpacity
            style={[styles.filterChip, filterType === 'all' && styles.filterChipActive]}
            onPress={() => setFilterType('all')}
            activeOpacity={0.8}
          >
            <Text style={[styles.filterChipText, filterType === 'all' && styles.filterChipTextActive]}>
              Todos ({items.length})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.filterChip, filterType === 'found' && styles.filterChipActiveFound]}
            onPress={() => setFilterType('found')}
            activeOpacity={0.8}
          >
            <Ionicons
              name="checkmark-circle"
              size={14}
              color={filterType === 'found' ? '#FFFFFF' : THEME.colors.primaryLight}
              style={{ marginRight: 4 }}
            />
            <Text style={[styles.filterChipText, filterType === 'found' && styles.filterChipTextActive]}>
              Encontrados ({items.filter((i) => i.type === 'found').length})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.filterChip, filterType === 'lost' && styles.filterChipActiveLost]}
            onPress={() => setFilterType('lost')}
            activeOpacity={0.8}
          >
            <Ionicons
              name="help-circle"
              size={14}
              color={filterType === 'lost' ? '#FFFFFF' : '#E11D48'}
              style={{ marginRight: 4 }}
            />
            <Text style={[styles.filterChipText, filterType === 'lost' && styles.filterChipTextActive]}>
              Perdidos ({items.filter((i) => i.type === 'lost').length})
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      <View style={styles.mapContainer}>
        <UTCHCampusMap
          items={filteredItems}
          selectedItemId={selectedItemId}
          onSelectItem={handleSelectItem}
        />

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

      <ItemDetailModal
        item={detailItem}
        visible={detailVisible}
        onClose={handleCloseDetail}
      />

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
  filterBar: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    paddingVertical: 8,
  },
  filterScroll: {
    paddingHorizontal: 16,
    gap: 8,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  filterChipActive: {
    backgroundColor: THEME.colors.primaryDark,
    borderColor: THEME.colors.primaryDark,
  },
  filterChipActiveFound: {
    backgroundColor: THEME.colors.primaryDark,
    borderColor: THEME.colors.primaryDark,
  },
  filterChipActiveLost: {
    backgroundColor: '#E11D48',
    borderColor: '#E11D48',
  },
  filterChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
  },
  filterChipTextActive: {
    color: '#FFFFFF',
  },
  mapContainer: {
    flex: 1,
    position: 'relative',
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
