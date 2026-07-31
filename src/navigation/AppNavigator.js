import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MainTabs } from './MainTabs';
import { ProfileScreen } from '../screens/Profile';
import { EditProfileScreen } from '../screens/Profile/EditProfileScreen';
import { SettingsScreen } from '../screens/Settings';
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
        <Stack.Screen name="EditProfile" component={EditProfileScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
