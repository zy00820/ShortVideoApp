import React, { useState } from 'react';
import { View, StyleSheet, Dimensions, FlatList, StatusBar } from 'react-native';
import { VideoPlayer } from '../../components/VideoPlayer';
import { CommentSheet } from '../../components/CommentSheet';
import { useVideoStore } from '../../store/videoStore';
import { COLORS } from '../../constants';

const { width: WINDOW_WIDTH, height: WINDOW_HEIGHT } = Dimensions.get('window');

export const FeedScreen = ({ onNavigateToProfile }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [showComments, setShowComments] = useState(false);
  const [currentVideo, setCurrentVideo] = useState(null);

  const {
    videos,
    likedVideos,
    savedVideos,
    followedUsers,
    toggleLike,
    toggleSave,
    toggleFollow,
    addComment,
  } = useVideoStore();

  const openComments = (video) => {
    setCurrentVideo(video);
    setShowComments(true);
  };

  const handleLike = (videoId) => {
    toggleLike(videoId);
  };

  const handleShare = () => {
    alert('分享功能：可分享至微信、QQ、朋友圈等');
  };

  const renderItem = ({ item, index }) => (
    <VideoPlayer
      video={item}
      isActive={index === activeIndex}
      isLiked={likedVideos.has(item.id)}
      isSaved={savedVideos.has(item.id)}
      isFollowing={followedUsers.has(item.author.id)}
      onLike={() => handleLike(item.id)}
      onComment={() => openComments(item)}
      onShare={handleShare}
      onProfilePress={() => onNavigateToProfile(item.author)}
    />
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.black} />
      <FlatList
        data={videos}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        pagingEnabled
        showsVerticalScrollIndicator={false}
        onMomentumScrollEnd={(e) => {
          const newIndex = Math.round(e.nativeEvent.contentOffset.y / WINDOW_HEIGHT);
          setActiveIndex(newIndex);
        }}
        snapToInterval={WINDOW_HEIGHT}
        snapToAlignment="start"
        decelerationRate="fast"
        getItemLayout={(data, index) => ({
          length: WINDOW_HEIGHT,
          offset: WINDOW_HEIGHT * index,
          index,
        })}
      />

      <CommentSheet
        visible={showComments}
        onClose={() => setShowComments(false)}
        video={currentVideo}
        onAddComment={(text) => {
          if (currentVideo) {
            addComment(currentVideo.id, text);
          }
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.black,
  },
});
