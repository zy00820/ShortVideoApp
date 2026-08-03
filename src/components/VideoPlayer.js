import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Animated } from 'react-native';
import { Video } from 'expo-av';
import { SIZES, COLORS } from '../constants';
import { Icon } from './Icon';
import { Avatar } from './Avatar';

const { width: WINDOW_WIDTH, height: WINDOW_HEIGHT } = Dimensions.get('window');

export const VideoPlayer = ({ video, isActive, onLike, onComment, onShare, onProfilePress, onFollow, isLiked, isSaved, isFollowing }) => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [showControls, setShowControls] = useState(false);
  const [showHeart, setShowHeart] = useState(false);
  const [showFollowTip, setShowFollowTip] = useState(false);
  const followScale = useRef(new Animated.Value(1)).current;

  const togglePlay = () => {
    if (isPlaying) {
      videoRef.current?.pauseAsync();
    } else {
      videoRef.current?.playAsync();
    }
    setIsPlaying(!isPlaying);
  };

  const handleDoubleTap = () => {
    setShowHeart(true);
    onLike?.();
    setTimeout(() => setShowHeart(false), 500);
  };

  const toggleControls = () => {
    setShowControls(!showControls);
  };

  const handleFollow = () => {
    Animated.sequence([
      Animated.spring(followScale, {
        toValue: 1.3,
        useNativeDriver: true,
        speed: 40,
        bounciness: 4,
      }),
      Animated.spring(followScale, {
        toValue: 1,
        useNativeDriver: true,
      }),
    ]).start();

    setShowFollowTip(true);
    setTimeout(() => setShowFollowTip(false), 1500);
    onFollow?.();
  };

  const formatCount = (n) => {
    if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
    if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
    return n.toString();
  };

  return (
    <TouchableOpacity
      style={styles.container}
      activeOpacity={1}
      onPress={toggleControls}
      onLongPress={handleDoubleTap}
    >
      <Video
        ref={videoRef}
        source={{ uri: video.url }}
        style={styles.video}
        resizeMode="cover"
        shouldPlay={isActive && isPlaying}
        isLooping
        onPlaybackStatusUpdate={(status) => {
          if (status.didJustFinish) {
            videoRef.current?.playAsync();
          }
        }}
      />

      {showHeart && (
        <View style={styles.heartOverlay}>
          <Text style={styles.heartText}>❤️</Text>
        </View>
      )}

      {showFollowTip && (
        <View style={styles.followTip}>
          <Text style={styles.followTipText}>{isFollowing ? '已关注' : '关注成功'}</Text>
        </View>
      )}

      {showControls && (
        <View style={styles.playButtonOverlay}>
          <TouchableOpacity onPress={togglePlay}>
            <Text style={styles.playIcon}>{isPlaying ? '⏸️' : '▶️'}</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.topBar}>
        <View style={styles.topTabs}>
          <Text style={styles.topTab}>关注</Text>
          <Text style={[styles.topTab, styles.topTabActive]}>推荐</Text>
          <Text style={styles.topTab}>同城</Text>
        </View>
      </View>

      <View style={styles.bottomInfo}>
        <View style={styles.textInfo}>
          <Text style={styles.username}>@{video.author.username}</Text>
          <Text style={styles.description}>{video.title}</Text>
          {video.music && (
            <View style={styles.musicRow}>
              <Text style={styles.musicIcon}>🎵</Text>
              <Text style={styles.musicText}>{video.music.title} - {video.music.artist}</Text>
            </View>
          )}
        </View>

        <View style={styles.sideActions}>
          <View style={styles.avatarContainer}>
            <TouchableOpacity onPress={onProfilePress}>
              <Avatar uri={video.author.avatar} size={48} />
            </TouchableOpacity>
            <Animated.View style={{ transform: [{ scale: followScale }] }}>
              <TouchableOpacity
                onPress={handleFollow}
                style={[styles.followButton, isFollowing && styles.followButtonActive]}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Text style={styles.followText}>{isFollowing ? '✓' : '+'}</Text>
              </TouchableOpacity>
            </Animated.View>
          </View>

          <TouchableOpacity onPress={onLike} style={styles.actionButton}>
            <Text style={styles.actionIcon}>{isLiked ? '❤️' : '🤍'}</Text>
            <Text style={styles.actionText}>{formatCount(video.stats.likes)}</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={onComment} style={styles.actionButton}>
            <Text style={styles.actionIcon}>💬</Text>
            <Text style={styles.actionText}>{formatCount(video.stats.comments)}</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={onShare} style={styles.actionButton}>
            <Text style={styles.actionIcon}>📤</Text>
            <Text style={styles.actionText}>{formatCount(video.stats.shares)}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionIcon}>{isSaved ? '🔖' : '📑'}</Text>
            <Text style={styles.actionText}>{formatCount(video.stats.views)}</Text>
          </TouchableOpacity>

          <View style={styles.rotatingDisc}>
            <Text style={styles.discIcon}>🎵</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: WINDOW_WIDTH,
    height: WINDOW_HEIGHT,
    backgroundColor: COLORS.black,
  },
  video: {
    width: '100%',
    height: '100%',
  },
  heartOverlay: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -50 }, { translateY: -50 }],
    zIndex: 100,
  },
  heartText: {
    fontSize: 120,
    color: COLORS.primary,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  followTip: {
    position: 'absolute',
    top: '45%',
    left: '50%',
    transform: [{ translateX: -50 }],
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    zIndex: 100,
  },
  followTipText: {
    color: COLORS.white,
    fontSize: SIZES.body,
    fontWeight: '600',
  },
  playButtonOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 50,
  },
  playIcon: {
    fontSize: 80,
    color: 'rgba(255,255,255,0.7)',
  },
  topBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingTop: 60,
    zIndex: 10,
  },
  topTabs: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: SIZES.xl,
  },
  topTab: {
    fontSize: SIZES.md,
    color: COLORS.gray[400],
    fontWeight: '600',
    paddingBottom: SIZES.sm,
  },
  topTabActive: {
    color: COLORS.white,
    borderBottomWidth: 3,
    borderBottomColor: COLORS.white,
  },
  bottomInfo: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: SIZES.md,
    paddingBottom: SIZES.xl,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    zIndex: 10,
  },
  textInfo: {
    flex: 1,
    marginRight: SIZES.md,
  },
  username: {
    color: COLORS.white,
    fontSize: SIZES.lg,
    fontWeight: '700',
    marginBottom: SIZES.sm,
  },
  description: {
    color: COLORS.white,
    fontSize: SIZES.body,
    marginBottom: SIZES.sm,
    lineHeight: 22,
  },
  musicRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SIZES.xs,
  },
  musicIcon: {
    fontSize: SIZES.md,
    marginRight: SIZES.xs,
  },
  musicText: {
    color: COLORS.white,
    fontSize: SIZES.caption,
  },
  sideActions: {
    alignItems: 'center',
    gap: SIZES.lg,
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: SIZES.sm,
  },
  followButton: {
    position: 'absolute',
    bottom: -8,
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  followButtonActive: {
    backgroundColor: COLORS.gray[500],
  },
  followText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: 'bold',
  },
  actionButton: {
    alignItems: 'center',
  },
  actionIcon: {
    fontSize: 36,
    marginBottom: SIZES.xs,
  },
  actionText: {
    color: COLORS.white,
    fontSize: SIZES.sm,
    fontWeight: '600',
  },
  rotatingDisc: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.black,
    borderWidth: 3,
    borderColor: COLORS.gray[700],
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: SIZES.sm,
  },
  discIcon: {
    fontSize: 20,
  },
});
