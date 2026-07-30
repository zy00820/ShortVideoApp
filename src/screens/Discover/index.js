import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SIZES } from '../../constants';
import { mockDiscoverTopics, mockVideos } from '../../data/mockData';
import { Avatar } from '../../components/Avatar';

const { width } = Dimensions.get('window');

export const DiscoverScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('forYou');

  const categories = [
    { id: 'forYou', label: '为你推荐' },
    { id: 'hot', label: '热门' },
    { id: 'follow', label: '关注' },
  ];

  const filteredVideos = searchQuery
    ? mockVideos.filter(
        (v) =>
          v.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          v.author.username.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : mockVideos;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <View style={styles.searchBar}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="搜索用户、视频、话题"
            placeholderTextColor={COLORS.gray[500]}
            value={searchQuery}
            onChangeTextChange={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Text style={styles.clearIcon}>✕</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.content}>
        <View style={styles.categories}>
          {categories.map((cat) => (
            <TouchableOpacity
              key={cat.id}
              onPress={() => setActiveCategory(cat.id)}
              style={[
                styles.categoryItem,
                activeCategory === cat.id && styles.categoryItemActive,
              ]}
            >
              <Text
                style={[
                  styles.categoryLabel,
                  activeCategory === cat.id && styles.categoryLabelActive,
                ]}
              >
                {cat.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {searchQuery.length === 0 && (
          <View style={styles.topicsSection}>
            <Text style={styles.sectionTitle}>热门话题</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.topicsScroll}>
              {mockDiscoverTopics.map((topic) => (
                <TouchableOpacity key={topic.id} style={styles.topicCard}>
                  <Text style={styles.topicIcon}>🔥</Text>
                  <Text style={styles.topicTag}>{topic.tag}</Text>
                  <Text style={styles.topicCount}>
                    {(topic.videoCount / 10000).toFixed(1)}w 视频
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        <View style={styles.gridSection}>
          <Text style={styles.sectionTitle}>
            {searchQuery ? '搜索结果' : '发现精彩'}
          </Text>
          <View style={styles.videoGrid}>
            {filteredVideos.map((video) => (
              <TouchableOpacity
                key={video.id}
                style={styles.videoCard}
                onPress={() => navigation.navigate('VideoDetail', { video })}
              >
                <View style={styles.videoThumbnail}>
                  <Text style={styles.thumbnailIcon}>🎬</Text>
                </View>
                <View style={styles.videoInfo}>
                  <Text style={styles.videoTitle} numberOfLines={2}>
                    {video.title}
                  </Text>
                  <View style={styles.videoMeta}>
                    <Avatar uri={video.author.avatar} size={20} />
                    <Text style={styles.videoAuthor}>{video.author.username}</Text>
                    <Text style={styles.videoLikes}>❤️ {(video.stats.likes / 1000).toFixed(1)}K</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.usersSection}>
          <Text style={styles.sectionTitle}>推荐用户</Text>
          {mockVideos.slice(0, 3).map((video) => (
            <TouchableOpacity
              key={video.author.id}
              style={styles.userCard}
              onPress={() => navigation.navigate('UserProfile', { user: video.author })}
            >
              <Avatar uri={video.author.avatar} size={48} showBorder />
              <View style={styles.userInfo}>
                <Text style={styles.userName}>{video.author.nickname}</Text>
                <Text style={styles.userHandle}>@{video.author.username}</Text>
                <Text style={styles.userFollowers}>
                  {video.author.followers.toLocaleString()} 粉丝
                </Text>
              </View>
              <TouchableOpacity style={styles.followButton}>
                <Text style={styles.followButtonText}>关注</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          ))}
        </View>
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
    paddingHorizontal: SIZES.md,
    paddingVertical: SIZES.sm,
    backgroundColor: COLORS.background,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.xl,
    paddingHorizontal: SIZES.md,
    paddingVertical: SIZES.sm,
  },
  searchIcon: {
    fontSize: 18,
    marginRight: SIZES.sm,
  },
  searchInput: {
    flex: 1,
    color: COLORS.white,
    fontSize: SIZES.body,
  },
  clearIcon: {
    color: COLORS.gray[400],
    fontSize: SIZES.md,
    paddingHorizontal: SIZES.sm,
  },
  content: {
    flex: 1,
  },
  categories: {
    flexDirection: 'row',
    paddingHorizontal: SIZES.md,
    paddingVertical: SIZES.sm,
    gap: SIZES.md,
  },
  categoryItem: {
    paddingHorizontal: SIZES.md,
    paddingVertical: SIZES.sm,
    borderRadius: SIZES.lg,
    backgroundColor: COLORS.surface,
  },
  categoryItemActive: {
    backgroundColor: COLORS.primary,
  },
  categoryLabel: {
    color: COLORS.gray[300],
    fontSize: SIZES.caption,
    fontWeight: '600',
  },
  categoryLabelActive: {
    color: COLORS.white,
  },
  topicsSection: {
    marginTop: SIZES.sm,
  },
  sectionTitle: {
    color: COLORS.white,
    fontSize: SIZES.lg,
    fontWeight: '700',
    paddingHorizontal: SIZES.md,
    marginBottom: SIZES.sm,
    marginTop: SIZES.lg,
  },
  topicsScroll: {
    paddingHorizontal: SIZES.md,
  },
  topicCard: {
    width: 140,
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.md,
    padding: SIZES.md,
    marginRight: SIZES.sm,
    alignItems: 'center',
  },
  topicIcon: {
    fontSize: 28,
    marginBottom: SIZES.xs,
  },
  topicTag: {
    color: COLORS.white,
    fontSize: SIZES.body,
    fontWeight: '700',
    marginBottom: SIZES.xs,
  },
  topicCount: {
    color: COLORS.gray[400],
    fontSize: SIZES.small,
  },
  gridSection: {
    marginTop: SIZES.sm,
  },
  videoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: SIZES.sm,
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
    height: 200,
    backgroundColor: COLORS.gray[800],
    alignItems: 'center',
    justifyContent: 'center',
  },
  thumbnailIcon: {
    fontSize: 48,
  },
  videoInfo: {
    padding: SIZES.sm,
  },
  videoTitle: {
    color: COLORS.white,
    fontSize: SIZES.caption,
    fontWeight: '600',
    lineHeight: 18,
  },
  videoMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SIZES.xs,
    gap: SIZES.xs,
  },
  videoAuthor: {
    color: COLORS.gray[400],
    fontSize: SIZES.small,
    flex: 1,
  },
  videoLikes: {
    color: COLORS.gray[400],
    fontSize: SIZES.small,
  },
  usersSection: {
    paddingBottom: SIZES.xxl,
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SIZES.md,
    marginHorizontal: SIZES.md,
    marginBottom: SIZES.sm,
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.md,
  },
  userInfo: {
    flex: 1,
    marginLeft: SIZES.md,
  },
  userName: {
    color: COLORS.white,
    fontSize: SIZES.body,
    fontWeight: '700',
  },
  userHandle: {
    color: COLORS.gray[400],
    fontSize: SIZES.small,
  },
  userFollowers: {
    color: COLORS.gray[500],
    fontSize: SIZES.small,
    marginTop: 2,
  },
  followButton: {
    backgroundColor: COLORS.primary,
    borderRadius: SIZES.lg,
    paddingHorizontal: SIZES.lg,
    paddingVertical: SIZES.sm,
  },
  followButtonText: {
    color: COLORS.white,
    fontSize: SIZES.caption,
    fontWeight: '700',
  },
});
