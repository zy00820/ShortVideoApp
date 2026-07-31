import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SIZES } from '../../constants';
import { useVideoStore } from '../../store/videoStore';
import { Avatar } from '../../components/Avatar';
import * as ImagePicker from 'expo-image-picker';

const { width } = Dimensions.get('window');

export const EditProfileScreen = ({ navigation }) => {
  const { currentUser, updateUser } = useVideoStore();
  const [nickname, setNickname] = useState(currentUser.nickname);
  const [bio, setBio] = useState(currentUser.bio || '');
  const [avatar, setAvatar] = useState(currentUser.avatar);
  const [loading, setLoading] = useState(false);

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled) {
        setAvatar(result.uri);
      }
    } catch (error) {
      Alert.alert('错误', '选择图片失败');
    }
  };

  const validateNickname = (name) => {
    if (!name.trim()) {
      return '昵称不能为空';
    }
    if (name.length > 20) {
      return '昵称不能超过20个字符';
    }
    return null;
  };

  const handleSave = async () => {
    const error = validateNickname(nickname);
    if (error) {
      Alert.alert('提示', error);
      return;
    }

    setLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 500));

      updateUser({
        nickname: nickname.trim(),
        bio: bio.trim(),
        avatar,
      });

      Alert.alert('成功', '资料更新成功', [
        { text: '确定', onPress: () => navigation.goBack() },
      ]);
    } catch (err) {
      Alert.alert('错误', '保存失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.headerButton}
          disabled={loading}
        >
          <Text style={styles.headerIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>编辑资料</Text>
        <TouchableOpacity
          onPress={handleSave}
          style={styles.saveButton}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={COLORS.primary} size="small" />
          ) : (
            <Text style={styles.saveButtonText}>保存</Text>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.avatarSection}>
          <TouchableOpacity
            onPress={pickImage}
            style={styles.avatarContainer}
            disabled={loading}
          >
            <Avatar uri={avatar} size={96} showBorder />
            <View style={styles.avatarBadge}>
              <Text style={styles.avatarBadgeText}>📷</Text>
            </View>
          </TouchableOpacity>
          <Text style={styles.changeAvatarText}>点击更换头像</Text>
        </View>

        <View style={styles.formSection}>
          <View style={styles.formItem}>
            <Text style={styles.label}>昵称</Text>
            <TextInput
              style={styles.input}
              value={nickname}
              onChangeText={setNickname}
              placeholder="请输入昵称"
              placeholderTextColor={COLORS.gray[500]}
              maxLength={20}
              editable={!loading}
            />
            <Text style={styles.charCount}>{nickname.length}/20</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.formItem}>
            <Text style={styles.label}>简介</Text>
            <TextInput
              style={[styles.input, styles.multilineInput]}
              value={bio}
              onChangeText={setBio}
              placeholder="介绍一下自己吧..."
              placeholderTextColor={COLORS.gray[500]}
              maxLength={100}
              multiline
              numberOfLines={4}
              editable={!loading}
            />
            <Text style={styles.charCount}>{bio.length}/100</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.formItem}>
            <Text style={styles.label}>用户名</Text>
            <Text style={styles.disabledText}>@{currentUser.username}</Text>
            <Text style={styles.hint}>用户名不可修改</Text>
          </View>
        </View>

        <View style={styles.tipsSection}>
          <Text style={styles.tipsTitle}>修改提示</Text>
          <Text style={styles.tipsText}>• 昵称支持中文、英文、数字</Text>
          <Text style={styles.tipsText}>• 头像建议使用正方形图片</Text>
          <Text style={styles.tipsText}>• 简介可以让别人更好地了解你</Text>
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
  saveButton: {
    paddingHorizontal: SIZES.md,
    paddingVertical: SIZES.sm,
  },
  saveButtonText: {
    color: COLORS.primary,
    fontSize: SIZES.body,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  avatarSection: {
    alignItems: 'center',
    paddingVertical: SIZES.xl,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatarBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    backgroundColor: COLORS.primary,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: COLORS.background,
  },
  avatarBadgeText: {
    fontSize: 16,
  },
  changeAvatarText: {
    color: COLORS.primary,
    fontSize: SIZES.body,
    marginTop: SIZES.md,
  },
  formSection: {
    backgroundColor: COLORS.surface,
    marginHorizontal: SIZES.md,
    borderRadius: SIZES.md,
    paddingHorizontal: SIZES.md,
  },
  formItem: {
    paddingVertical: SIZES.md,
  },
  label: {
    color: COLORS.gray[400],
    fontSize: SIZES.caption,
    marginBottom: SIZES.sm,
  },
  input: {
    color: COLORS.white,
    fontSize: SIZES.body,
    backgroundColor: COLORS.gray[800],
    borderRadius: SIZES.sm,
    paddingHorizontal: SIZES.md,
    paddingVertical: SIZES.sm,
  },
  multilineInput: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  disabledText: {
    color: COLORS.gray[500],
    fontSize: SIZES.body,
    paddingHorizontal: SIZES.md,
    paddingVertical: SIZES.sm,
    backgroundColor: COLORS.gray[800],
    borderRadius: SIZES.sm,
  },
  hint: {
    color: COLORS.gray[500],
    fontSize: SIZES.small,
    marginTop: SIZES.sm,
  },
  charCount: {
    color: COLORS.gray[500],
    fontSize: SIZES.small,
    textAlign: 'right',
    marginTop: SIZES.sm,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.gray[800],
  },
  tipsSection: {
    marginHorizontal: SIZES.md,
    marginTop: SIZES.lg,
    padding: SIZES.md,
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.md,
  },
  tipsTitle: {
    color: COLORS.white,
    fontSize: SIZES.caption,
    fontWeight: '600',
    marginBottom: SIZES.sm,
  },
  tipsText: {
    color: COLORS.gray[500],
    fontSize: SIZES.small,
    lineHeight: 20,
  },
});
