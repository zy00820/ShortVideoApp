#!/bin/bash
set -e

echo "========================================="
echo "  ShortVideoApp APK Build Script"
echo "========================================="
echo ""

# Check for Android SDK
if [ -z "$ANDROID_HOME" ]; then
    echo "⚠️  ANDROID_HOME not set. Please set it to your Android SDK path."
    echo "   Example: export ANDROID_HOME=~/Android/Sdk"
    exit 1
fi

if [ ! -d "$ANDROID_HOME/platforms" ]; then
    echo "⚠️  No Android platforms found at $ANDROID_HOME"
    echo "   Install Android SDK from: https://developer.android.com/studio"
    exit 1
fi

# Check for Java
if [ -z "$JAVA_HOME" ]; then
    JAVA_HOME=$(dirname $(dirname $(readlink -f $(which java))))
fi

JAVA_VERSION=$($JAVA_HOME/bin/java -version 2>&1 | head -1 | awk -F'"' '{print $2}' | cut -d. -f1)
if [ "$JAVA_VERSION" != "17" ] && [ "$JAVA_VERSION" != "11" ]; then
    echo "⚠️  Recommended JDK version is 11 or 17. Current: $JAVA_VERSION"
    echo "   Download from: https://adoptium.net/"
    read -p "Continue anyway? (y/N): " confirm
    if [ "$confirm" != "y" ]; then
        exit 1
    fi
fi

echo "✅ Android SDK: $ANDROID_HOME"
echo "✅ Java: $JAVA_HOME (version $JAVA_VERSION)"

# Install npm dependencies
echo ""
echo "📦 Installing npm dependencies..."
npm install

# Prebuild native project
echo ""
echo "🔨 Generating native Android project..."
npx expo prebuild --platform android --clean

# Setup gradle properties
cd android
echo "sdk.dir=$ANDROID_HOME" > local.properties

# Build APK
echo ""
echo "🏗️  Building APK..."
chmod +x gradlew
./gradlew assembleDebug --no-daemon

# Find the APK
APK_PATH="app/build/outputs/apk/debug/app-debug.apk"
if [ -f "$APK_PATH" ]; then
    echo ""
    echo "========================================="
    echo "  ✅ APK Build Successful!"
    echo "========================================="
    echo ""
    echo "📁 APK location: $(pwd)/$APK_PATH"
    echo "📦 APK size: $(du -h $APK_PATH | cut -f1)"
    echo ""
    echo "📱 To install on your device:"
    echo "   1. Enable USB debugging on your Android device"
    echo "   2. Connect via USB"
    echo "   3. Run: adb install $APK_PATH"
    echo ""
    echo "   Or transfer the APK file to your device manually."
else
    echo "❌ APK not found at $APK_PATH"
    exit 1
fi
