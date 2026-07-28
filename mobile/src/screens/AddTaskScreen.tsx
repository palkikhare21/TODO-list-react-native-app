import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AppButton } from '../components/AppButton';
import { AppInput } from '../components/AppInput';
import { useTasks } from '../context/TaskContext';
import { RootStackParamList } from '../navigation/RootNavigator';
import { Priority } from '../types/task';

type Props = NativeStackScreenProps<RootStackParamList, 'AddTask'>;

const priorities: Priority[] = ['low', 'medium', 'high'];

export function AddTaskScreen({ navigation }: Props) {
  const { createTask } = useTasks();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dateTime, setDateTime] = useState(new Date().toISOString());
  const [deadline, setDeadline] = useState(new Date(Date.now() + 24 * 36e5).toISOString());
  const [priority, setPriority] = useState<Priority>('medium');
  const [category, setCategory] = useState('');

  async function submit() {
    if (!title.trim()) {
      Alert.alert('Missing title', 'Please add a task title.');
      return;
    }

    try {
      await createTask({
        title: title.trim(),
        description,
        dateTime,
        deadline,
        priority,
        category: category.trim(),
      });
      navigation.goBack();
    } catch (error) {
      Alert.alert('Could not save task', error instanceof Error ? error.message : 'Please try again');
    }
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <AppInput label="Title" value={title} onChangeText={setTitle} />
      <AppInput label="Description" value={description} onChangeText={setDescription} multiline style={styles.longInput} />
      <AppInput label="Date-time ISO" value={dateTime} onChangeText={setDateTime} />
      <AppInput label="Deadline ISO" value={deadline} onChangeText={setDeadline} />
      <AppInput label="Category / tag" value={category} onChangeText={setCategory} />

      <View style={styles.priorityRow}>
        {priorities.map(item => (
          <Text key={item} style={[styles.priority, priority === item && styles.activePriority]} onPress={() => setPriority(item)}>
            {item}
          </Text>
        ))}
      </View>

      <AppButton title="Save Task" onPress={submit} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  content: { padding: 20, gap: 16 },
  longInput: { minHeight: 96, textAlignVertical: 'top', paddingTop: 12 },
  priorityRow: { flexDirection: 'row', gap: 8 },
  priority: {
    flex: 1,
    textAlign: 'center',
    textTransform: 'capitalize',
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#e2e8f0',
    color: '#475569',
    fontWeight: '800',
  },
  activePriority: { backgroundColor: '#2563eb', color: '#ffffff' },
});
