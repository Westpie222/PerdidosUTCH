import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  RefreshControl,
  Share,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { CustomHeader } from '../../components/CustomHeader';
import { PublishModal } from '../../components/PublishModal';
import { THEME } from '../../constants/theme';
import { useLostItems } from '../../context/LostItemsContext';
import { LostItem } from '../../types';

export default function FeedScreen() {
  const router = useRouter();
  const { items, setSelectedItemId, savedItemIds, toggleSaveItem } = useLostItems();

  const [filter, setFilter] = useState<'all' | 'found' | 'lost'>('all');
  const [refreshing, setRefreshing] = useState(false);
  const [publishVisible, setPublishVisible] = useState(false);
  const [likedMap, setLikedMap] = useState<Record<string, boolean>>({});

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 600);
  };

  const handleCardPress = (item: LostItem) => {
    // "al darle a la publicación, te mandará al mapa en la localización donde se encuentra"
    setSelectedItemId(item.id);
    router.push('/(tabs)/map');
  };

  const toggleLike = (itemId: string) => {
    setLikedMap((prev) => ({ ...prev, [itemId]: !prev[itemId] }));
  };

  const handleShare = async (item: LostItem) => {
    try {
      await Share.share({
        message: `¡Objeto ${item.type === 'found' ? 'encontrado' : 'perdido'} en UTCH! ${item.title} en ${item.locationName}. Búscalo en la app PerdidosUTCH.`,
      });
    } catch {
      // ignore
    }
  };

  const filteredItems = items.filter((item) => {
    if (filter === 'all') return true;
    return item.type === filter;
  });

  const renderPost = ({ item }: { item: LostItem }) => {
    const isLiked = likedMap[item.id] || false;
    const isSaved = savedItemIds.includes(item.id);

    return (
      <View style={styles.cardContainer}>
        {/* Card Header matching mockup dark green bar with user info / title */}
        <TouchableOpacity
          style={styles.cardHeader}
          onPress={() => handleCardPress(item)}
          activeOpacity={0.85}
        >
          <View style={styles.headerLeft}>
            <View style={styles.authorAvatar}>
              <Ionicons name="person" size={14} color="#FFFFFF" />
            </View>
            <View>
              <Text style={styles.authorName} numberOfLines={1}>
                {item.author.name}
              </Text>
              <Text style={styles.postMeta}>
                {item.locationName} • {item.date}
              </Text>
            </View>
          </View>

          <View
            style={[
              styles.badge,
              item.type === 'found' ? styles.badgeFound : styles.badgeLost,
            ]}
          >
            <Text style={styles.badgeText}>
              {item.type === 'found' ? 'ENCONTRADO' : 'PERDIDO'}
            </Text>
          </View>
        </TouchableOpacity>

        {/* Card Photo Area matching mockup: large photo / green background */}
        <TouchableOpacity
          style={styles.cardImageContainer}
          onPress={() => handleCardPress(item)}
          activeOpacity={0.9}
        >
          <Image
            source={{ uri: item.imageUrl }}
            style={styles.cardImage}
            resizeMode="cover"
          />

          {/* Floating Map Jump Pill */}
          <View style={styles.mapJumpPill}>
            <Ionicons name="map" size={14} color="#FFFFFF" style={{ marginRight: 4 }} />
            <Text style={styles.mapJumpText}>Ver en Mapa UTCH 📍</Text>
          </View>
        </TouchableOpacity>

        {/* Post Title & Description Snippet */}
        <TouchableOpacity
          style={styles.cardBody}
          onPress={() => handleCardPress(item)}
          activeOpacity={0.85}
        >
          <Text style={styles.cardTitle}>{item.title}</Text>
          <Text style={styles.cardDesc} numberOfLines={2}>
            {item.description}
          </Text>
        </TouchableOpacity>

        {/* Card Footer matching mockup dark green bar with "Comentarios" */}
        <View style={styles.cardFooter}>
          <TouchableOpacity
            style={styles.commentsBtn}
            onPress={() => handleCardPress(item)}
            activeOpacity={0.7}
          >
            <Ionicons name="chatbubble-outline" size={16} color="#FFFFFF" style={{ marginRight: 6 }} />
            <Text style={styles.commentsBtnText}>
              Comentarios ({item.commentsCount})
            </Text>
          </TouchableOpacity>

          <View style={styles.actionsRight}>
            <TouchableOpacity
              style={styles.actionIconBtn}
              onPress={() => toggleLike(item.id)}
              activeOpacity={0.7}
            >
              <Ionicons
                name={isLiked ? 'heart' : 'heart-outline'}
                size={20}
                color={isLiked ? '#EF4444' : '#FFFFFF'}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionIconBtn}
              onPress={() => toggleSaveItem(item.id)}
              activeOpacity={0.7}
            >
              <Ionicons
                name={isSaved ? 'bookmark' : 'bookmark-outline'}
                size={20}
                color={isSaved ? THEME.colors.bellAccent : '#FFFFFF'}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionIconBtn}
              onPress={() => handleShare(item)}
              activeOpacity={0.7}
            >
              <Ionicons name="share-social-outline" size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Top Header matching Page 3: PerdidosUTCH + Bell Icon */}
      <CustomHeader
        title="PerdidosUTCH"
        showBell={true}
        onBellPress={() => {}}
      />

      {/* Feed Filter Sub-Header */}
      <View style={styles.tabFilters}>
        <TouchableOpacity
          style={[styles.tabBtn, filter === 'all' && styles.tabBtnActive]}
          onPress={() => setFilter('all')}
        >
          <Text style={[styles.tabBtnText, filter === 'all' && styles.tabBtnTextActive]}>
            Todos
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabBtn, filter === 'found' && styles.tabBtnActive]}
          onPress={() => setFilter('found')}
        >
          <Text style={[styles.tabBtnText, filter === 'found' && styles.tabBtnTextActive]}>
            Objetos Encontrados
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabBtn, filter === 'lost' && styles.tabBtnActive]}
          onPress={() => setFilter('lost')}
        >
          <Text style={[styles.tabBtnText, filter === 'lost' && styles.tabBtnTextActive]}>
            Objetos Perdidos
          </Text>
        </TouchableOpacity>
      </View>

      {/* Feed Notice */}
      <View style={styles.feedBanner}>
        <Ionicons name="sparkles" size={16} color={THEME.colors.primaryDark} style={{ marginRight: 6 }} />
        <Text style={styles.feedBannerText}>
          Toca cualquier publicación para ver su ubicación exacta en el mapa de la UTCH.
        </Text>
      </View>

      {/* Social Feed List */}
      <FlatList
        data={filteredItems}
        keyExtractor={(item) => item.id}
        renderItem={renderPost}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={THEME.colors.primaryDark}
            colors={[THEME.colors.primaryDark]}
          />
        }
        showsVerticalScrollIndicator={false}
      />

      {/* Floating Action Button to Publish */}
      <TouchableOpacity
        style={styles.fabBtn}
        onPress={() => setPublishVisible(true)}
        activeOpacity={0.85}
      >
        <Ionicons name="add" size={28} color="#FFFFFF" />
      </TouchableOpacity>

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
    backgroundColor: '#F1F5F0',
  },
  tabFilters: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    paddingHorizontal: 8,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 2.5,
    borderBottomColor: 'transparent',
  },
  tabBtnActive: {
    borderBottomColor: THEME.colors.primaryDark,
  },
  tabBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
  },
  tabBtnTextActive: {
    color: THEME.colors.primaryDark,
    fontWeight: '700',
  },
  feedBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#C8E6C9',
  },
  feedBannerText: {
    fontSize: 12,
    color: THEME.colors.primaryDark,
    fontWeight: '600',
    flex: 1,
  },
  listContent: {
    padding: 16,
    paddingBottom: 80,
  },
  cardContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  cardHeader: {
    backgroundColor: THEME.colors.feedCardHeader,
    paddingHorizontal: 14,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 8,
  },
  authorAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.25)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  authorName: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  postMeta: {
    color: 'rgba(255,255,255,0.78)',
    fontSize: 10,
    fontWeight: '500',
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  badgeFound: {
    backgroundColor: THEME.colors.primaryLight,
  },
  badgeLost: {
    backgroundColor: '#E11D48',
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 0.4,
  },
  cardImageContainer: {
    width: '100%',
    height: 220,
    backgroundColor: THEME.colors.feedImageBg,
    position: 'relative',
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  mapJumpPill: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    backgroundColor: 'rgba(13, 82, 44, 0.92)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  mapJumpText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  cardBody: {
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: THEME.colors.textMain,
    marginBottom: 4,
  },
  cardDesc: {
    fontSize: 13,
    color: '#475569',
    lineHeight: 18,
  },
  cardFooter: {
    backgroundColor: THEME.colors.feedCardFooter,
    paddingHorizontal: 14,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  commentsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  commentsBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },
  actionsRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  actionIconBtn: {
    padding: 4,
  },
  fabBtn: {
    position: 'absolute',
    bottom: 24,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: THEME.colors.primaryDark,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 6,
  },
});
