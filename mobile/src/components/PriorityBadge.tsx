import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { Priority } from '../types/task';

const colors = {
  high: { bg: '#fee2e2', fg: '#991b1b' },
  medium: { bg: '#ffedd5', fg: '#9a3412' },
  low: { bg: '#dcfce7', fg: '#166534' },
};

export function PriorityBadge({ priority }: { priority: Priority }) {
  return (
    <Text style={[styles.badge, { backgroundColor: colors[priority].bg, color: colors[priority].fg }]}>
      {priority.toUpperCase()}
    </Text>
  );
}

const styles = StyleSheet.create({
  badge: {
    borderRadius: 6,
    overflow: 'hidden',
    paddingHorizontal: 8,
    paddingVertical: 4,
    fontSize: 11,
    fontWeight: '800',
  },
});
