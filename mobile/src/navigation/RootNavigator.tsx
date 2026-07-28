import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../context/AuthContext';
import { AddTaskScreen } from '../screens/AddTaskScreen';
import { LoginScreen } from '../screens/LoginScreen';
import { RegisterScreen } from '../screens/RegisterScreen';
import { TaskListScreen } from '../screens/TaskListScreen';

export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  Tasks: undefined;
  AddTask: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  const { user } = useAuth();

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShadowVisible: false, headerTitleStyle: { color: '#0f172a' } }}>
        {user ? (
          <>
            <Stack.Screen name="Tasks" component={TaskListScreen} options={{ title: 'My Tasks' }} />
            <Stack.Screen name="AddTask" component={AddTaskScreen} options={{ title: 'Add Task' }} />
          </>
        ) : (
          <>
            <Stack.Screen name="Login" component={LoginScreen} options={{ title: 'Welcome Back' }} />
            <Stack.Screen name="Register" component={RegisterScreen} options={{ title: 'Create Account' }} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
