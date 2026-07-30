import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SIZES } from '../../constants';
import { FeedScreen } from './FeedScreen';
import { Avatar } from '../../components/Avatar';
import { useVideoStore } from '../../store/videoStore';

export const HomeScreen = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState('following');
  const { followedUsers, currentUser } = useVideoStore();

  const tabs = [
    { id: 'following', label: '关注' },
    { id: 'recommend', label: '推荐' },
    { id: 'nearby', label: '同城' },
  ];

  const handleProfilePress = (user) => {
    navigation.navigate('UserProfile', { user });
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.avatarButton} onPress={() => navigation.navigate('Inbox')}>
          <Avatar uri={currentUser.avatar} size={32} />
        </TouchableOpacity>

        <View style={styles.tabs}>
          {tabs.map((tab) => (
            <TouchableOpacity
              key={tab.id}
              onPress={() => setActiveTab(tab.id)}
              style={styles.tabItem}
            >
              <Text
                style={[
                  styles.tabLabel,
                  activeTab === tab.id && styles.tabLabelActive,
                ]}
              >
                {tab.label}
              </Text>
              {activeTab === tab.id && <View style={styles.tabIndicator} />}
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          style={styles.searchButton}
          onPress={() => navigation.navigate('Discover')}
        >
          <Text style={styles.searchIcon}>🔍</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.feedContainer}>
        <FeedScreen onNavigateToProfile={handleProfilePress} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.black,
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SIZES.md,
    paddingVertical: SIZES.sm,
    backgroundColor: 'transparent',
  },
  avatarButton: {
    padding: SIZES.xs,
  },
  tabs: {
    flexDirection: 'row',
    gap: SIZES.lg,
  },
  tabItem: {
    alignItems: 'center',
    paddingVertical: SIZES.xs,
  },
  tabLabel: {
    color: COLORS.gray[400],
    fontSize: SIZES.md,
    fontWeight: '600',
  },
  tabLabelActive: {
    color: COLORS.white,
    fontSize: SIZES.lg,
  },
  tabIndicator: {
    position: 'absolute',
    bottom: 0,
    width: 20,
    height: 3,
    backgroundColor: COLORS.white,
    borderRadius: 2,
  },
  searchButton: {
    padding: SIZES.sm,
  },
  searchIcon: {
    fontSize: 22,
  },
  feedContainer: {
    flex: 1,
  },
});
