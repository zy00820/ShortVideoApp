import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, FlatList, TextInput, Dimensions } from 'react-native';
import { SIZES, COLORS, FONTS } from '../constants';
import { Avatar } from './Avatar';
import { Icon } from './Icon';

const { height: WINDOW_HEIGHT } = Dimensions.get('window');

export const CommentSheet = ({ visible, onClose, video, onAddComment, onLikeComment }) => {
  const [commentText, setCommentText] = useState('');
  const comments = video?.comments || [];

  const handleSubmit = () => {
    if (!commentText.trim()) return;
    onAddComment({
      user: 'my_account',
      text: commentText.trim(),
      time: '刚刚',
      likes: 0,
    });
    setCommentText('');
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>评论</Text>
            <Text style={styles.count}>{comments.length}</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Icon name="close" size={22} color={COLORS.white} />
            </TouchableOpacity>
          </View>

          <FlatList
            data={comments}
            keyExtractor={(item) => item.id}
            style={styles.commentsList}
            contentContainerStyle={styles.commentsContent}
            renderItem={({ item }) => (
              <View style={styles.commentItem}>
                <Avatar
                  uri={`https://i.pravatar.cc/150?u=${item.user}`}
                  size={36}
                />
                <View style={styles.commentContent}>
                  <Text style={styles.commentUser}>{item.user}</Text>
                  <Text style={styles.commentText}>{item.text}</Text>
                  <View style={styles.commentMeta}>
                    <Text style={styles.commentTime}>{item.time}</Text>
                    <TouchableOpacity onPress={() => onLikeComment?.(item.id)} style={styles.likeButton}>
                      <Text style={styles.likeIcon}>🤍</Text>
                      <Text style={styles.likeCount}>{item.likes || 0}</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            )}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>暂无评论，快来抢沙发！</Text>
              </View>
            }
          />

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="添加评论..."
              placeholderTextColor={COLORS.gray[500]}
              value={commentText}
              onChangeTextChange={setCommentText}
              multiline
            />
            <TouchableOpacity
              onPress={handleSubmit}
              style={[styles.sendButton, !commentText.trim() && styles.sendButtonDisabled]}
              disabled={!commentText.trim()}
            >
              <Text style={styles.sendText}>发送</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: COLORS.overlay,
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: COLORS.surface,
    height: WINDOW_HEIGHT * 0.75,
    borderTopLeftRadius: SIZES.xl,
    borderTopRightRadius: SIZES.xl,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SIZES.md,
    paddingVertical: SIZES.lg,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: COLORS.gray[700],
  },
  title: {
    color: COLORS.white,
    fontSize: SIZES.lg,
    fontWeight: '700',
  },
  count: {
    color: COLORS.gray[400],
    fontSize: SIZES.md,
    marginLeft: SIZES.sm,
  },
  closeButton: {
    position: 'absolute',
    right: SIZES.md,
    padding: SIZES.sm,
  },
  commentsList: {
    flex: 1,
  },
  commentsContent: {
    paddingVertical: SIZES.md,
  },
  commentItem: {
    flexDirection: 'row',
    paddingHorizontal: SIZES.md,
    paddingVertical: SIZES.md,
  },
  commentContent: {
    flex: 1,
    marginLeft: SIZES.md,
  },
  commentUser: {
    color: COLORS.gray[400],
    fontSize: SIZES.caption,
    fontWeight: '600',
    marginBottom: 2,
  },
  commentText: {
    color: COLORS.white,
    fontSize: SIZES.body,
    lineHeight: 22,
  },
  commentMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SIZES.xs,
  },
  commentTime: {
    color: COLORS.gray[500],
    fontSize: SIZES.small,
    marginRight: SIZES.lg,
  },
  likeButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  likeIcon: {
    fontSize: 16,
    marginRight: 4,
  },
  likeCount: {
    color: COLORS.gray[400],
    fontSize: SIZES.small,
  },
  emptyContainer: {
    padding: SIZES.xxl,
    alignItems: 'center',
  },
  emptyText: {
    color: COLORS.gray[500],
    fontSize: SIZES.body,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SIZES.md,
    paddingVertical: SIZES.sm,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: COLORS.gray[700],
    backgroundColor: COLORS.surface,
  },
  input: {
    flex: 1,
    backgroundColor: COLORS.gray[800],
    borderRadius: SIZES.xl,
    paddingHorizontal: SIZES.lg,
    paddingVertical: SIZES.sm,
    color: COLORS.white,
    fontSize: SIZES.body,
    maxHeight: 100,
  },
  sendButton: {
    marginLeft: SIZES.sm,
    backgroundColor: COLORS.primary,
    borderRadius: SIZES.xl,
    paddingHorizontal: SIZES.lg,
    paddingVertical: SIZES.sm,
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
  sendText: {
    color: COLORS.white,
    fontSize: SIZES.caption,
    fontWeight: '600',
  },
});
