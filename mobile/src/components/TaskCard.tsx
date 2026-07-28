import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Task } from '../types/task';
import { deadlineLabel } from '../utils/taskSort';
import { AppButton } from './AppButton';
import { PriorityBadge } from './PriorityBadge';

type Props = {
  task: Task;
  onToggle: () => void;
  onDelete: () => void;
};

export function TaskCard({ task, onToggle, onDelete }: Props) {
  return (
    <View style={[styles.card, task.completed && styles.completed]}>
      <View style={styles.header}>
        <View style={styles.titleWrap}>
          <Text style={styles.title}>{task.title}</Text>
          <Text style={styles.description}>{task.description}</Text>
        </View>
        <PriorityBadge priority={task.priority} />
      </View>

      <View style={styles.metaRow}>
        <Text style={styles.meta}>{deadlineLabel(task.deadline)}</Text>
        {!!task.category && <Text style={styles.category}>{task.category}</Text>}
        <Text style={styles.status}>{task.completed ? 'Completed' : 'Pending'}</Text>
      </View>

      <View style={styles.actions}>
        <Pressable style={styles.check} onPress={onToggle}>
          <Text style={styles.checkText}>{task.completed ? 'Mark Pending' : 'Mark Done'}</Text>
        </Pressable>
        <AppButton title="Delete" variant="danger" onPress={onDelete} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 14,
    gap: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  completed: { opacity: 0.58 },
  header: { flexDirection: 'row', justifyContent: 'space-between', gap: 12 },
  titleWrap: { flex: 1, gap: 4 },
  title: { fontSize: 17, fontWeight: '800', color: '#0f172a' },
  description: { color: '#64748b', lineHeight: 20 },
  metaRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  meta: { color: '#334155', fontWeight: '700' },
  category: { color: '#475569', backgroundColor: '#f1f5f9', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 },
  status: { color: '#475569' },
  actions: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 },
  check: { minHeight: 44, justifyContent: 'center' },
  checkText: { color: '#2563eb', fontWeight: '800' },
});
