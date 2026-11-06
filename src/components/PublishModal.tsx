import React, { useState, useRef } from 'react';
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
import { UTCH_CAMPUS_POINTS } from '../constants/campusLocations';
import { useLostItems } from '../context/LostItemsContext';

interface PublishModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

async function requestAllPermissions(): Promise<string> {
  // Request location permission
  const locationResult = await Location.requestForegroundPermissionsAsync();
  let coords = '';
  if (locationResult.status === 'granted') {
    try {
      const loc = await Location.getCurrentPositionAsync({});
      coords = `Lat: ${loc.coords.latitude.toFixed(4)}, Lon: ${loc.coords.longitude.toFixed(4)}`;
    } catch {
      // Silently fail if location not available
    }
  } else {
    Alert.alert(
      'Permiso de ubicación',
      'Se requiere acceso a tu ubicación para registrar dónde se encontró/perdió el objeto.'
    );
  }

  // Request camera permission
  const cameraResult = await ImagePicker.requestCameraPermissionsAsync();
  if (cameraResult.status !== 'granted') {
    Alert.alert(
      'Permiso de cámara',
      'Se requiere acceso a la cámara para tomar foto del objeto.'
    );
  }

  // Request gallery permission
  const galleryResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (galleryResult.status !== 'granted') {
    Alert.alert(
      'Permiso de galería',
      'Se requiere acceso a tus fotos para adjuntar la imagen del objeto.'
    );
  }

  return coords;
}

export const PublishModal: React.FC<PublishModalProps> = ({
  visible,
  onClose,
  onSuccess,
}) => {
  const { addItem, user } = useLostItems();

  const [type, setType] = useState<ItemType>('found');
  const [title, setTitle] = useState('');
  const [selectedLocation, setSelectedLocation] = useState(UTCH_CAMPUS_POINTS[0]);
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [phone, setPhone] = useState(user.phone || '');
  const [locationText, setLocationText] = useState('');
  const permissionsRequestedRef = useRef(false);

  // Request permissions when modal becomes visible
  React.useEffect(() => {
    if (!visible || permissionsRequestedRef.current) return;
    permissionsRequestedRef.current = true;

    let cancelled = false;
    requestAllPermissions().then((coords) => {
      if (!cancelled && coords) {
        setLocationText(coords);
      }
    });
    return () => { cancelled = true; };
  }, [visible]);

  const handleTakePhoto = async () => {
    try {
      const cameraPermission = await ImagePicker.requestCameraPermissionsAsync();
      if (!cameraPermission.granted) {
        Alert.alert(
          'Permiso necesario',
          'Se requiere permiso para acceder a la cámara y tomar foto del objeto.'
        );
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]?.uri) {
        setImageUrl(result.assets[0].uri);
      }
    } catch (e) {
      console.warn('Error taking photo', e);
    }
  };

  const handlePickImage = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permissionResult.granted) {
        Alert.alert(
          'Permiso necesario',
          'Se requiere permiso para acceder a tus fotos y adjuntar la imagen del objeto.'
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]?.uri) {
        setImageUrl(result.assets[0].uri);
      }
    } catch (e) {
      console.warn('Error picking image', e);
    }
  };

  const handlePublish = () => {
    if (!title.trim()) {
      Alert.alert('Falta información', 'Por favor ingresa el nombre o título del objeto.');
      return;
    }
    if (!description.trim()) {
      Alert.alert('Falta información', 'Por favor describe dónde y cómo encontraste/perdiste el objeto.');
      return;
    }

    addItem({
      title: title.trim(),
      type,
      category: 'General',
      locationName: selectedLocation.name,
      coords: {
        x: selectedLocation.x,
        y: selectedLocation.y,
      },
      description: description.trim(),
      imageUrl: imageUrl || 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=700&q=80',
      author: {
        name: user.name || 'Estudiante UTCH',
        career: user.career,
        studentId: user.studentId,
        phone: phone || user.phone,
      },
    });

    // Reset fields
    setTitle('');
    setDescription('');
    setImageUrl('');
    Alert.alert(
      '¡Publicación Exitosa!',
      `Tu publicación ha sido añadida al feed y ubicada en el mapa en "${selectedLocation.name}".`
    );

    if (onSuccess) onSuccess();
    onClose();
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
            <Text style={styles.headerTitle}>Publicar Objeto en UTCH</Text>
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
            <Text style={styles.label}>Foto del Objeto</Text>
            <View style={styles.photoContainer}>
              {imageUrl ? (
                <Image source={{ uri: imageUrl }} style={styles.photoPreview} resizeMode="cover" />
              ) : (
                <View style={styles.photoPlaceholder}>
                  <Ionicons name="image-outline" size={48} color="#94A3B8" />
                  <Text style={styles.photoPlaceholderText}>Sin foto seleccionada</Text>
                </View>
              )}
            </View>
            <View style={styles.photoActions}>
              <TouchableOpacity style={styles.photoActionBtn} onPress={handleTakePhoto} activeOpacity={0.8}>
                <Ionicons name="camera" size={20} color="#FFFFFF" style={{ marginRight: 6 }} />
                <Text style={styles.photoActionText}>Tomar Foto</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.photoActionBtn} onPress={handlePickImage} activeOpacity={0.8}>
                <Ionicons name="images" size={20} color="#FFFFFF" style={{ marginRight: 6 }} />
                <Text style={styles.photoActionText}>Galería</Text>
              </TouchableOpacity>
            </View>

            {/* Object Title */}
            <Text style={styles.label}>Título del Objeto *</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Ej. Mochila negra Nike, Credencial Alan..."
              placeholderTextColor="#94A3B8"
              value={title}
              onChangeText={setTitle}
            />

            {/* UTCH Campus Location */}
            <Text style={styles.label}>Ubicación en Campus UTCH *</Text>
            <Text style={styles.sublabel}>Selecciona el edificio donde se encuentra o extravió:</Text>
            {locationText ? (
              <View style={styles.locationInfo}>
                <Ionicons name="navigate" size={14} color={THEME.colors.primaryDark} style={{ marginRight: 6 }} />
                <Text style={styles.locationInfoText}>{locationText}</Text>
              </View>
            ) : null}
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
              activeOpacity={0.85}
            >
              <Ionicons name="cloud-upload" size={20} color="#FFFFFF" style={{ marginRight: 8 }} />
              <Text style={styles.submitBtnText}>Publicar en PerdidosUTCH</Text>
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
  photoPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  photoPlaceholderText: {
    color: '#94A3B8',
    fontSize: 13,
    marginTop: 8,
  },
  photoActions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 10,
  },
  photoActionBtn: {
    flex: 1,
    backgroundColor: 'rgba(13, 82, 44, 0.88)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
  },
  photoActionText: {
    color: '#FFFFFF',
    fontSize: 13,
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
  locationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginBottom: 8,
  },
  locationInfoText: {
    fontSize: 12,
    color: THEME.colors.primaryDark,
    fontWeight: '600',
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
