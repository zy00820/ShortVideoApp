import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { HomeScreen } from '../screens/Home';
import { DiscoverScreen } from '../screens/Discover';
import { UploadScreen } from '../screens/Upload';
import { InboxScreen } from '../screens/Inbox';
import { ProfileScreen } from '../screens/Profile';
import { COLORS, SIZES } from '../constants';
import { useVideoStore } from '../store/videoStore';

const Tab = createBottomTabNavigator();
const { width } = Dimensions.get('window');

const CustomTabBar = ({ state, descriptors, navigation }) => {
  const { currentUser, messages } = useVideoStore();

  const items = [
    { key: 'Home', label: '首页', icon: '🏠' },
    { key: 'Discover', label: '发现', icon: '🔍' },
    { key: 'Upload', label: '', icon: '➕', isUpload: true },
    { key: 'Inbox', label: '消息', icon: '📬', badge: 4 },
    { key: 'Profile', label: '我', icon: '👤' },
  ];

  return (
    <View style={styles.tabBar}>
      {items.map((item, index) => {
        const isActive = state.index === index;

        if (item.isUpload) {
          return (
            <TouchableOpacity
              key={item.key}
              onPress={() => navigation.navigate(item.key)}
              style={styles.uploadButton}
            >
              <View style={styles.uploadInner}>
                <Text style={styles.uploadIcon}>{item.icon}</Text>
              </View>
            </TouchableOpacity>
          );
        }

        return (
          <TouchableOpacity
            key={item.key}
            onPress={() => navigation.navigate(item.key)}
            style={styles.tabItem}
          >
            <Text
              style={[
                styles.tabIcon,
                isActive && styles.tabIconActive,
              ]}
            >
              {item.icon}
            </Text>
            <Text
              style={[
                styles.tabLabel,
                isActive && styles.tabLabelActive,
              ]}
            >
              {item.label}
            </Text>
            {item.badge > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{item.badge}</Text>
              </View>
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export const MainTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={{ headerShown: false }}
      tabBar={(props) => <CustomTabBar {...props} />}
      initialRouteName="Home"
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Discover" component={DiscoverScreen} />
      <Tab.Screen name="Upload" component={UploadScreen} />
      <Tab.Screen name="Inbox" component={InboxScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: COLORS.gray[800],
    paddingVertical: SIZES.sm,
    paddingBottom: SIZES.sm,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: SIZES.xs,
    position: 'relative',
  },
  tabIcon: {
    fontSize: 24,
    marginBottom: 2,
  },
  tabIconActive: {
    transform: [{ scale: 1.1 }],
  },
  tabLabel: {
    color: COLORS.gray[500],
    fontSize: 10,
    fontWeight: '600',
  },
  tabLabelActive: {
    color: COLORS.white,
  },
  uploadButton: {
    width: 60,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadInner: {
    width: 54,
    height: 36,
    borderRadius: 10,
    backgroundColor: COLORS.background,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: COLORS.gray[800],
  },
  uploadIcon: {
    fontSize: 20,
    color: COLORS.white,
  },
  badge: {
    position: 'absolute',
    top: 0,
    right: '20%',
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    minWidth: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    color: COLORS.white,
    fontSize: 10,
    fontWeight: 'bold',
  },
});
