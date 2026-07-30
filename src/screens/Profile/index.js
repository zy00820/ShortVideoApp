import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SIZES } from '../../constants';
import { useVideoStore } from '../../store/videoStore';
import { Avatar } from '../../components/Avatar';

const { width } = Dimensions.get('window');

export const ProfileScreen = ({ navigation, user: userProp }) => {
  const [activeTab, setActiveTab] = useState('videos');
  const { currentUser, followedUsers, toggleFollow, videos, savedVideos, likedVideos } = useVideoStore();

  const user = userProp || currentUser;
  const isOwnProfile = !userProp;
  const isFollowing = followedUsers.has(user.id);

  const userVideos = videos.filter((v) => v.author.id === user.id);
  const savedVideosList = videos.filter((v) => savedVideos.has(v.id));
  const likedVideosList = videos.filter((v) => likedVideos.has(v.id));

  const getVideoList = () => {
    switch (activeTab) {
      case 'videos':
        return userVideos;
      case 'saved':
        return savedVideosList;
      case 'liked':
        return likedVideosList;
      default:
        return userVideos;
    }
  };

  const tabs = [
    { id: 'videos', label: '作品', count: user.videos || 0 },
    { id: 'liked', label: '喜欢', count: user.likes || 0 },
    { id: 'saved', label: '收藏', count: savedVideosList.length },
  ];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        {userProp ? (
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerButton}>
            <Text style={styles.headerIcon}>←</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.headerButton} />
        )}
        <Text style={styles.headerTitle}>{user.nickname}</Text>
        <TouchableOpacity style={styles.headerButton}>
          <Text style={styles.headerIcon}>⋯</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.profileHeader}>
          <Avatar uri={user.avatar} size={96} showBorder />
          <Text style={styles.nickname}>{user.nickname}</Text>
          <Text style={styles.username}>@{user.username}</Text>
          <Text style={styles.bio}>{user.bio || '欢迎关注我的账号 ❤️'}</Text>

          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{user.following || 0}</Text>
              <Text style={styles.statLabel}>关注</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{user.followers || 0}</Text>
              <Text style={styles.statLabel}>粉丝</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{user.likes || 0}</Text>
              <Text style={styles.statLabel}>获赞</Text>
            </View>
          </View>

          <View style={styles.actionButtons}>
            {isOwnProfile ? (
              <>
                <TouchableOpacity style={styles.editButton}>
                  <Text style={styles.editButtonText}>编辑资料</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.shareButton}>
                  <Text style={styles.shareButtonText}>分享主页</Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <TouchableOpacity
                  style={[styles.followButton, isFollowing && styles.followingButton]}
                  onPress={() => toggleFollow(user.id)}
                >
                  <Text style={[styles.followButtonText, isFollowing && styles.followingText]}>
                    {isFollowing ? '已关注' : '关注'}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.messageButton}>
                  <Text style={styles.messageButtonText}>私信</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>

        <View style={styles.tabsBar}>
          {tabs.map((tab) => (
            <TouchableOpacity
              key={tab.id}
              onPress={() => setActiveTab(tab.id)}
              style={styles.tabItem}
            >
              <Text
                style={[styles.tabLabel, activeTab === tab.id && styles.tabLabelActive]}
              >
                {tab.label}
              </Text>
              {activeTab === tab.id && <View style={styles.tabIndicator} />}
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.videoGrid}>
          {getVideoList().map((video) => (
            <TouchableOpacity
              key={video.id}
              style={styles.videoCard}
              onPress={() => navigation.navigate('VideoDetail', { video })}
            >
              <View style={styles.videoThumbnail}>
                <Text style={styles.thumbnailIcon}>🎬</Text>
              </View>
              <View style={styles.videoFooter}>
                <Text style={styles.videoTitle} numberOfLines={1}>
                  {video.title}
                </Text>
                <View style={styles.videoStats}>
                  <Text style={styles.videoLikes}>❤️ {(video.stats.likes / 1000).toFixed(1)}K</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
          {getVideoList().length === 0 && (
            <View style={styles.emptyState}>
              <Text style={styles.emptyIcon}>📹</Text>
              <Text style={styles.emptyText}>
                {activeTab === 'videos'
                  ? '暂无作品'
                  : activeTab === 'liked'
                  ? '还没有喜欢的视频'
                  : '还没有收藏的视频'}
              </Text>
            </View>
          )}
        </View>

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
    paddingVertical: SIZES.md,
  },
  headerButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerIcon: {
    fontSize: 22,
    color: COLORS.white,
  },
  headerTitle: {
    color: COLORS.white,
    fontSize: SIZES.body,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  profileHeader: {
    alignItems: 'center',
    paddingHorizontal: SIZES.lg,
    paddingVertical: SIZES.md,
  },
  nickname: {
    color: COLORS.white,
    fontSize: SIZES.xxl,
    fontWeight: '700',
    marginTop: SIZES.md,
  },
  username: {
    color: COLORS.gray[400],
    fontSize: SIZES.caption,
    marginTop: 2,
  },
  bio: {
    color: COLORS.gray[300],
    fontSize: SIZES.body,
    textAlign: 'center',
    lineHeight: 22,
    marginTop: SIZES.sm,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SIZES.lg,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    color: COLORS.white,
    fontSize: SIZES.xl,
    fontWeight: '700',
  },
  statLabel: {
    color: COLORS.gray[400],
    fontSize: SIZES.caption,
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: COLORS.gray[700],
  },
  actionButtons: {
    flexDirection: 'row',
    gap: SIZES.md,
    marginTop: SIZES.lg,
    width: '100%',
    paddingHorizontal: SIZES.lg,
  },
  editButton: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.lg,
    paddingVertical: SIZES.sm,
    alignItems: 'center',
  },
  editButtonText: {
    color: COLORS.white,
    fontSize: SIZES.caption,
    fontWeight: '600',
  },
  shareButton: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.lg,
    paddingVertical: SIZES.sm,
    alignItems: 'center',
  },
  shareButtonText: {
    color: COLORS.white,
    fontSize: SIZES.caption,
    fontWeight: '600',
  },
  followButton: {
    flex: 1,
    backgroundColor: COLORS.primary,
    borderRadius: SIZES.lg,
    paddingVertical: SIZES.sm,
    alignItems: 'center',
  },
  followingButton: {
    backgroundColor: COLORS.surface,
  },
  followButtonText: {
    color: COLORS.white,
    fontSize: SIZES.caption,
    fontWeight: '700',
  },
  followingText: {
    color: COLORS.gray[300],
  },
  messageButton: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.lg,
    paddingVertical: SIZES.sm,
    alignItems: 'center',
  },
  messageButtonText: {
    color: COLORS.white,
    fontSize: SIZES.caption,
    fontWeight: '600',
  },
  tabsBar: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: COLORS.gray[800],
    paddingVertical: SIZES.sm,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: SIZES.sm,
  },
  tabLabel: {
    color: COLORS.gray[500],
    fontSize: SIZES.caption,
    fontWeight: '600',
  },
  tabLabelActive: {
    color: COLORS.white,
  },
  tabIndicator: {
    position: 'absolute',
    bottom: 0,
    width: 24,
    height: 3,
    backgroundColor: COLORS.white,
    borderRadius: 2,
  },
  videoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: SIZES.sm,
  },
  videoCard: {
    width: (width - SIZES.sm * 4) / 2,
    margin: SIZES.sm,
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.md,
    overflow: 'hidden',
  },
  videoThumbnail: {
    width: '100%',
    height: 220,
    backgroundColor: COLORS.gray[800],
    alignItems: 'center',
    justifyContent: 'center',
  },
  thumbnailIcon: {
    fontSize: 48,
  },
  videoFooter: {
    padding: SIZES.sm,
  },
  videoTitle: {
    color: COLORS.white,
    fontSize: SIZES.small,
    fontWeight: '600',
  },
  videoStats: {
    marginTop: 4,
  },
  videoLikes: {
    color: COLORS.gray[400],
    fontSize: SIZES.small,
  },
  emptyState: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: SIZES.xxl,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: SIZES.md,
  },
  emptyText: {
    color: COLORS.gray[500],
    fontSize: SIZES.body,
  },
  bottomSpacer: {
    height: 100,
  },
});
