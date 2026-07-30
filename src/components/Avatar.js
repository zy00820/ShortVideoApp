import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { SIZES, COLORS, FONTS } from '../constants';

export const Avatar = ({ uri, size = SIZES.avatarSize, showBorder = false, onPress }) => {
  const Component = onPress ? TouchableOpacity : View;

  return (
    <Component onPress={onPress} style={[styles.container, { width: size, height: size }]}>
      <Image
        source={{ uri }}
        style={[
          styles.image,
          { width: size, height: size, borderRadius: size / 2 },
          showBorder && styles.border,
        ]}
      />
    </Component>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
  image: {
    backgroundColor: COLORS.gray[300],
  },
  border: {
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
});

export const Badge = ({ count, max = 99 }) => {
  if (!count || count === 0) return null;
  return (
    <View style={styles.badgeContainer}>
      <Text style={styles.badgeText}>{count > max ? `${max}+` : count}</Text>
    </View>
  );
};

const styles2 = StyleSheet.create({
  badgeContainer: {
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

export const CountText = ({ count, style }) => {
  const formatCount = (n) => {
    if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
    if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
    return n.toString();
  };

  return (
    <Text style={[styles.countText, style]}>{formatCount(count)}</Text>
  );
};

const styles3 = StyleSheet.create({
  countText: {
    color: COLORS.white,
    fontSize: SIZES.sm,
    fontWeight: '600',
  },
});
