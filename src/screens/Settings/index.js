import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Linking,
  Alert,
  Modal,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SIZES } from '../../constants';

const GITHUB_REPO_URL = 'https://github.com/zy00820/ShortVideoApp';
const GITHUB_RELEASES_URL = 'https://github.com/zy00820/ShortVideoApp/releases';
const CURRENT_VERSION = '1.0.0';

export const SettingsScreen = ({ navigation }) => {
  const [checkingUpdate, setCheckingUpdate] = useState(false);
  const [updateStatus, setUpdateStatus] = useState(null);

  const handleCheckUpdate = async () => {
    setCheckingUpdate(true);
    setUpdateStatus(null);

    try {
      const response = await fetch(
        'https://api.github.com/repos/zy00820/ShortVideoApp/releases/latest'
      );
      if (response.ok) {
        const data = await response.json();
        const latestVersion = data.tag_name?.replace(/^v/, '') || '0.0.0';

        if (latestVersion !== CURRENT_VERSION) {
          setUpdateStatus({
            available: true,
            version: latestVersion,
            notes: data.body || '暂无更新说明',
            downloadUrl: data.assets?.[0]?.browser_download_url || GITHUB_RELEASES_URL,
          });
        } else {
          setUpdateStatus({
            available: false,
            version: latestVersion,
          });
        }
      } else {
        setUpdateStatus({
          available: false,
          version: CURRENT_VERSION,
          error: '无法获取更新信息',
        });
      }
    } catch (error) {
      setUpdateStatus({
        available: false,
        version: CURRENT_VERSION,
        error: '网络连接失败',
      });
    } finally {
      setCheckingUpdate(false);
    }
  };

  const openReleasePage = () => {
    Linking.openURL(GITHUB_RELEASES_URL).catch(() => {
      Alert.alert('提示', '无法打开浏览器，请手动访问：\n' + GITHUB_RELEASES_URL);
    });
  };

  const openGithubPage = () => {
    Linking.openURL(GITHUB_REPO_URL).catch(() => {
      Alert.alert('提示', '无法打开浏览器，请手动访问：\n' + GITHUB_REPO_URL);
    });
  };

  const handleAboutDevelopers = () => {
    Alert.alert(
      '了解开发者',
      '本应用由以下两位开发者共同开发：\n\n' +
        '👨‍💻 张岳 (zy00820)\n' +
        '👨‍💻 黄松\n\n' +
        '感谢他们的辛勤付出！',
      [{ text: '好的' }]
    );
  };

  const devTeam = [
    { name: '张岳', role: '主开发者', github: 'zy00820', emoji: '👨‍💻' },
    { name: '黄松', role: '开发者', github: '', emoji: '👨‍💻' },
  ];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerButton}>
          <Text style={styles.headerIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>设置</Text>
        <View style={styles.headerButton} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>通用</Text>

          <TouchableOpacity
            style={styles.settingItem}
            onPress={handleCheckUpdate}
            disabled={checkingUpdate}
          >
            <View style={styles.settingItemLeft}>
              <Text style={styles.settingIcon}>🔄</Text>
              <View style={styles.settingTextWrap}>
                <Text style={styles.settingLabel}>检查更新</Text>
                <Text style={styles.settingSubLabel}>
                  当前版本 v{CURRENT_VERSION}
                </Text>
              </View>
            </View>
            <View style={styles.settingItemRight}>
              {checkingUpdate ? (
                <ActivityIndicator size="small" color={COLORS.primary} />
              ) : (
                <Text style={styles.arrow}>›</Text>
              )}
            </View>
          </TouchableOpacity>

          {updateStatus && !checkingUpdate && (
            <View style={styles.updateResult}>
              {updateStatus.available ? (
                <View style={styles.updateAvailable}>
                  <Text style={styles.updateTitle}>
                    🎉 发现新版本 v{updateStatus.version}
                  </Text>
                  <Text style={styles.updateNotes} numberOfLines={3}>
                    {updateStatus.notes}
                  </Text>
                  <TouchableOpacity style={styles.downloadBtn} onPress={openReleasePage}>
                    <Text style={styles.downloadBtnText}>前往下载</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <View style={styles.updateUpToDate}>
                  <Text style={styles.upToDateIcon}>✅</Text>
                  <Text style={styles.upToDateText}>
                    {updateStatus.error
                      ? `${updateStatus.error}，当前版本 v${CURRENT_VERSION}`
                      : `已是最新版本 v${CURRENT_VERSION}`}
                  </Text>
                </View>
              )}
            </View>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>关于</Text>

          <TouchableOpacity style={styles.settingItem} onPress={handleAboutDevelopers}>
            <View style={styles.settingItemLeft}>
              <Text style={styles.settingIcon}>👥</Text>
              <View style={styles.settingTextWrap}>
                <Text style={styles.settingLabel}>了解开发者</Text>
                <Text style={styles.settingSubLabel}>张岳 & 黄松</Text>
              </View>
            </View>
            <Text style={styles.arrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.settingItem}
            onPress={() => {
              Alert.alert(
                '开发团队',
                devTeam
                  .map(
                    (d) => `${d.emoji} ${d.name} - ${d.role}${d.github ? `\n    GitHub: @${d.github}` : ''}`
                  )
                  .join('\n\n'),
                [{ text: '好的' }]
              );
            }}
          >
            <View style={styles.settingItemLeft}>
              <Text style={styles.settingIcon}>🏢</Text>
              <View style={styles.settingTextWrap}>
                <Text style={styles.settingLabel}>开发团队</Text>
                <Text style={styles.settingSubLabel}>查看团队成员信息</Text>
              </View>
            </View>
            <Text style={styles.arrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem} onPress={openGithubPage}>
            <View style={styles.settingItemLeft}>
              <Text style={styles.settingIcon}>🔗</Text>
              <View style={styles.settingTextWrap}>
                <Text style={styles.settingLabel}>项目主页</Text>
                <Text style={styles.settingSubLabel}>GitHub</Text>
              </View>
            </View>
            <Text style={styles.arrow}>›</Text>
          </TouchableOpacity>

          <View style={[styles.settingItem, styles.settingItemLast]}>
            <View style={styles.settingItemLeft}>
              <Text style={styles.settingIcon}>📱</Text>
              <View style={styles.settingTextWrap}>
                <Text style={styles.settingLabel}>应用版本</Text>
                <Text style={styles.settingSubLabel}>当前版本信息</Text>
              </View>
            </View>
            <Text style={styles.versionText}>v{CURRENT_VERSION}</Text>
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>ShortVideoApp v{CURRENT_VERSION}</Text>
          <Text style={styles.footerSubText}>© 2024 张岳 & 黄松</Text>
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
    fontSize: SIZES.lg,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  section: {
    marginHorizontal: SIZES.md,
    marginTop: SIZES.md,
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.md,
    overflow: 'hidden',
  },
  sectionTitle: {
    color: COLORS.gray[500],
    fontSize: SIZES.small,
    fontWeight: '600',
    paddingHorizontal: SIZES.md,
    paddingVertical: SIZES.sm,
    textTransform: 'uppercase',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SIZES.md,
    paddingVertical: SIZES.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: COLORS.gray[800],
  },
  settingItemLast: {
    borderBottomWidth: 0,
  },
  settingItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingIcon: {
    fontSize: 22,
    marginRight: SIZES.md,
  },
  settingTextWrap: {
    flex: 1,
  },
  settingLabel: {
    color: COLORS.white,
    fontSize: SIZES.body,
    fontWeight: '500',
  },
  settingSubLabel: {
    color: COLORS.gray[500],
    fontSize: SIZES.small,
    marginTop: 2,
  },
  arrow: {
    color: COLORS.gray[600],
    fontSize: 20,
    fontWeight: '300',
  },
  versionText: {
    color: COLORS.gray[500],
    fontSize: SIZES.caption,
  },
  updateResult: {
    marginHorizontal: SIZES.md,
    marginBottom: SIZES.md,
    padding: SIZES.md,
    backgroundColor: COLORS.card,
    borderRadius: SIZES.md,
    borderWidth: 1,
    borderColor: COLORS.gray[700],
  },
  updateAvailable: {
    alignItems: 'center',
  },
  updateTitle: {
    color: COLORS.primary,
    fontSize: SIZES.body,
    fontWeight: '700',
    marginBottom: SIZES.sm,
    textAlign: 'center',
  },
  updateNotes: {
    color: COLORS.gray[400],
    fontSize: SIZES.small,
    lineHeight: 18,
    marginBottom: SIZES.md,
    textAlign: 'center',
  },
  downloadBtn: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SIZES.xl,
    paddingVertical: SIZES.sm,
    borderRadius: SIZES.lg,
  },
  downloadBtnText: {
    color: COLORS.white,
    fontSize: SIZES.caption,
    fontWeight: '700',
  },
  updateUpToDate: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  upToDateIcon: {
    fontSize: 18,
    marginRight: SIZES.sm,
  },
  upToDateText: {
    color: COLORS.gray[400],
    fontSize: SIZES.caption,
  },
  footer: {
    alignItems: 'center',
    marginTop: SIZES.xxl,
    marginBottom: SIZES.xxl,
  },
  footerText: {
    color: COLORS.gray[600],
    fontSize: SIZES.caption,
    fontWeight: '600',
  },
  footerSubText: {
    color: COLORS.gray[700],
    fontSize: SIZES.small,
    marginTop: 2,
  },
});