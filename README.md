# Claude Code & Codex 完全指南

这是一个面向中文读者的双入口指南站点。现在保留原来的白底、圆角卡片、轻顶部菜单学习站风格，同时把 `content/upstream/` 里的 Claude Code / Codex 原始 Markdown 文章按主题接进现有菜单、目录页和阅读页。

## 定位

- 面向想快速理解 Claude Code 与 Codex 差异、入口和资料来源的读者
- 站点首页展示双入口卡片，并直接进入真实 Claude Code / Codex 文章目录
- 顶部菜单按快速开始、使用入口、核心概念、进阶功能、最佳实践、参考资料重新归类，并接入 Claude Code / Codex 文章入口
- 上游原始内容同步到 `content/upstream/`，前端会读取这些 Markdown 原文并渲染成可读正文

## 同步方式

1. 运行 `npm run sync:upstream`
2. 脚本会从上游仓库拉取 `README.md`、`README.en.md`、`LICENSE`、`claude-code/*.md`、`codex/*.md`
3. 所有文件会写入 `content/upstream/`
4. 同时生成 `content/upstream/manifest.json`，记录同步时间、上游仓库、上游 commit 和文章列表

## 前端如何读取正文

- `src/App.jsx` 会根据 `content/upstream/manifest.json` 构建 Claude Code / Codex 两个按主题分组的目录
- 文章正文通过 Vite 的 raw markdown 读取方式直接加载 `content/upstream/**/*.md`
- `src/markdown.js` 内置了一个无额外依赖的最小 Markdown 渲染器，支持标题、段落、列表、引用、代码块、行内 code、链接、图片和粗体
- 图片会优先映射到 `content/upstream/` 里的同步资源，避免正文里只剩断裂文本

## 自动同步

仓库新增了 `.github/workflows/sync-upstream.yml`：

- 支持手动触发 `workflow_dispatch`
- 每天定时执行一次同步与构建验证
- 有变更时直接提交并推送到 `main`

## 上游来源与许可

- 上游仓库：[stormzhang/ai-coding-guide](https://github.com/stormzhang/ai-coding-guide)
- 同步内容来源于上游公开文件
- 上游许可证：MIT，`LICENSE` 会一并同步到 `content/upstream/LICENSE`
