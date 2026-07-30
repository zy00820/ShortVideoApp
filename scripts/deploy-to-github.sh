#!/bin/bash
set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m'

echo -e "${CYAN}"
echo "╔══════════════════════════════════════════╗"
echo "║   ShortVideoApp - APK 自动构建部署脚本   ║"
echo "╚══════════════════════════════════════════╝"
echo -e "${NC}"

PROJECT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$PROJECT_DIR"

# 1. Check git
if ! command -v git &> /dev/null; then
    echo -e "${RED}❌ Git 未安装，请先安装 Git${NC}"
    exit 1
fi

# 2. Check if already a git repo
if [ ! -d ".git" ]; then
    echo -e "${YELLOW}📦 初始化 Git 仓库...${NC}"
    git init
    git add -A
    git commit -m "Initial commit: ShortVideoApp v1.0.0"
    echo -e "${GREEN}✅ Git 仓库已初始化${NC}"
else
    echo -e "${GREEN}✅ Git 仓库已存在${NC}"
fi

# 3. Check if GitHub CLI is available
if command -v gh &> /dev/null; then
    echo -e "${CYAN}🔗 检测到 GitHub CLI${NC}"
    if gh auth status 2>/dev/null; then
        echo -e "${GREEN}✅ GitHub CLI 已登录${NC}"
        
        echo ""
        echo -e "${YELLOW}请输入你的 GitHub 仓库名（格式: username/repo-name）：${NC}"
        read -r REPO_NAME
        
        if [ -z "$REPO_NAME" ]; then
            REPO_NAME="shortvideoapp"
        fi
        
        # Create GitHub repo and push
        echo -e "${CYAN}🚀 创建 GitHub 仓库并推送代码...${NC}"
        gh repo create "$REPO_NAME" --private --source=. --remote=origin --push
        
        echo ""
        echo -e "${GREEN}╔══════════════════════════════════════════╗${NC}"
        echo -e "${GREEN}║  ✅ 代码已推送到 GitHub!                ║${NC}"
        echo -e "${GREEN}╚══════════════════════════════════════════╝${NC}"
        echo ""
        
        # Trigger build
        echo -e "${YELLOW}🔨 触发 APK 构建...${NC}"
        gh workflow run "Build APK" --repo "$REPO_NAME" --ref main
        
        echo ""
        echo -e "${CYAN}⏳ 构建已触发！请前往以下地址查看进度并下载 APK：${NC}"
        echo -e "${GREEN}   https://github.com/$REPO_NAME/actions${NC}"
        echo ""
        echo -e "${YELLOW}💡 提示：${NC}"
        echo -e "   - 构建通常需要 5-10 分钟"
        echo -e "   - 构建完成后，在 Actions 页面可下载 APK"
        echo -e "   - APK 也会自动发布到 Releases 页面"
        echo -e "   - Release 页面地址: https://github.com/$REPO_NAME/releases"
        
    else
        echo -e "${YELLOW}⚠️  GitHub CLI 未登录${NC}"
        echo ""
        echo -e "${CYAN}请按以下步骤操作：${NC}"
        echo ""
        echo "1. 登录 GitHub CLI:"
        echo "   ${GREEN}gh auth login${NC}"
        echo ""
        echo "2. 然后运行本脚本，或手动执行："
        echo "   ${GREEN}git remote add origin <你的GitHub仓库地址>${NC}"
        echo "   ${GREEN}git push -u origin main${NC}"
        echo ""
        echo "3. 在 GitHub 仓库的 Actions 标签页手动触发 'Build APK' 工作流"
    fi
else
    echo -e "${YELLOW}⚠️  未检测到 GitHub CLI${NC}"
    echo ""
    echo -e "${CYAN}请按以下步骤操作：${NC}"
    echo ""
    echo "1. 安装 GitHub CLI: https://cli.github.com/"
    echo "   ${GREEN}macOS: brew install gh${NC}"
    echo "   ${GREEN}Windows: winget install GitHub.cli${NC}"
    echo "   ${GREEN}Linux: sudo apt install gh${NC}"
    echo ""
    echo "2. 登录 GitHub CLI:"
    echo "   ${GREEN}gh auth login${NC}"
    echo ""
    echo "3. 创建 GitHub 仓库并推送："
    echo "   ${GREEN}gh repo create shortvideoapp --private --source=. --remote=origin --push${NC}"
    echo ""
    echo "4. 触发 APK 构建："
    echo "   ${GREEN}gh workflow run 'Build APK'${NC}"
    echo ""
    echo "5. 查看构建进度："
    echo "   ${GREEN}gh run watch${NC}"
fi

echo ""
echo -e "${CYAN}════════════════════════════════════════════${NC}"
echo -e "${GREEN}🎉 完成！APK 构建完成后可在 GitHub Releases 下载${NC}"
echo -e "${CYAN}════════════════════════════════════════════${NC}"
