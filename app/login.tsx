import React, { useState } from 'react';
import {
  View, Text, TextInput, StyleSheet, Alert,
  TouchableOpacity, SafeAreaView, StatusBar, KeyboardAvoidingView, Platform,
} from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error: any) {
      Alert.alert('Login Error', error.message);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" />
      <KeyboardAvoidingView style={styles.kav} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <View style={styles.container}>

          {/* Logo */}
          <View style={styles.logoRow}>
            <View style={styles.logoMark}>
              <Text style={styles.logoText}>LF</Text>
            </View>
            <Text style={styles.logoName}>LingoFlow</Text>
          </View>

          <Text style={styles.heading}>Welcome back.</Text>
          <Text style={styles.sub}>Sign in to continue learning.</Text>

          {/* Inputs */}
          <View style={styles.form}>
            <View style={styles.inputWrap}>
              <Ionicons name="mail-outline" size={18} color="#4B5563" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Email address"
                placeholderTextColor="#374151"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
              />
            </View>

            <View style={styles.inputWrap}>
              <Ionicons name="lock-closed-outline" size={18} color="#4B5563" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor="#374151"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPass}
              />
              <TouchableOpacity onPress={() => setShowPass(p => !p)} style={styles.eyeBtn}>
                <Ionicons name={showPass ? 'eye-outline' : 'eye-off-outline'} size={18} color="#4B5563" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Primary CTA */}
          <TouchableOpacity style={styles.primaryBtn} onPress={handleLogin} activeOpacity={0.85}>
            <Text style={styles.primaryBtnText}>Log In</Text>
            <Ionicons name="arrow-forward" size={18} color="#fff" style={{ marginLeft: 6 }} />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.push('/signup')} style={styles.switchRow}>
            <Text style={styles.switchText}>Don't have an account? </Text>
            <Text style={styles.switchLink}>Sign Up</Text>
          </TouchableOpacity>

        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#0A0A12' },
  kav: { flex: 1 },
  container: {
    flex: 1,
    paddingHorizontal: 28,
    paddingTop: 40,
    paddingBottom: 40,
    justifyContent: 'center',
  },

  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 48,
  },
  logoMark: {
    width: 36,
    height: 36,
    borderRadius: 11,
    backgroundColor: '#6D28D9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  logoText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  logoName: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: -0.5,
  },

  heading: {
    fontSize: 34,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -1,
    marginBottom: 8,
  },
  sub: {
    fontSize: 16,
    color: '#4B5563',
    marginBottom: 40,
    fontWeight: '400',
  },

  form: { gap: 12, marginBottom: 24 },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#13131F',
    borderWidth: 1,
    borderColor: '#1E1E30',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 4,
  },
  inputIcon: { marginRight: 10 },
  input: {
    flex: 1,
    paddingVertical: 16,
    fontSize: 16,
    color: '#F1F5F9',
  },
  eyeBtn: { padding: 4 },

  primaryBtn: {
    flexDirection: 'row',
    backgroundColor: '#6D28D9',
    paddingVertical: 17,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    ...Platform.select({
      ios: {
        shadowColor: '#6D28D9',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.45,
        shadowRadius: 12,
      },
      android: { elevation: 8 },
    }),
  },
  primaryBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 16,
    letterSpacing: -0.2,
  },

  switchRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  switchText: { color: '#4B5563', fontSize: 14, fontWeight: '500' },
  switchLink: { color: '#A78BFA', fontSize: 14, fontWeight: '700' },
});
