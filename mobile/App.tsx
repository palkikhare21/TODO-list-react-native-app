import React from 'react';
import { AuthProvider } from './src/context/AuthContext';
import { TaskProvider } from './src/context/TaskContext';
import { RootNavigator } from './src/navigation/RootNavigator';

export default function App() {
  return (
    <AuthProvider>
      <TaskProvider>
        <RootNavigator />
      </TaskProvider>
    </AuthProvider>
  );
}
