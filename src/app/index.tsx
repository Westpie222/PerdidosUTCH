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

export default function LoginScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { login } = useLostItems();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleInfoPress = () => {
    Alert.alert(
      'Acceso Institucional',
      'Ingresa con tu correo institucional @utch.edu.mx y tu contraseña de alumno.'
    );
  };

  const handleLogin = () => {
    login(email.trim() || 'carlos.mendez@utch.edu.mx');
    router.replace('/(tabs)/map');
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
        <Text style={styles.topBarTitle}>Login</Text>
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
              <Ionicons name="person" size={88} color="#FFFFFF" />
            </View>
          </View>

          <Text style={styles.screenTitle}>Iniciar Sesión</Text>

          <View style={styles.formContainer}>
            <View style={styles.inputBox}>
              <TextInput
                style={styles.inputField}
                placeholder="Email"
                placeholderTextColor="#9CA3AF"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              <TouchableOpacity
                onPress={handleInfoPress}
                style={styles.inputIconBtn} 
                activeOpacity={0.7}
              >
                <Ionicons name="information-circle-outline" size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>

            <View style={styles.inputBox}>
              <TextInput
                style={styles.inputField}
                placeholder="Password"
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

            <TouchableOpacity
              style={styles.loginButton}
              onPress={handleLogin}
              activeOpacity={0.85}
            >
              <Text style={styles.loginButtonText}>Iniciar Sesión</Text>
            </TouchableOpacity>

            {/* Demo Quick Access */}
            <TouchableOpacity
              style={styles.demoLoginBtn}
              onPress={() => {
                setEmail('sin_cuenta@utch.edu.mx');
                setPassword('utch2026');
                handleLogin();
              }}
              activeOpacity={0.7}
            >
              <Text style={styles.demoLoginText}>
                Ingresar sin cuenta.
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

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
    paddingTop: 36,
    paddingBottom: 24,
  },
  avatarWrapper: {
    marginBottom: 24,
  },
  avatarCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
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
    fontSize: 32,
    fontWeight: '600',
    color: THEME.colors.primaryDark,
    marginBottom: 36,
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
    marginBottom: 18,
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
  loginButton: {
    backgroundColor: THEME.colors.primaryLight,
    borderRadius: 14,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  demoLoginBtn: {
    marginTop: 20,
    paddingVertical: 8,
    alignItems: 'center',
  },
  demoLoginText: {
    color: THEME.colors.primaryDark,
    fontSize: 13,
    textDecorationLine: 'underline',
    fontWeight: '600',
  },
  bottomBar: {
    backgroundColor: THEME.colors.primaryDark,
    height: 42,
  },
});
