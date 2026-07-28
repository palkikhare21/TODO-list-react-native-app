import React, { useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { AppButton } from '../components/AppButton';
import { AppInput } from '../components/AppInput';
import { useAuth } from '../context/AuthContext';

export function RegisterScreen() {
  const { register, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  async function submit() {
    if (password !== confirmPassword) {
      Alert.alert('Password mismatch', 'Both password fields should match.');
      return;
    }

    try {
      await register(email.trim(), password);
    } catch (error) {
      Alert.alert('Registration failed', error instanceof Error ? error.message : 'Please try again');
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Create your task space.</Text>
      <AppInput label="Email" value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" />
      <AppInput label="Password" value={password} onChangeText={setPassword} secureTextEntry />
      <AppInput label="Confirm password" value={confirmPassword} onChangeText={setConfirmPassword} secureTextEntry />
      <AppButton title={loading ? 'Creating...' : 'Register'} onPress={submit} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, gap: 16, backgroundColor: '#f8fafc', justifyContent: 'center' },
  heading: { fontSize: 30, lineHeight: 36, fontWeight: '900', color: '#0f172a', marginBottom: 8 },
});
