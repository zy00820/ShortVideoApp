# ShortVideoApp 📱

一款基于 React Native + Expo 的仿抖音短视频移动应用。

## 🎉 立即下载 APK（优化版）

**👉 [点击下载最新 APK（206KB）](https://github.com/zy00820/ShortVideoApp/releases/download/apk-v3/ShortVideoApp-Optimized.apk)**

或访问 [GitHub Releases](https://github.com/zy00820/ShortVideoApp/releases) 查看所有版本。

## ✨ 功能特性

- 📱 **核心Feed流**: 抖音风格的竖向全屏视频Feed，支持滑动切换
- ❤️ **互动功能**: 点赞、评论、分享、收藏、关注
- 📹 **视频拍摄**: 支持拍摄视频/照片，最长60秒
- 🎨 **特效滤镜**: 选择音乐和特效
- 🔍 **发现页**: 热门话题、用户推荐、视频网格浏览
- 💬 **消息通知**: 消息中心、点赞、评论、新粉丝通知
- 👤 **个人主页**: 用户信息、作品展示、关注/粉丝/获赞统计

## 🛠️ 技术栈

- **React Native** 0.72.6 + **Expo** SDK 49
- **Zustand** - 轻量级状态管理
- **React Navigation** - 应用导航
- **Expo AV / Camera** - 视频播放与拍摄

## 🚀 快速开始

### 开发模式

```bash
cd ShortVideoApp
npm install
npm start
```

### 运行到设备

```bash
# Android 模拟器
npm run android

# Web 浏览器
npm run web

# 真机: 下载 Expo Go App 扫码连接
```

---

## 📦 构建 APK 并发布到 GitHub

我们提供了两种方式构建 APK：

### 方式一：GitHub Actions 自动构建 ⭐ 推荐

这是最简单的方式，无需本地安装 Android SDK。

#### 步骤：

1. **初始化 Git 并推送到 GitHub**

   ```bash
   # 方式 A: 使用一键脚本（需安装 GitHub CLI）
   ./scripts/deploy-to-github.sh
   
   # 方式 B: 手动操作
   git init
   git add -A
   git commit -m "Initial commit"
   git remote add origin https://github.com/你的用户名/仓库名.git
   git push -u origin main
   ```

2. **触发自动构建**

   推送代码后，GitHub Actions 会自动开始构建 APK。
   
   - 访问: `https://github.com/你的用户名/仓库名/actions`
   - 等待构建完成（通常 5-10 分钟）
   
3. **下载 APK**

   - 构建完成后，访问: `https://github.com/你的用户名/仓库名/releases`
   - 下载 APK 文件到本地
   - 传输到手机安装

#### 手动触发构建

如果想手动触发（如构建 Release 版本）：

1. 进入 GitHub 仓库的 **Actions** 标签
2. 选择 **Build APK** 工作流
3. 点击 **Run workflow**
4. 选择 **debug** 或 **release** 版本
5. 等待构建完成

---

### 方式二：本地构建

需要安装 Android SDK 和 JDK 17。

#### 环境要求：
- Node.js 18+
- JDK 17 ([下载地址](https://adoptium.net/))
- Android SDK ([下载地址](https://developer.android.com/studio))

#### 步骤：

```bash
# 1. 设置环境变量
export ANDROID_HOME=~/Android/Sdk
export JAVA_HOME=/path/to/jdk17

# 2. 运行构建脚本
./scripts/build-apk.sh

# 3. 或手动执行
npm install
npx expo prebuild --platform android --clean
cd android
echo "sdk.dir=$ANDROID_HOME" > local.properties
chmod +x gradlew
./gradlew assembleDebug

# 4. APK 位置
# android/app/build/outputs/apk/debug/app-debug.apk

# 5. 安装到手机
adb install android/app/build/outputs/apk/debug/app-debug.apk
```

---

### 方式三：EAS 云构建

使用 Expo 的 EAS 服务在云端构建 APK。

```bash
# 1. 安装 EAS CLI
npm install -g eas-cli

# 2. 登录 Expo 账号
eas login

# 3. 配置项目
eas build:configure

# 4. 构建 APK（在云端完成）
eas build -p android --profile preview

# 5. 下载 APK
# 构建完成后会收到下载链接
```

---

## 📁 项目结构

```
ShortVideoApp/
├── App.js                          # 应用入口
├── index.js                        # RN入口
├── app.json                        # Expo配置
├── eas.json                        # EAS Build配置
├── package.json                    # 依赖管理
├── .github/workflows/              # GitHub Actions配置
│   └── build-apk.yml               # APK自动构建工作流
├── scripts/
│   ├── build-apk.sh                # 本地构建脚本
│   └── deploy-to-github.sh         # GitHub部署脚本
├── src/
│   ├── constants/theme.js          # 主题/常量
│   ├── data/mockData.js            # Mock数据
│   ├── store/videoStore.js         # Zustand状态管理
│   ├── components/                 # 可复用组件
│   │   ├── VideoPlayer.js         # 视频播放器
│   │   ├── CommentSheet.js        # 评论抽屉
│   │   ├── Avatar.js              # 头像组件
│   │   └── Icon.js                # 图标组件
│   ├── screens/                    # 页面
│   │   ├── Home/                  # 首页+Feed流
│   │   ├── Discover/              # 发现页
│   │   ├── Upload/                # 拍摄/上传页
│   │   ├── Inbox/                 # 消息页
│   │   └── Profile/               # 个人主页
│   └── navigation/                 # 导航系统
```

## 📱 安装 APK 到手机

1. 将 APK 文件传输到 Android 手机（USB、网盘、微信等）
2. 手机设置 → 安全 → 允许安装未知来源应用
3. 点击 APK 文件安装
4. 打开应用即可使用

## ⚠️ 注意事项

- 首次启动会加载 Mock 数据，无需后端服务
- 视频源使用 Google 公开测试视频
- 所有数据存储在内存中，重启后会重置
- Release 版本需要签名密钥，详见 EAS 文档

## 📄 License

MIT License
