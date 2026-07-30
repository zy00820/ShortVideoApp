import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, ScrollView, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Camera } from 'expo-camera';
import { Video } from 'expo-av';
import * as MediaLibrary from 'expo-media-library';
import { COLORS, SIZES } from '../../constants';
import { useVideoStore } from '../../store/videoStore';

const { width } = Dimensions.get('window');

export const UploadScreen = ({ navigation }) => {
  const [hasPermission, setHasPermission] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordMode, setRecordMode] = useState('video');
  const [recordTime, setRecordTime] = useState(0);
  const [videoUri, setVideoUri] = useState(null);
  const [caption, setCaption] = useState('');
  const [description, setDescription] = useState('');
  const [selectedMusic, setSelectedMusic] = useState(null);
  const [selectedEffect, setSelectedEffect] = useState(null);
  const cameraRef = useRef(null);
  const recordingTimer = useRef(null);

  const { addVideo, currentUser } = useVideoStore();

  const requestCameraPermission = async () => {
    const { status } = await Camera.requestCameraPermissionsAsync();
    setHasPermission(status === 'granted');
  };

  const startRecording = async () => {
    if (!cameraRef.current) return;
    try {
      setIsRecording(true);
      setRecordTime(0);
      recordingTimer.current = setInterval(() => {
        setRecordTime((prev) => {
          if (prev >= 60) {
            stopRecording();
            return 60;
          }
          return prev + 1;
        });
      }, 1000);

      const video = await cameraRef.current.recordAsync({
        maxDuration: 60,
        quality: '720p',
      });
      setVideoUri(video.uri);
    } catch (error) {
      console.error('Recording error:', error);
    }
  };

  const stopRecording = () => {
    setIsRecording(false);
    if (recordingTimer.current) {
      clearInterval(recordingTimer.current);
    }
    if (cameraRef.current) {
      cameraRef.current.stopRecording();
    }
  };

  const resetRecording = () => {
    setVideoUri(null);
    setRecordTime(0);
    setIsRecording(false);
    setCaption('');
    setDescription('');
    setSelectedMusic(null);
    setSelectedEffect(null);
  };

  const publishVideo = () => {
    if (!videoUri) {
      Alert.alert('提示', '请先录制或选择一个视频');
      return;
    }
    if (!caption.trim()) {
      Alert.alert('提示', '请输入视频标题');
      return;
    }

    const newVideo = {
      id: `new_${Date.now()}`,
      url: videoUri,
      title: caption,
      description,
      author: {
        id: currentUser.id,
        username: currentUser.username,
        nickname: currentUser.nickname,
        avatar: currentUser.avatar,
        followers: currentUser.followers,
        following: currentUser.following,
        likes: currentUser.likes,
      },
      stats: {
        likes: 0,
        comments: 0,
        shares: 0,
        views: 0,
      },
      music: selectedMusic,
      comments: [],
      liked: false,
      saved: false,
      createdAt: new Date().toISOString(),
    };

    addVideo(newVideo);
    Alert.alert('成功', '视频已发布！', [
      {
        text: '好的',
        onPress: () => {
          resetRecording();
          navigation.navigate('Home');
        },
      },
    ]);
  };

  const musicOptions = [
    { id: 'm1', title: '热门音乐', artist: 'Unknown' },
    { id: 'm2', title: '流行金曲', artist: 'Top Hits' },
    { id: 'm3', title: '搞笑配音', artist: 'Funny SFX' },
    { id: 'm4', title: '古风音乐', artist: 'Traditional' },
  ];

  const effectOptions = ['无特效', '复古', '黑白', '鲜艳', '漫画'];

  if (hasPermission === null) {
    requestCameraPermission();
  }

  if (!videoUri) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>拍摄</Text>
        </View>

        {hasPermission === false ? (
          <View style={styles.noPermission}>
            <Text style={styles.noPermissionText}>需要相机权限才能拍摄视频</Text>
            <TouchableOpacity onPress={requestCameraPermission} style={styles.permissionButton}>
              <Text style={styles.permissionButtonText}>授权</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <View style={styles.cameraContainer}>
              <Camera
                ref={cameraRef}
                style={styles.camera}
                type={Camera.Constants.Type.back}
                ratio="9:16"
              />

              <View style={styles.recordOverlay}>
                {isRecording && (
                  <View style={styles.recordTimer}>
                    <Text style={styles.timerText}>
                      {Math.floor(recordTime / 60)}:
                      {(recordTime % 60).toString().padStart(2, '0')}
                    </Text>
                  </View>
                )}
              </View>
            </View>

            <View style={styles.controls}>
              <TouchableOpacity
                style={styles.controlButton}
                onPress={() => setRecordMode(recordMode === 'video' ? 'photo' : 'video')}
              >
                <Text style={styles.controlIcon}>{recordMode === 'video' ? '🎥' : '📷'}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.recordButton, isRecording && styles.recording]}
                onPress={isRecording ? stopRecording : startRecording}
              >
                <View style={[styles.recordInner, isRecording && styles.recordingInner]} />
              </TouchableOpacity>

              <TouchableOpacity style={styles.controlButton}>
                <Text style={styles.controlIcon}>🔄</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.tipsContainer}>
              <Text style={styles.tipsText}>
                {recordMode === 'video' ? '点击按钮开始录制视频' : '点击按钮拍照'}
              </Text>
              <Text style={styles.tipsSubtext}>最长60秒 · 支持美颜滤镜</Text>
            </View>
          </>
        )}
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={resetRecording}>
          <Text style={styles.cancelText}>取消</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>发布</Text>
        <TouchableOpacity onPress={publishVideo}>
          <Text style={styles.publishText}>发布</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.previewContent} showsVerticalScrollIndicator={false}>
        <View style={styles.previewVideo}>
          <Video
            source={{ uri: videoUri }}
            style={styles.previewVideoPlayer}
            resizeMode="cover"
            isLooping
            shouldPlay
          />
        </View>

        <View style={styles.formSection}>
          <View style={styles.inputRow}>
            <Text style={styles.inputLabel}>标题</Text>
            <TextInput
              style={styles.input}
              placeholder="添加标题会有更多推荐哦~"
              placeholderTextColor={COLORS.gray[500]}
              value={caption}
              onChangeTextChange={setCaption}
              maxLength={55}
            />
            <Text style={styles.charCount}>{caption.length}/55</Text>
          </View>

          <View style={styles.textareaRow}>
            <TextInput
              style={styles.textarea}
              placeholder="描述视频内容，添加话题标签 #标签"
              placeholderTextColor={COLORS.gray[500]}
              value={description}
              onChangeTextChange={setDescription}
              multiline
              numberOfLines={4}
            />
          </View>

          <View style={styles.sectionDivider} />

          <Text style={styles.sectionLabel}>选择音乐</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.musicScroll}>
            {musicOptions.map((music) => (
              <TouchableOpacity
                key={music.id}
                style={[styles.musicCard, selectedMusic?.id === music.id && styles.musicCardActive]}
                onPress={() =>
                  setSelectedMusic(selectedMusic?.id === music.id ? null : music)
                }
              >
                <Text style={styles.musicIcon}>🎵</Text>
                <Text style={styles.musicTitle}>{music.title}</Text>
                <Text style={styles.musicArtist}>{music.artist}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <View style={styles.sectionDivider} />

          <Text style={styles.sectionLabel}>选择特效</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.effectScroll}>
            {effectOptions.map((effect) => (
              <TouchableOpacity
                key={effect}
                style={[styles.effectCard, selectedEffect === effect && styles.effectCardActive]}
                onPress={() => setSelectedEffect(selectedEffect === effect ? null : effect)}
              >
                <Text style={styles.effectName}>{effect}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
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
  headerTitle: {
    color: COLORS.white,
    fontSize: SIZES.lg,
    fontWeight: '700',
  },
  cancelText: {
    color: COLORS.gray[400],
    fontSize: SIZES.body,
  },
  publishText: {
    color: COLORS.primary,
    fontSize: SIZES.body,
    fontWeight: '700',
  },
  cameraContainer: {
    width: width,
    height: width * (16 / 9),
    backgroundColor: COLORS.surface,
  },
  camera: {
    width: '100%',
    height: '100%',
  },
  recordOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
  },
  recordTimer: {
    marginTop: SIZES.xxl,
    backgroundColor: COLORS.overlay,
    borderRadius: SIZES.lg,
    paddingHorizontal: SIZES.lg,
    paddingVertical: SIZES.xs,
  },
  timerText: {
    color: COLORS.white,
    fontSize: SIZES.lg,
    fontWeight: '700',
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: SIZES.xxl,
  },
  controlButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  controlIcon: {
    fontSize: 24,
  },
  recordButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 4,
    borderColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  recordInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.primary,
  },
  recording: {
    borderColor: COLORS.primary,
  },
  recordingInner: {
    width: 30,
    height: 30,
    borderRadius: 4,
    backgroundColor: COLORS.primary,
  },
  tipsContainer: {
    alignItems: 'center',
    paddingHorizontal: SIZES.xl,
  },
  tipsText: {
    color: COLORS.white,
    fontSize: SIZES.body,
    fontWeight: '600',
  },
  tipsSubtext: {
    color: COLORS.gray[500],
    fontSize: SIZES.caption,
    marginTop: SIZES.xs,
  },
  noPermission: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noPermissionText: {
    color: COLORS.gray[400],
    fontSize: SIZES.body,
    marginBottom: SIZES.lg,
  },
  permissionButton: {
    backgroundColor: COLORS.primary,
    borderRadius: SIZES.lg,
    paddingHorizontal: SIZES.xl,
    paddingVertical: SIZES.sm,
  },
  permissionButtonText: {
    color: COLORS.white,
    fontSize: SIZES.body,
    fontWeight: '700',
  },
  previewContent: {
    flex: 1,
  },
  previewVideo: {
    width: width,
    height: width * (16 / 9),
    backgroundColor: COLORS.surface,
  },
  previewVideoPlayer: {
    width: '100%',
    height: '100%',
  },
  formSection: {
    padding: SIZES.md,
  },
  inputRow: {
    marginBottom: SIZES.md,
  },
  inputLabel: {
    color: COLORS.gray[400],
    fontSize: SIZES.small,
    marginBottom: SIZES.xs,
  },
  input: {
    color: COLORS.white,
    fontSize: SIZES.body,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray[700],
    paddingVertical: SIZES.sm,
  },
  charCount: {
    color: COLORS.gray[500],
    fontSize: SIZES.small,
    textAlign: 'right',
  },
  textareaRow: {
    marginBottom: SIZES.md,
  },
  textarea: {
    color: COLORS.white,
    fontSize: SIZES.body,
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.md,
    padding: SIZES.md,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  sectionDivider: {
    height: 1,
    backgroundColor: COLORS.gray[700],
    marginVertical: SIZES.md,
  },
  sectionLabel: {
    color: COLORS.white,
    fontSize: SIZES.caption,
    fontWeight: '700',
    marginBottom: SIZES.sm,
  },
  musicScroll: {
    marginBottom: SIZES.sm,
  },
  musicCard: {
    width: 120,
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.md,
    padding: SIZES.sm,
    marginRight: SIZES.sm,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  musicCardActive: {
    borderColor: COLORS.primary,
  },
  musicIcon: {
    fontSize: 24,
    marginBottom: SIZES.xs,
  },
  musicTitle: {
    color: COLORS.white,
    fontSize: SIZES.caption,
    fontWeight: '700',
  },
  musicArtist: {
    color: COLORS.gray[500],
    fontSize: SIZES.small,
  },
  effectScroll: {
    marginBottom: SIZES.sm,
  },
  effectCard: {
    paddingHorizontal: SIZES.md,
    paddingVertical: SIZES.sm,
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.lg,
    marginRight: SIZES.sm,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  effectCardActive: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.gray[800],
  },
  effectName: {
    color: COLORS.white,
    fontSize: SIZES.caption,
  },
});
