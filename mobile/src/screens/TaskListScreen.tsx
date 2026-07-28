import React, { useCallback, useEffect } from 'react';
import { FlatList, RefreshControl, StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AppButton } from '../components/AppButton';
import { TaskCard } from '../components/TaskCard';
import { useAuth } from '../context/AuthContext';
import { useTasks } from '../context/TaskContext';
import { RootStackParamList } from '../navigation/RootNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'Tasks'>;

export function TaskListScreen({ navigation }: Props) {
  const { logout } = useAuth();
  const { tasks, filter, setFilter, loading, loadTasks, toggleTask, deleteTask } = useTasks();

  useEffect(() => {
    loadTasks();
  }, []);

  const renderEmpty = useCallback(
    () => (
      <View style={styles.empty}>
        <Text style={styles.emptyTitle}>No tasks here yet</Text>
        <Text style={styles.emptyText}>Add a task with priority and deadline to start your smart list.</Text>
      </View>
    ),
    [],
  );

  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <AppButton title="+ Add" onPress={() => navigation.navigate('AddTask')} />
        <AppButton title="Logout" variant="ghost" onPress={logout} />
      </View>

      <View style={styles.filters}>
        {(['all', 'pending', 'completed'] as const).map(item => (
          <Text key={item} style={[styles.filter, filter === item && styles.activeFilter]} onPress={() => setFilter(item)}>
            {item}
          </Text>
        ))}
      </View>

      <FlatList
        data={tasks}
        keyExtractor={item => item._id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={renderEmpty}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={loadTasks} />}
        renderItem={({ item }) => (
          <TaskCard task={item} onToggle={() => toggleTask(item._id)} onDelete={() => deleteTask(item._id)} />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc', padding: 16 },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 12 },
  filters: { flexDirection: 'row', gap: 8, marginVertical: 16 },
  filter: {
    textTransform: 'capitalize',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    color: '#475569',
    backgroundColor: '#e2e8f0',
    fontWeight: '800',
  },
  activeFilter: { backgroundColor: '#172554', color: '#ffffff' },
  list: { gap: 12, paddingBottom: 28 },
  empty: { alignItems: 'center', marginTop: 80, gap: 6 },
  emptyTitle: { fontSize: 22, fontWeight: '900', color: '#0f172a' },
  emptyText: { color: '#64748b', textAlign: 'center' },
});
