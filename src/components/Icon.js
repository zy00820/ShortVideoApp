import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SIZES, COLORS } from '../constants';

export const Icon = ({ name, size = 24, color = COLORS.white, style }) => {
  const icons = {
    home: '🏠',
    search: '🔍',
    upload: '➕',
    inbox: '📬',
    profile: '👤',
    heart: '❤️',
    heartOutline: '🤍',
    comment: '💬',
    share: '📤',
    bookmark: '🔖',
    bookmarkOutline: '📑',
    music: '🎵',
    play: '▶️',
    pause: '⏸️',
    camera: '📷',
    video: '🎥',
    close: '✕',
    send: '➤',
    more: '⋯',
    verified: '✓',
    back: '←',
    edit: '✏️',
    settings: '⚙️',
    bell: '🔔',
    mic: '🎤',
    image: '🖼️',
    chevronRight: '›',
    chevronLeft: '‹',
    fire: '🔥',
    star: '⭐',
    starOutline: '☆',
    eye: '👁️',
    eyeOff: '👁️‍🗨️',
  };

  return (
    <Text style={[styles.icon, { fontSize: size, color }, style]}>
      {icons[name] || '❓'}
    </Text>
  );
};

const styles = StyleSheet.create({
  icon: {
    textAlign: 'center',
  },
});

export const IconButton = ({ icon, onPress, size = 28, color = COLORS.white, badge, style }) => (
  <TouchableOpacity onPress={onPress} style={[styles.iconButton, style]}>
    <Icon name={icon} size={size} color={color} />
    {badge && badge > 0 && (
      <View style={styles.badge}>
        <Text style={styles.badgeText}>{badge > 99 ? '99+' : badge}</Text>
      </View>
    )}
  </TouchableOpacity>
);

const styles2 = StyleSheet.create({
  iconButton: {
    padding: SIZES.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: COLORS.primary,
    borderRadius: SIZES.sm,
    minWidth: SIZES.md,
    height: SIZES.md,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 2,
  },
  badgeText: {
    color: COLORS.white,
    fontSize: 10,
    fontWeight: 'bold',
  },
});
