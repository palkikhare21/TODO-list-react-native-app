import React, { useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AppButton } from '../components/AppButton';
import { AppInput } from '../components/AppInput';
import { useAuth } from '../context/AuthContext';
import { RootStackParamList } from '../navigation/RootNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

export function LoginScreen({ navigation }: Props) {
  const { login, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  async function submit() {
    try {
      await login(email.trim(), password);
    } catch (error) {
      Alert.alert('Login failed', error instanceof Error ? error.message : 'Please try again');
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Plan better. Finish calmer.</Text>
      <AppInput label="Email" value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" />
      <AppInput label="Password" value={password} onChangeText={setPassword} secureTextEntry />
      <AppButton title={loading ? 'Signing in...' : 'Login'} onPress={submit} />
      <AppButton title="Create new account" variant="ghost" onPress={() => navigation.navigate('Register')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, gap: 16, backgroundColor: '#f8fafc', justifyContent: 'center' },
  heading: { fontSize: 32, lineHeight: 38, fontWeight: '900', color: '#0f172a', marginBottom: 8 },
});
