import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Linking,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { CustomHeader } from "../../components/CustomHeader";
import { THEME } from "../../constants/theme";
import { useLostItems } from "../../context/LostItemsContext";

export default function SettingsScreen() {
  const router = useRouter();
  const { user, updateUser, logout, items, savedItemIds, setSelectedItemId } =
    useLostItems();

  const [profileModalVisible, setProfileModalVisible] = useState(false);
  const [savedModalVisible, setSavedModalVisible] = useState(false);
  const [privacyModalVisible, setPrivacyModalVisible] = useState(false);
  const [supportModalVisible, setSupportModalVisible] = useState(false);

  const [editName, setEditName] = useState(user.name);
  const [editCareer, setEditCareer] = useState(user.career);
  const [editStudentId, setEditStudentId] = useState(user.studentId);
  const [editPhone, setEditPhone] = useState(user.phone);

  const handleSaveProfile = () => {
    updateUser({
      name: editName.trim(),
      career: editCareer.trim(),
      studentId: editStudentId.trim(),
      phone: editPhone.trim(),
    });
    setProfileModalVisible(false);
    Alert.alert(
      "Perfil Actualizado",
      "Tus datos de estudiante han sido guardados.",
    );
  };

  const handleLogout = () => {
    Alert.alert(
      "Cerrar sesión",
      "¿Estás seguro de que deseas salir de tu cuenta?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Cerrar sesión",
          style: "destructive",
          onPress: () => {
            logout();
            router.replace("/");
          },
        },
      ],
    );
  };

  const savedItems = items.filter((item) => savedItemIds.includes(item.id));

  return (
    <View style={styles.container}>
      <CustomHeader
        title="Ajustes"
        showBell={true}
        onBellPress={() => router.push("/(tabs)/feed")}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.menuContainer}>
          {/*Perfil */}
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => setProfileModalVisible(true)}
            activeOpacity={0.7}
          >
            <View style={styles.iconCircle}>
              <Ionicons
                name="person"
                size={36}
                color={THEME.colors.primaryDark}
              />
            </View>
            <View style={styles.menuTextContainer}>
              <Text style={styles.menuTitle}>Perfil</Text>
            </View>
          </TouchableOpacity>

          {/*Objetos*/}
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => setSavedModalVisible(true)}
            activeOpacity={0.7}
          >
            <View style={styles.iconCircleSpecial}>
              <Ionicons
                name="basketball-outline"
                size={38}
                color={THEME.colors.primaryDark}
              />
            </View>
            <View style={styles.menuTextContainer}>
              <Text style={styles.menuTitleMultiline}>
                Objetos que{"\n"}buscas
              </Text>
            </View>
          </TouchableOpacity>

          {/*Seguridad y Privacidad */}
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => setPrivacyModalVisible(true)}
            activeOpacity={0.7}
          >
            <View style={styles.iconCircle}>
              <MaterialCommunityIcons
                name="shield-lock-outline"
                size={36}
                color={THEME.colors.primaryDark}
              />
            </View>
            <View style={styles.menuTextContainer}>
              <Text style={styles.menuTitleMultiline}>
                Seguridad y{"\n"}Privacidad
              </Text>
            </View>
          </TouchableOpacity>

          {/*Soporte */}
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => setSupportModalVisible(true)}
            activeOpacity={0.7}
          >
            <View style={styles.iconCircle}>
              <Ionicons
                name="call-outline"
                size={34}
                color={THEME.colors.primaryDark}
              />
            </View>
            <View style={styles.menuTextContainer}>
              <Text style={styles.menuTitle}>Soporte</Text>
            </View>
          </TouchableOpacity>

          {/*Cerrar sesión */}
          <TouchableOpacity
            style={styles.menuItem}
            onPress={handleLogout}
            activeOpacity={0.7}
          >
            <View style={styles.iconCircle}>
              <Ionicons
                name="exit-outline"
                size={34}
                color={THEME.colors.primaryDark}
              />
            </View>
            <View style={styles.menuTextContainer}>
              <Text style={styles.menuTitleMultiline}>Cerrar{"\n"}sesión</Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <Modal
        visible={profileModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setProfileModalVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Editar Perfil UTCH</Text>
              <TouchableOpacity onPress={() => setProfileModalVisible(false)}>
                <Ionicons name="close" size={24} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
            <ScrollView style={{ padding: 18 }}>
              <Text style={styles.inputLabel}>Nombre Completo</Text>
              <TextInput
                style={styles.input}
                value={editName}
                onChangeText={setEditName}
                placeholder="Nombre del estudiante"
              />

              <Text style={styles.inputLabel}>Carrera</Text>
              <TextInput
                style={styles.input}
                value={editCareer}
                onChangeText={setEditCareer}
                placeholder="xxxxx"
              />

              <Text style={styles.inputLabel}>Matrícula</Text>
              <TextInput
                style={styles.input}
                value={editStudentId}
                onChangeText={setEditStudentId}
                placeholder="xxxxxxxx"
              />

              <Text style={styles.inputLabel}>Teléfono / WhatsApp</Text>
              <TextInput
                style={styles.input}
                value={editPhone}
                onChangeText={setEditPhone}
                placeholder="xxx xxx xxxx"
                keyboardType="phone-pad"
              />

              <TouchableOpacity
                style={styles.saveBtn}
                onPress={handleSaveProfile}
              >
                <Text style={styles.saveBtnText}>Guardar Cambios</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

      <Modal
        visible={savedModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setSavedModalVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                Objetos que buscas ({savedItems.length})
              </Text>
              <TouchableOpacity onPress={() => setSavedModalVisible(false)}>
                <Ionicons name="close" size={24} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
            <ScrollView style={{ padding: 18 }}>
              {savedItems.length === 0 ? (
                <Text style={styles.emptyText}>
                  No tienes objetos guardados o en seguimiento.
                </Text>
              ) : (
                savedItems.map((item) => (
                  <TouchableOpacity
                    key={item.id}
                    style={styles.savedCard}
                    onPress={() => {
                      setSavedModalVisible(false);
                      setSelectedItemId(item.id);
                      router.push("/(tabs)/map");
                    }}
                  >
                    <View style={{ flex: 1 }}>
                      <Text style={styles.savedCardTitle}>{item.title}</Text>
                      <Text style={styles.savedCardSub}>
                        {item.locationName} • {item.date}
                      </Text>
                    </View>
                    <Ionicons
                      name="arrow-forward-circle"
                      size={24}
                      color={THEME.colors.primaryDark}
                    />
                  </TouchableOpacity>
                ))
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>

      <Modal
        visible={privacyModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setPrivacyModalVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Seguridad y Privacidad</Text>
              <TouchableOpacity onPress={() => setPrivacyModalVisible(false)}>
                <Ionicons name="close" size={24} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
            <ScrollView style={{ padding: 20 }}>
              <Text style={styles.infoTitle}>
                Normativa de Objetos Perdidos
              </Text>
              <Text style={styles.infoText}>
                1. Todos los reportes deben estar dentro del perímetro del
                campus de la Universidad Tecnológica de Chihuahua.
              </Text>
              <Text style={styles.infoText}>
                2. Los artículos de alto valor (laptops, celulares, carteras con
                dinero) deben ser entregados en las oficinas del respectivo
                edificio.
              </Text>
              <Text style={styles.infoText}>
                3. Tus datos de contacto solo se comparten con estudiantes de la
                UTCH para facilitar la entrega de las pertenencias.
              </Text>
              <TouchableOpacity
                style={styles.closeSimpleBtn}
                onPress={() => setPrivacyModalVisible(false)}
              >
                <Text style={styles.closeSimpleBtnText}>Entendido</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Modal: Soporte */}
      <Modal
        visible={supportModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setSupportModalVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Soporte UTCH</Text>
              <TouchableOpacity onPress={() => setSupportModalVisible(false)}>
                <Ionicons name="close" size={24} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
            <ScrollView style={{ padding: 20 }}>
              <Text style={styles.supportLabel}>¿Necesitas asistencia?</Text>

              <TouchableOpacity
                style={styles.contactItem}
                onPress={() => Linking.openURL("tel:6144322000")}
              >
                <Ionicons
                  name="call"
                  size={22}
                  color={THEME.colors.primaryDark}
                  style={{ marginRight: 12 }}
                />
                <View>
                  <Text style={styles.contactItemTitle}>Asistente</Text>
                  <Text style={styles.contactItemSub}>xxx xxx xxxx</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.contactItem}
                onPress={() => Linking.openURL("https://web.whatsapp.com/")}
              >
                <Ionicons
                  name="logo-whatsapp"
                  size={22}
                  color="#25D366"
                  style={{ marginRight: 12 }}
                />
                <View>
                  <Text style={styles.contactItemTitle}>Ayuda Directa</Text>
                  <Text style={styles.contactItemSub}>Chat</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.closeSimpleBtn}
                onPress={() => setSupportModalVisible(false)}
              >
                <Text style={styles.closeSimpleBtnText}>Cerrar</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  scrollContent: {
    paddingHorizontal: 26,
    paddingTop: 20,
    paddingBottom: 40,
  },
  userBanner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F3F6F3",
    padding: 14,
    borderRadius: 14,
    marginBottom: 26,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  bannerAvatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: THEME.colors.primaryLight,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },
  bannerDetails: {
    flex: 1,
  },
  bannerName: {
    fontSize: 16,
    fontWeight: "700",
    color: THEME.colors.primaryDark,
  },
  bannerCareer: {
    fontSize: 12,
    color: "#475569",
    marginTop: 2,
  },
  bannerId: {
    fontSize: 11,
    color: "#64748B",
    marginTop: 1,
  },
  menuContainer: {
    gap: 16,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
  },
  iconCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    borderWidth: 2,
    borderColor: THEME.colors.primaryDark,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 22,
    backgroundColor: "#FFFFFF",
  },
  iconCircleSpecial: {
    width: 68,
    height: 68,
    borderRadius: 34,
    borderWidth: 2,
    borderColor: THEME.colors.primaryDark,
    backgroundColor: THEME.colors.primaryLight,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 22,
  },
  menuTextContainer: {
    flex: 1,
    justifyContent: "center",
  },
  menuTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#0A3B1D",
  },
  menuTitleMultiline: {
    fontSize: 22,
    fontWeight: "700",
    color: "#0A3B1D",
    lineHeight: 28,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalCard: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "80%",
    overflow: "hidden",
  },
  modalHeader: {
    backgroundColor: THEME.colors.primaryDark,
    paddingHorizontal: 20,
    paddingVertical: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  modalTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "700",
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: THEME.colors.textMain,
    marginTop: 10,
    marginBottom: 6,
  },
  input: {
    backgroundColor: "#F8FAF8",
    borderWidth: 1,
    borderColor: "#CBD5E1",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
  },
  saveBtn: {
    backgroundColor: THEME.colors.primaryLight,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
    marginBottom: 20,
  },
  saveBtnText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
  emptyText: {
    textAlign: "center",
    color: "#94A3B8",
    fontSize: 14,
    marginVertical: 20,
    lineHeight: 20,
  },
  savedCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    backgroundColor: "#F8FAF8",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginBottom: 10,
  },
  savedCardTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: THEME.colors.textMain,
  },
  savedCardSub: {
    fontSize: 12,
    color: "#64748B",
    marginTop: 3,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: THEME.colors.primaryDark,
    marginBottom: 12,
  },
  infoText: {
    fontSize: 13,
    color: "#334155",
    lineHeight: 20,
    marginBottom: 12,
  },
  supportLabel: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1E293B",
    marginBottom: 16,
  },
  contactItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8FAF8",
    padding: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginBottom: 12,
  },
  contactItemTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1E293B",
  },
  contactItemSub: {
    fontSize: 12,
    color: "#64748B",
    marginTop: 2,
  },
  closeSimpleBtn: {
    backgroundColor: THEME.colors.primaryDark,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 18,
    marginBottom: 20,
  },
  closeSimpleBtnText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },
});
