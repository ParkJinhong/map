import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HomeScreen } from '../screens/HomeScreen';
import { AddEventScreen } from '../screens/AddEventScreen';
import { EditEventScreen } from '../screens/EditEventScreen';

export type RootStackParamList = {
  Home: undefined;
  AddEvent: undefined;
  EditEvent: {
    eventId: string;
    calendarId: string;
    title?: string;
    notes?: string;
  };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#1a1a2e' },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: '600' },
      }}
    >
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{ title: '접근성 캘린더' }}
      />
      <Stack.Screen
        name="AddEvent"
        component={AddEventScreen}
        options={{ title: '일정 추가' }}
      />
      <Stack.Screen
        name="EditEvent"
        component={EditEventScreen}
        options={{ title: '일정 수정' }}
      />
    </Stack.Navigator>
  );
}
