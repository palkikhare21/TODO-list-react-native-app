import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';

type Props = {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'ghost' | 'danger';
};

export function AppButton({ title, onPress, variant = 'primary' }: Props) {
  return (
    <Pressable style={[styles.button, styles[variant]]} onPress={onPress}>
      <Text style={[styles.text, variant === 'ghost' && styles.ghostText]}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 48,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 18,
  },
  primary: { backgroundColor: '#2563eb' },
  danger: { backgroundColor: '#dc2626' },
  ghost: { backgroundColor: '#eef2ff' },
  text: { color: '#ffffff', fontWeight: '700', fontSize: 15 },
  ghostText: { color: '#1e3a8a' },
});
