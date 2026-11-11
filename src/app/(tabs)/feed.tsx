import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  FlatList,
  Image,
  RefreshControl,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { CustomHeader } from "../../components/CustomHeader";
import { PublishModal } from "../../components/PublishModal";
import { THEME } from "../../constants/theme";
import { useLostItems } from "../../context/LostItemsContext";
import { LostItem } from "../../types";

export default function FeedScreen() {
  const router = useRouter();
  const { items, setSelectedItemId } = useLostItems();

  const [refreshing, setRefreshing] = useState(false);
  const [publishVisible, setPublishVisible] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 500);
  };

  const handleCardPress = (item: LostItem) => {
    setSelectedItemId(item.id);
    router.push("/(tabs)/map");
  };

  const handleShare = async (item: LostItem) => {
    try {
      await Share.share({
        message: `Objeto ${item.type === "found" ? "encontrado" : "perdido"}: ${item.title} (${item.locationName}). Búscalo en PerdidosUTCH.`,
      });
    } catch {
      // ignore
    }
  };

  const renderPost = ({ item }: { item: LostItem }) => {

    return (
      <View style={styles.cardContainer}>
        {/* Head tarjeta */}
        <TouchableOpacity
          style={styles.cardHeader}
          onPress={() => handleCardPress(item)}
          activeOpacity={0.85}
        >
          <View style={styles.headerLeft}>
            <View style={styles.authorAvatar}>
              <Ionicons name="person" size={14} color="#FFFFFF" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.authorName} numberOfLines={1}>
                {item.author.name}
              </Text>
              <Text style={styles.postMeta}>
                {item.locationName} • {item.date}
              </Text>
            </View>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.cardImageContainer}
          onPress={() => handleCardPress(item)}
          activeOpacity={0.9}
        >
          <Image
            source={{uri: item.imageUrl}}
            style={styles.cardImage}
            resizeMode="cover"
          />

        </TouchableOpacity>

        {/* Body Publicación */}
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

        <View style={styles.cardFooter}>
          <TouchableOpacity
            style={styles.commentsBtn}
            onPress={() => handleCardPress(item)}
            activeOpacity={0.7}
          >
            <Ionicons
              name="chatbubble-outline"
              size={16}
              color="#FFFFFF"
              style={{ marginRight: 6 }}
            />
            <Text style={styles.commentsBtnText}>
              Comentarios ({item.commentsCount})
            </Text>
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
    );
  };

  return (
    <View style={styles.container}>
      <CustomHeader
        title="PerdidosUTCH"
        showBell={true}
        onBellPress={() => {}}
      />

      {/* Publicaciones */}
      <FlatList
        data={items}
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

      {/* Botón para publicar */}
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
    backgroundColor: "#F1F5F0",
  },
  feedBanner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E8F5E9",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#C8E6C9",
  },
  feedBannerText: {
    fontSize: 12,
    color: THEME.colors.primaryDark,
    fontWeight: "600",
    flex: 1,
  },
  listContent: {
    padding: 16,
    paddingBottom: 80,
  },
  cardContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    marginBottom: 20,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  cardHeader: {
    backgroundColor: THEME.colors.feedCardHeader,
    paddingHorizontal: 14,
    paddingVertical: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginRight: 8,
  },
  authorAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.25)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  authorName: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "700",
  },
  postMeta: {
    color: "rgba(255,255,255,0.78)",
    fontSize: 10,
    fontWeight: "500",
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
    backgroundColor: "#E11D48",
  },
  badgeText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "bold",
    letterSpacing: 0.4,
  },
  cardImageContainer: {
    width: "100%",
    height: 220,
    backgroundColor: THEME.colors.feedImageBg,
    position: "relative",
  },
  cardImage: {
    width: "100%",
    height: "100%",
  },
  cardBody: {
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: "#FFFFFF",
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: THEME.colors.textMain,
    marginBottom: 4,
  },
  cardDesc: {
    fontSize: 13,
    color: "#475569",
    lineHeight: 18,
  },
  cardFooter: {
    backgroundColor: THEME.colors.feedCardFooter,
    paddingHorizontal: 14,
    paddingVertical: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  commentsBtn: {
    flexDirection: "row",
    alignItems: "center",
  },
  commentsBtnText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "600",
  },
  actionIconBtn: {
    padding: 4,
  },
  fabBtn: {
    position: "absolute",
    bottom: 24,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: THEME.colors.primaryDark,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 6,
  },
});
