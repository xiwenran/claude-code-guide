# Claude Code & Codex 完全指南

这是一个面向中文读者的双入口指南站点。现在保留原来的白底、圆角卡片、轻顶部菜单学习站风格，同时把 `content/upstream/` 里的 Claude Code / Codex 原始 Markdown 文章整理成清晰的双体系学习入口。

## 定位

- 面向想快速理解 Claude Code 与 Codex 差异、入口和资料来源的读者
- 首页先让用户选择 Claude Code 或 Codex，再进入对应体系
- 进入某个体系后，顶部菜单只显示该体系的快速开始、使用入口、核心概念、进阶功能、最佳实践、参考资料
- 学习路径页按主题分组展示上游文章，文章页直接读取 `content/upstream/` 的 Markdown 原文

## 当前结构

现在的主路径是：

1. 首页选择体系
2. 进入该体系的学习路径页
3. 打开文章正文阅读页

首页不再承载手写“本地学习页”内容；文章标题会去掉文件名前的数字序号，只保留正常标题展示。

## 同步方式

1. 运行 `npm run sync:upstream`
2. 脚本会从上游仓库拉取 `README.md`、`README.en.md`、`LICENSE`、`claude-code/*.md`、`codex/*.md`
3. 所有文件会写入 `content/upstream/`
4. 同时生成 `content/upstream/manifest.json`，记录同步时间、上游仓库、上游 commit 和文章列表

## 前端如何读取正文

- `src/App.jsx` 会根据 `content/upstream/manifest.json` 构建 Claude Code / Codex 两个分开的学习路径页
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
