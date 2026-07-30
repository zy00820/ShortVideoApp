import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MainTabs } from './MainTabs';
import { ProfileScreen } from '../screens/Profile';
import { COLORS } from '../constants';

const Stack = createNativeStackNavigator();

export const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: COLORS.background },
        }}
      >
        <Stack.Screen name="MainTabs" component={MainTabs} />
        <Stack.Screen name="UserProfile" component={ProfileScreen} />
        <Stack.Screen
          name="VideoDetail"
          component={ProfileScreen}
          options={{ title: '视频详情' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
