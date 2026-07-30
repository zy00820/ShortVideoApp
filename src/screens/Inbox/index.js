import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SIZES } from '../../constants';
import { mockMessages } from '../../data/mockData';
import { Avatar } from '../../components/Avatar';

export const InboxScreen = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState('messages');

  const tabs = [
    { id: 'messages', label: '消息' },
    { id: 'likes', label: '赞' },
    { id: 'comments', label: '评论' },
    { id: 'mentions', label: '@我' },
    { id: 'followers', label: '新粉丝' },
  ];

  const notificationItems = [
    { type: 'like', user: 'video_fan_99', text: '赞了你的视频', time: '5分钟前', unread: true },
    { type: 'comment', user: 'nice_person', text: '评论了你的视频', time: '1小时前', unread: true },
    { type: 'follow', user: 'new_follower', text: '开始关注你', time: '3小时前', unread: false },
    { type: 'mention', user: 'friend_user', text: '在视频中@了你', time: '昨天', unread: false },
  ];

  const getTabContent = () => {
    switch (activeTab) {
      case 'messages':
        return mockMessages.map((message) => (
          <TouchableOpacity
            key={message.id}
            style={styles.messageItem}
            onPress={() => navigation.navigate('Chat', { user: message })}
          >
            <View style={styles.avatarContainer}>
              <Avatar uri={message.avatar} size={48} />
              {message.unread > 0 && <View style={styles.unreadDot} />}
            </View>
            <View style={styles.messageContent}>
              <Text style={styles.messageUser}>{message.user}</Text>
              <Text style={styles.messageText} numberOfLines={1}>
                {message.lastMessage}
              </Text>
            </View>
            <View style={styles.messageMeta}>
              <Text style={styles.messageTime}>{message.time}</Text>
              {message.unread > 0 && (
                <View style={styles.unreadBadge}>
                  <Text style={styles.unreadText}>{message.unread}</Text>
                </View>
              )}
            </View>
          </TouchableOpacity>
        ));

      case 'likes':
      case 'comments':
      case 'mentions':
      case 'followers':
        return notificationItems
          .filter((item) => item.type === activeTab.replace('s', ''))
          .map((item, index) => (
            <View key={index} style={styles.notificationItem}>
              <Avatar
                uri={`https://i.pravatar.cc/150?u=${item.user}`}
                size={48}
              />
              <View style={styles.notificationContent}>
                <Text style={styles.notificationUser}>{item.user}</Text>
                <Text style={styles.notificationText}>{item.text}</Text>
                <Text style={styles.notificationTime}>{item.time}</Text>
              </View>
              {item.unread && <View style={styles.unreadDot} />}
            </View>
          ));

      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>通知</Text>
        <TouchableOpacity style={styles.settingsButton}>
          <Text style={styles.settingsIcon}>⚙️</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.tabsBar}
        contentContainerStyle={styles.tabsContent}
      >
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.id}
            onPress={() => setActiveTab(tab.id)}
            style={[styles.tabItem, activeTab === tab.id && styles.tabItemActive]}
          >
            <Text
              style={[styles.tabLabel, activeTab === tab.id && styles.tabLabelActive]}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {getTabContent()}
        <View style={styles.bottomSpacer} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SIZES.md,
    paddingVertical: SIZES.lg,
  },
  title: {
    color: COLORS.white,
    fontSize: SIZES.xl,
    fontWeight: '700',
  },
  settingsButton: {
    padding: SIZES.sm,
  },
  settingsIcon: {
    fontSize: 22,
  },
  tabsBar: {
    backgroundColor: COLORS.background,
  },
  tabsContent: {
    paddingHorizontal: SIZES.sm,
  },
  tabItem: {
    paddingHorizontal: SIZES.md,
    paddingVertical: SIZES.sm,
    marginRight: SIZES.sm,
    borderRadius: SIZES.lg,
    backgroundColor: COLORS.surface,
  },
  tabItemActive: {
    backgroundColor: COLORS.primary,
  },
  tabLabel: {
    color: COLORS.gray[400],
    fontSize: SIZES.caption,
    fontWeight: '600',
  },
  tabLabelActive: {
    color: COLORS.white,
  },
  content: {
    flex: 1,
  },
  messageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SIZES.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: COLORS.gray[800],
  },
  avatarContainer: {
    position: 'relative',
  },
  unreadDot: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.primary,
    borderWidth: 2,
    borderColor: COLORS.background,
  },
  messageContent: {
    flex: 1,
    marginLeft: SIZES.md,
  },
  messageUser: {
    color: COLORS.white,
    fontSize: SIZES.body,
    fontWeight: '600',
    marginBottom: 2,
  },
  messageText: {
    color: COLORS.gray[400],
    fontSize: SIZES.caption,
  },
  messageMeta: {
    alignItems: 'flex-end',
    gap: SIZES.xs,
  },
  messageTime: {
    color: COLORS.gray[500],
    fontSize: SIZES.small,
  },
  unreadBadge: {
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  unreadText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: 'bold',
  },
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SIZES.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: COLORS.gray[800],
    position: 'relative',
  },
  notificationContent: {
    flex: 1,
    marginLeft: SIZES.md,
  },
  notificationUser: {
    color: COLORS.white,
    fontSize: SIZES.body,
    fontWeight: '600',
  },
  notificationText: {
    color: COLORS.gray[300],
    fontSize: SIZES.caption,
    marginTop: 2,
  },
  notificationTime: {
    color: COLORS.gray[500],
    fontSize: SIZES.small,
    marginTop: SIZES.xs,
  },
  bottomSpacer: {
    height: 100,
  },
});
