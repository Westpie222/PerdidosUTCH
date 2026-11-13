import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { THEME } from '../constants/theme';
import { useLostItems } from '../context/LostItemsContext';

export default function RegisterScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { login } = useLostItems();

  const [name, setName] = useState('');
  const [matricula, setMatricula] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleRegister = () => {
    if (
      !name.trim() ||
      !matricula.trim() ||
      !email.trim() ||
      !password.trim() ||
      !confirmPassword.trim()
    ) {
      Alert.alert(
        'Campos incompletos',
        'Por favor llena todos los campos para registrarte.'
      );
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert(
        'Contraseñas no coinciden',
        'Las contraseñas ingresadas deben ser iguales.'
      );
      return;
    }

    Alert.alert(
      '¡Registro Exitoso!',
      'Tu cuenta ha sido creada correctamente.',
      [
        {
          text: 'Continuar',
          onPress: () => {
            login(email.trim());
            router.replace('/(tabs)/map');
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View
        style={[
          styles.topBar,
          { paddingTop: Math.max(insets.top, Platform.OS === 'android' ? 16 : 14) },
        ]}
      >
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.topBarTitle}>Registro</Text>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* Icon */}
          <View style={styles.avatarWrapper}>
            <View style={styles.avatarCircle}>
              <Ionicons name="person-add" size={74} color="#FFFFFF" />
            </View>
          </View>

          <Text style={styles.screenTitle}>Crear Cuenta</Text>

          <View style={styles.formContainer}>
            {/* Nombre */}
            <View style={styles.inputBox}>
              <TextInput
                style={styles.inputField}
                placeholder="Nombre completo"
                placeholderTextColor="#9CA3AF"
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
              />
              <View style={styles.inputIconBtn}>
                <Ionicons name="person-outline" size={20} color="#6B7280" />
              </View>
            </View>

            {/* Matrícula */}
            <View style={styles.inputBox}>
              <TextInput
                style={styles.inputField}
                placeholder="Matrícula"
                placeholderTextColor="#9CA3AF"
                value={matricula}
                onChangeText={setMatricula}
                keyboardType="number-pad"
                maxLength={10}
              />
              <View style={styles.inputIconBtn}>
                <Ionicons name="card-outline" size={20} color="#6B7280" />
              </View>
            </View>

            {/* Correo Electrónico */}
            <View style={styles.inputBox}>
              <TextInput
                style={styles.inputField}
                placeholder="Correo institucional (@utch.edu.mx)"
                placeholderTextColor="#9CA3AF"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              <View style={styles.inputIconBtn}>
                <Ionicons name="mail-outline" size={20} color="#6B7280" />
              </View>
            </View>

            {/* COntraseña */}
            <View style={styles.inputBox}>
              <TextInput
                style={styles.inputField}
                placeholder="Contraseña"
                placeholderTextColor="#9CA3AF"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
              />
              <TouchableOpacity
                onPress={() => setShowPassword((prev) => !prev)}
                style={styles.inputIconBtn}
                activeOpacity={0.7}
              >
                <Ionicons
                  name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                  size={22}
                  color="#6B7280"
                />
              </TouchableOpacity>
            </View>

            {/* Confirmar Contraseña */}
            <View style={styles.inputBox}>
              <TextInput
                style={styles.inputField}
                placeholder="Confirmar contraseña"
                placeholderTextColor="#9CA3AF"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!showConfirmPassword}
                autoCapitalize="none"
              />
              <TouchableOpacity
                onPress={() => setShowConfirmPassword((prev) => !prev)}
                style={styles.inputIconBtn}
                activeOpacity={0.7}
              >
                <Ionicons
                  name={showConfirmPassword ? 'eye-off-outline' : 'eye-outline'}
                  size={22}
                  color="#6B7280"
                />
              </TouchableOpacity>
            </View>

            {/* Botón de Registro */}
            <TouchableOpacity
              style={styles.registerButton}
              onPress={handleRegister}
              activeOpacity={0.85}
            >
              <Text style={styles.registerButtonText}>Registrarse</Text>
            </TouchableOpacity>

            {/* Volver al Login */}
            <TouchableOpacity
              style={styles.loginLinkBtn}
              onPress={() => router.back()}
              activeOpacity={0.7}
            >
              <Text style={styles.loginLinkText}>
                ¿Ya tienes una cuenta? <Text style={styles.loginLinkBold}>Inicia Sesión</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Footer */}
      <View
        style={[
          styles.bottomBar,
          { paddingBottom: Math.max(insets.bottom, 16) },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  topBar: {
    backgroundColor: THEME.colors.primaryDark,
    paddingHorizontal: 22,
    paddingBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: 12,
    padding: 4,
  },
  topBarTitle: {
    color: '#FFFFFF',
    fontSize: 26,
    fontWeight: '700',
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
    paddingHorizontal: 30,
    paddingTop: 24,
    paddingBottom: 24,
  },
  avatarWrapper: {
    marginBottom: 16,
  },
  avatarCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: THEME.colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 5,
  },
  screenTitle: {
    fontSize: 28,
    fontWeight: '600',
    color: THEME.colors.primaryDark,
    marginBottom: 24,
    textAlign: 'center',
  },
  formContainer: {
    width: '100%',
    maxWidth: 340,
  },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#374151',
    backgroundColor: '#FFFFFF',
    height: 48,
    marginBottom: 14,
    paddingHorizontal: 12,
  },
  inputField: {
    flex: 1,
    fontSize: 16,
    color: '#111827',
    paddingVertical: 8,
  },
  inputIconBtn: {
    padding: 4,
  },
  registerButton: {
    backgroundColor: THEME.colors.primaryLight,
    borderRadius: 14,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  registerButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  loginLinkBtn: {
    marginTop: 18,
    paddingVertical: 8,
    alignItems: 'center',
  },
  loginLinkText: {
    color: '#6B7280',
    fontSize: 14,
  },
  loginLinkBold: {
    color: THEME.colors.primaryDark,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  bottomBar: {
    backgroundColor: THEME.colors.primaryDark,
    height: 42,
  },
});