import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Image,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { ItemType } from '../types';
import { THEME } from '../constants/theme';
import { isInsideCampus, UTCH_CAMPUS_POINTS } from '../constants/campusLocations';
import { useLostItems } from '../context/LostItemsContext';
import { ref, getDownloadURL, uploadBytes } from 'firebase/storage';
import { storage } from '../config/fireBaseConfig';

interface PublishModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}



export const PublishModal: React.FC<PublishModalProps> = ({
                                                            visible,
                                                            onClose,
                                                            onSuccess,
                                                          }) => {
  const { addItem, user, userId } = useLostItems();

  const [type, setType] = useState<ItemType>('found');
  const [title, setTitle] = useState('');
  const [selectedLocation, setSelectedLocation] = useState(UTCH_CAMPUS_POINTS[0]);
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [phone, setPhone] = useState(user.phone || '');

  useEffect(() => {
    if (visible) void Location.requestForegroundPermissionsAsync();
  }, [visible]);

  const getGpsPosition = async () => {
    const { granted } = await Location.requestForegroundPermissionsAsync();
    if (!granted) {
      throw new Error('Se requiere el permiso de ubicación para usar la ubicación exacta.');
    }
    const { coords } = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.High,
    });
    if (!isInsideCampus(coords.latitude, coords.longitude)) {
      throw new Error('Tu ubicación está fuera de la UTCH. Elige un edificio de la lista.');
    }
    return { latitude: coords.latitude, longitude: coords.longitude };
  };

  const handlePickImage = async (source: 'camera' | 'library') => {
    try {
      const permissionResult =
          source === 'camera'
              ? await ImagePicker.requestCameraPermissionsAsync()
              : await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permissionResult.granted) {
        Alert.alert(
            'Permiso necesario',
            source === 'camera'
                ? 'Se requiere permiso para usar la cámara y tomar la foto del objeto.'
                : 'Se requiere permiso para acceder a tus fotos y adjuntar la imagen del objeto.'
        );
        return;
      }

      const options: ImagePicker.ImagePickerOptions = {
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
        base64: true,
      };
      const result =
          source === 'camera'
              ? await ImagePicker.launchCameraAsync(options)
              : await ImagePicker.launchImageLibraryAsync(options);

      if (!result.canceled && result.assets[0]?.uri) {
        const selectedImage = result.assets[0];
        if (!selectedImage.base64) {
          Alert.alert(
              'No se pudo preparar la imagen',
              'Selecciona otra imagen o utiliza una de las imágenes de muestra.'
          );
          return;
        }
        setImageUrl(selectedImage.uri);
        setImageBase64(selectedImage.base64);
      }
    } catch (e) {
      console.warn('Error picking image', e);
    }
  };

  const [isPublishing, setIsPublishing] = useState(false);

  const handlePublish = async () => {
    if (!title.trim()) {
      Alert.alert('Falta información', 'Por favor ingresa el nombre o título del objeto.');
      return;
    }
    if (!description.trim()) {
      Alert.alert('Falta información', 'Por favor describe dónde y cómo encontraste/perdiste el objeto.');
      return;
    }
    if (!imageUrl) {
      Alert.alert('Falta información', 'Por favor agrega una foto del objeto.');
      return;
    }

    setIsPublishing(true);
    try {
      const position =
          selectedLocation.id === 'gps'
              ? await getGpsPosition()
              : { latitude: selectedLocation.latitude, longitude: selectedLocation.longitude };
      let publishedImageUrl = imageUrl;
      if (imageBase64) {
        // 1. Crear el formulario con el base64 de la imagen
        const formData = new FormData();
        formData.append('image', imageBase64);

        // 2. Subir a ImgBB (Reemplaza TU_API_KEY por la clave que copiaste)
        const imgbbResponse = await fetch('https://api.imgbb.com/1/upload?key=129cb4133e99b2ac39fe2dca93c2ba3e', {
          method: 'POST',
          body: formData,
          headers: {
            Accept: 'application/json',
          },
        });

        const imgbbData = await imgbbResponse.json();

        // 3. Obtener el enlace público devuelto por ImgBB
        if (imgbbData.success) {
          publishedImageUrl = imgbbData.data.url;
        } else {
          throw new Error('Error al subir la imagen al servidor externo.');
        }
      }

      await addItem({
        title: title.trim(),
        type,
        locationName: selectedLocation.name,
        position,
        description: description.trim(),
        imageUrl: publishedImageUrl,
        author: {
          name: user.name || 'Estudiante UTCH',
          career: user.career,
          studentId: user.studentId,
          phone: phone || user.phone,
        },
      });

      setTitle('');
      setDescription('');
      setImageBase64(null);
      setImageUrl(null);
      Alert.alert(
          '¡Publicación Exitosa!',
          'Tu publicación ha sido añadida al feed.'
      );

      if (onSuccess) onSuccess();
      onClose();
    } catch (error) {
      Alert.alert(
          'No se pudo publicar',
          error instanceof Error ? error.message : 'Intenta de nuevo más tarde.'
      );
    } finally {
      setIsPublishing(false);
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
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.headerTitle}>Publicar Objeto</Text>
              <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                <Ionicons name="close" size={24} color="#FFFFFF" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.scrollBody} showsVerticalScrollIndicator={false}>
              {/* Toggle: Lo encontré / Lo perdí */}
              <Text style={styles.label}>¿Qué deseas reportar?</Text>
              <View style={styles.toggleRow}>
                <TouchableOpacity
                    style={[
                      styles.toggleBtn,
                      type === 'found' && styles.toggleBtnActiveFound,
                    ]}
                    onPress={() => setType('found')}
                    activeOpacity={0.8}
                >
                  <Ionicons
                      name="shield-checkmark"
                      size={18}
                      color={type === 'found' ? '#FFFFFF' : '#475569'}
                      style={{ marginRight: 6 }}
                  />
                  <Text
                      style={[
                        styles.toggleBtnText,
                        type === 'found' && styles.toggleBtnTextActive,
                      ]}
                  >
                    Lo encontré
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[
                      styles.toggleBtn,
                      type === 'lost' && styles.toggleBtnActiveLost,
                    ]}
                    onPress={() => setType('lost')}
                    activeOpacity={0.8}
                >
                  <Ionicons
                      name="help-circle"
                      size={18}
                      color={type === 'lost' ? '#FFFFFF' : '#475569'}
                      style={{ marginRight: 6 }}
                  />
                  <Text
                      style={[
                        styles.toggleBtnText,
                        type === 'lost' && styles.toggleBtnTextActive,
                      ]}
                  >
                    Lo perdí
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Photo Section */}
              <Text style={styles.label}>Foto del Objeto *</Text>
              <View style={styles.photoContainer}>
                {imageUrl ? (
                    <Image source={{ uri: imageUrl }} style={styles.photoPreview} resizeMode="cover" />
                ) : (
                    <View style={styles.photoEmpty}>
                      <Ionicons name="image-outline" size={40} color="#94A3B8" />
                    </View>
                )}
                <View style={styles.photoActions}>
                  <TouchableOpacity style={styles.changePhotoBtn} onPress={() => handlePickImage('camera')} activeOpacity={0.8}>
                    <Ionicons name="camera" size={18} color="#FFFFFF" style={{ marginRight: 6 }} />
                    <Text style={styles.changePhotoText}>Tomar foto</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.changePhotoBtn} onPress={() => handlePickImage('library')} activeOpacity={0.8}>
                    <Ionicons name="images" size={18} color="#FFFFFF" style={{ marginRight: 6 }} />
                    <Text style={styles.changePhotoText}>Galería</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Object Title */}
              <Text style={styles.label}>Título del Objeto</Text>
              <TextInput
                  style={styles.textInput}
                  placeholder="Ej. Mochila negra Nike, Credencial..."
                  placeholderTextColor="#94A3B8"
                  value={title}
                  onChangeText={setTitle}
              />

              {/* UTCH Location */}
              <Text style={styles.label}>Ubicación en UTCH</Text>
              <Text style={styles.sublabel}>Selecciona el edificio donde se encuentra o extravió:</Text>
              <View style={styles.locationsGrid}>
                {UTCH_CAMPUS_POINTS.map((loc) => {
                  const isSelected = selectedLocation.id === loc.id;
                  return (
                      <TouchableOpacity
                          key={loc.id}
                          style={[
                            styles.locationCard,
                            isSelected && styles.locationCardActive,
                          ]}
                          onPress={() => setSelectedLocation(loc)}
                          activeOpacity={0.8}
                      >
                        <Ionicons
                            name={isSelected ? 'location' : 'location-outline'}
                            size={18}
                            color={isSelected ? '#FFFFFF' : THEME.colors.primaryDark}
                            style={{ marginRight: 6 }}
                        />
                        <Text
                            style={[
                              styles.locationName,
                              isSelected && styles.locationNameActive,
                            ]}
                            numberOfLines={1}
                        >
                          {loc.name}
                        </Text>
                      </TouchableOpacity>
                  );
                })}
              </View>

              {/* Description */}
              <Text style={styles.label}>Descripción Detallada *</Text>
              <TextInput
                  style={[styles.textInput, styles.textArea]}
                  placeholder="Indica el aula, características particulares, color, marcas, dónde reclamar..."
                  placeholderTextColor="#94A3B8"
                  value={description}
                  onChangeText={setDescription}
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
              />

              {/* Contact Phone */}
              <Text style={styles.label}>Teléfono de Contacto (WhatsApp)</Text>
              <TextInput
                  style={styles.textInput}
                  placeholder="Ej. 614 123 4567"
                  placeholderTextColor="#94A3B8"
                  value={phone}
                  onChangeText={setPhone}
                  keyboardType="phone-pad"
              />

              {/* Submit Button */}
              <TouchableOpacity
                  style={styles.submitBtn}
                  onPress={handlePublish}
                  disabled={isPublishing}
                  activeOpacity={0.85}
              >
                <Ionicons name="cloud-upload" size={20} color="#FFFFFF" style={{ marginRight: 8 }} />
                <Text style={styles.submitBtnText}>
                  {isPublishing ? 'Publicando...' : 'Publicar en PerdidosUTCH'}
                </Text>
              </TouchableOpacity>

              <View style={{ height: 40 }} />
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
    maxHeight: '92%',
    overflow: 'hidden',
  },
  header: {
    backgroundColor: THEME.colors.primaryDark,
    paddingHorizontal: 20,
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  closeBtn: {
    padding: 4,
  },
  scrollBody: {
    padding: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    color: THEME.colors.textMain,
    marginTop: 14,
    marginBottom: 6,
  },
  sublabel: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 8,
  },
  toggleRow: {
    flexDirection: 'row',
    gap: 12,
  },
  toggleBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    backgroundColor: '#F8FAF8',
  },
  toggleBtnActiveFound: {
    backgroundColor: THEME.colors.primaryDark,
    borderColor: THEME.colors.primaryDark,
  },
  toggleBtnActiveLost: {
    backgroundColor: '#E11D48',
    borderColor: '#E11D48',
  },
  toggleBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#475569',
  },
  toggleBtnTextActive: {
    color: '#FFFFFF',
  },
  photoContainer: {
    height: 170,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#E2E8F0',
  },
  photoPreview: {
    width: '100%',
    height: '100%',
  },
  photoEmpty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  photoActions: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    flexDirection: 'row',
    gap: 8,
  },
  changePhotoBtn: {
    backgroundColor: 'rgba(13, 82, 44, 0.88)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  changePhotoText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  textInput: {
    backgroundColor: '#F8FAF8',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
    color: '#1E293B',
  },
  textArea: {
    height: 90,
  },
  chipsScroll: {
    marginVertical: 4,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: '#F1F5F9',
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  chipActive: {
    backgroundColor: THEME.colors.primaryDark,
    borderColor: THEME.colors.primaryDark,
  },
  chipText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#475569',
  },
  chipTextActive: {
    color: '#FFFFFF',
  },
  locationsGrid: {
    gap: 8,
  },
  locationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#F8FAF8',
  },
  locationCardActive: {
    backgroundColor: THEME.colors.primaryDark,
    borderColor: THEME.colors.primaryDark,
  },
  locationName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#334155',
    flex: 1,
  },
  locationNameActive: {
    color: '#FFFFFF',
  },
  submitBtn: {
    backgroundColor: THEME.colors.primaryLight,
    paddingVertical: 14,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 22,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 4,
  },
  submitBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
