import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Image,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Linking,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LostItem } from '../types';
import { THEME } from '../constants/theme';
import { useLostItems } from '../context/LostItemsContext';

interface ItemDetailModalProps {
  item: LostItem | null;
  visible: boolean;
  onClose: () => void;
}

export const ItemDetailModal: React.FC<ItemDetailModalProps> = ({
                                                                  item,
                                                                  visible,
                                                                  onClose,
                                                                }) => {
  const { addComment, markAsResolved, deletePost, userId, savedItemIds, toggleSaveItem } =
      useLostItems();
  const [commentText, setCommentText] = useState('');
  const [isSendingComment, setIsSendingComment] = useState(false);

  if (!item) return null;

  const isSaved = savedItemIds.includes(item.id);
  const isOwner = Boolean(userId && item.authorId === userId);

  const handleSendComment = async () => {
    if (!commentText.trim()) return;
    setIsSendingComment(true);
    try {
      await addComment(item.id, commentText);
      setCommentText('');
    } catch (error) {
      Alert.alert(
          'No se pudo guardar el comentario',
          error instanceof Error ? error.message : 'Intenta de nuevo más tarde.'
      );
    } finally {
      setIsSendingComment(false);
    }
  };

  const handleMarkAsResolved = async () => {
    try {
      await markAsResolved(item.id);
    } catch (error) {
      Alert.alert(
          'No se pudo actualizar la publicación',
          error instanceof Error ? error.message : 'Intenta de nuevo más tarde.'
      );
    }
  };

  const handleDeletePost = () => {
    Alert.alert(
        'Eliminar publicación',
        '¿Seguro que quieres eliminar esta publicación? Esta acción no se puede deshacer.',
        [
          { text: 'Cancelar', style: 'cancel' },
          {
            text: 'Eliminar',
            style: 'destructive',
            onPress: async () => {
              try {
                await deletePost(item.id);
                onClose();
              } catch (error) {
                Alert.alert(
                    'No se pudo eliminar la publicación',
                    error instanceof Error ? error.message : 'Intenta de nuevo más tarde.'
                );
              }
            },
          },
        ]
    );
  };

  const handleContact = () => {
    if (item.author.phone) {
      const cleanPhone = item.author.phone.replace(/\s+/g, '');
      const whatsappUrl = `https://wa.me/52${cleanPhone}?text=Hola,%20vi%20tu%20publicación%20en%20PerdidosUTCH%20sobre:%20${encodeURIComponent(item.title)}`;
      Linking.openURL(whatsappUrl).catch(() => {
        Alert.alert('Contacto', `Comunícate al teléfono: ${item.author.phone}`);
      });
    } else {
      Alert.alert('Contacto', `Pasa a las oficinas de ${item.locationName} para reclamar tu objeto.`);
    }
  };

  return (
      <Modal
          visible={visible}
          animationType="slide"
          transparent={true}
          onRequestClose={onClose}
      >
        <View style={styles.backdrop}>
          <View style={styles.sheetContainer}>
            {/* Header Bar */}
            <View style={styles.sheetHeader}>
              <View style={styles.headerLeft}>
                <View
                    style={[
                      styles.typePill,
                      item.type === 'found' ? styles.typeFound : styles.typeLost,
                    ]}
                >
                  <Text style={styles.typeText}>
                    {item.type === 'found' ? 'ENCONTRADO' : 'PERDIDO'}
                  </Text>
                </View>
                <Text style={styles.categoryText}>{item.category}</Text>
              </View>
              <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                <Ionicons name="close" size={24} color="#FFFFFF" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.contentScroll} showsVerticalScrollIndicator={false}>
              {/* Object Image */}
              <View style={styles.imageContainer}>
                <Image
                    source={{ uri: item.imageUrl }}
                    style={styles.image}
                    resizeMode="cover"
                />
                <TouchableOpacity
                    style={styles.saveFloatingBtn}
                    onPress={() => toggleSaveItem(item.id)}
                    activeOpacity={0.8}
                >
                  <Ionicons
                      name={isSaved ? 'bookmark' : 'bookmark-outline'}
                      size={20}
                      color={isSaved ? THEME.colors.primaryDark : '#475569'}
                  />
                </TouchableOpacity>
              </View>

              {/* Title & Location */}
              <View style={styles.bodySection}>
                <Text style={styles.title}>{item.title}</Text>

                <View style={styles.locationRow}>
                  <Ionicons name="location" size={18} color={THEME.colors.primaryDark} />
                  <Text style={styles.locationText}>{item.locationName}</Text>
                </View>

                <View style={styles.dateRow}>
                  <Ionicons name="time-outline" size={15} color="#64748B" />
                  <Text style={styles.dateText}>Publicado: {item.date}</Text>
                </View>

                {/* Description Box */}
                <View style={styles.descCard}>
                  <Text style={styles.sectionHeader}>Descripción</Text>
                  <Text style={styles.descriptionText}>{item.description}</Text>
                </View>

                {/* Reporter Profile */}
                <View style={styles.reporterCard}>
                  <View style={styles.reporterAvatar}>
                    <Ionicons name="person" size={20} color={THEME.colors.primaryDark} />
                  </View>
                  <View style={styles.reporterInfo}>
                    <Text style={styles.reporterName}>{item.author.name}</Text>
                    <Text style={styles.reporterCareer}>
                      {item.author.career || 'Estudiante UTCH'} • Mat. {item.author.studentId || 'Activo'}
                    </Text>
                  </View>
                </View>

                {/* Action Buttons */}
                <View style={styles.actionRow}>
                  <TouchableOpacity
                      style={styles.contactBtn}
                      onPress={handleContact}
                      activeOpacity={0.8}
                  >
                    <Ionicons name="chatbubbles" size={18} color="#FFFFFF" style={{ marginRight: 6 }} />
                    <Text style={styles.contactBtnText}>Contactar</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                      style={[styles.resolveBtn, item.isResolved && styles.resolveBtnDone]}
                      onPress={() => void handleMarkAsResolved()}
                      activeOpacity={0.8}
                  >
                    <Ionicons
                        name={item.isResolved ? 'checkmark-circle' : 'checkmark-circle-outline'}
                        size={20}
                        color={item.isResolved ? '#FFFFFF' : THEME.colors.primaryDark}
                    />
                    <Text
                        style={[
                          styles.resolveBtnText,
                          item.isResolved && styles.resolveBtnTextDone,
                        ]}
                    >
                      {item.isResolved ? 'Recuperado' : 'Marcar'}
                    </Text>
                  </TouchableOpacity>
                </View>

                {/* Comments Section */}
                <View style={styles.commentsSection}>
                  <Text style={styles.sectionHeader}>Comentarios ({item.commentsCount})</Text>

                  {item.comments.length === 0 ? (
                      <Text style={styles.emptyComments}>
                        Aún no hay comentarios. Si reconoces este objeto, habla con el estudiante.
                      </Text>
                  ) : (
                      item.comments.map((c) => (
                          <View key={c.id} style={styles.commentItem}>
                            <View style={styles.commentHeader}>
                              <Text style={styles.commentAuthor}>{c.author}</Text>
                              <Text style={styles.commentTime}>{c.time}</Text>
                            </View>
                            <Text style={styles.commentText}>{c.text}</Text>
                          </View>
                      ))
                  )}

                  {/* Add Comment Input */}
                  <View style={styles.inputRow}>
                    <TextInput
                        style={styles.input}
                        placeholder="Escribe un comentario..."
                        placeholderTextColor="#94A3B8"
                        value={commentText}
                        onChangeText={setCommentText}
                    />
                    <TouchableOpacity
                        style={styles.sendBtn}
                        onPress={() => void handleSendComment()}
                        disabled={isSendingComment}
                        activeOpacity={0.7}
                    >
                      <Ionicons name="send" size={16} color="#FFFFFF" />
                    </TouchableOpacity>
                  </View>
                </View>

                {isOwner && (
                    <TouchableOpacity
                        style={styles.deletePostBtn}
                        onPress={handleDeletePost}
                        activeOpacity={0.8}
                    >
                      <Ionicons name="trash-outline" size={18} color="#E11D48" />
                      <Text style={styles.deletePostBtnText}>Eliminar publicación</Text>
                    </TouchableOpacity>
                )}
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  sheetContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '88%',
    overflow: 'hidden',
  },
  sheetHeader: {
    backgroundColor: THEME.colors.primaryDark,
    paddingHorizontal: 18,
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  typePill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    marginRight: 10,
  },
  typeFound: {
    backgroundColor: THEME.colors.primaryLight,
  },
  typeLost: {
    backgroundColor: '#E11D48',
  },
  typeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  categoryText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
    opacity: 0.9,
  },
  closeBtn: {
    padding: 4,
  },
  contentScroll: {
    backgroundColor: '#FFFFFF',
  },
  imageContainer: {
    width: '100%',
    height: 230,
    position: 'relative',
    backgroundColor: '#E2E8F0',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  saveFloatingBtn: {
    position: 'absolute',
    top: 14,
    right: 14,
    backgroundColor: '#FFFFFF',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
  },
  bodySection: {
    padding: 18,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: THEME.colors.textMain,
    marginBottom: 8,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  locationText: {
    fontSize: 14,
    fontWeight: '600',
    color: THEME.colors.primaryDark,
    marginLeft: 4,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  dateText: {
    fontSize: 12,
    color: '#64748B',
    marginLeft: 4,
  },
  descCard: {
    backgroundColor: '#F8FAF8',
    padding: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 14,
  },
  sectionHeader: {
    fontSize: 14,
    fontWeight: '700',
    color: THEME.colors.primaryDark,
    marginBottom: 6,
  },
  descriptionText: {
    fontSize: 14,
    lineHeight: 20,
    color: '#334155',
  },
  reporterCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    padding: 12,
    borderRadius: 10,
    marginBottom: 16,
  },
  reporterAvatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#E2E8F0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  reporterInfo: {
    flex: 1,
  },
  reporterName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E293B',
  },
  reporterCareer: {
    fontSize: 11,
    color: '#64748B',
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 20,
  },
  contactBtn: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: THEME.colors.primaryDark,
    paddingVertical: 12,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contactBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
  resolveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: THEME.colors.primaryDark,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
  },
  resolveBtnDone: {
    backgroundColor: THEME.colors.primaryDark,
  },
  resolveBtnText: {
    color: THEME.colors.primaryDark,
    fontWeight: '600',
    fontSize: 13,
    marginLeft: 4,
  },
  resolveBtnTextDone: {
    color: '#FFFFFF',
  },
  deletePostBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#E11D48',
    paddingVertical: 12,
    borderRadius: 10,
    marginBottom: 24,
  },
  deletePostBtnText: {
    color: '#E11D48',
    fontWeight: '700',
    fontSize: 14,
    marginLeft: 6,
  },
  commentsSection: {
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    paddingTop: 16,
    paddingBottom: 24,
  },
  emptyComments: {
    fontSize: 13,
    color: '#94A3B8',
    fontStyle: 'italic',
    marginVertical: 10,
  },
  commentItem: {
    backgroundColor: '#F8FAF8',
    padding: 10,
    borderRadius: 8,
    marginBottom: 8,
    borderLeftWidth: 3,
    borderLeftColor: THEME.colors.primaryLight,
  },
  commentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 3,
  },
  commentAuthor: {
    fontSize: 12,
    fontWeight: '700',
    color: THEME.colors.primaryDark,
  },
  commentTime: {
    fontSize: 11,
    color: '#94A3B8',
  },
  commentText: {
    fontSize: 13,
    color: '#334155',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    gap: 8,
  },
  input: {
    flex: 1,
    backgroundColor: '#F1F5F9',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 9,
    fontSize: 13,
    color: '#1E293B',
  },
  sendBtn: {
    backgroundColor: THEME.colors.primaryDark,
    width: 38,
    height: 38,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
