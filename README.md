# Claude Code & Codex 完全指南

这是一个面向中文读者的双入口指南站点：首页保留 Claude Code 的学习路径，同时新增 Codex 入口说明，并把核心内容来源切到上游仓库自动同步。

## 定位

- 面向想快速理解 Claude Code 与 Codex 差异、入口和资料来源的读者
- 站点首页展示双入口卡片，明确说明内容来自上游自动同步
- 上游原始内容同步到 `content/upstream/`，前端只负责展示定位和同步信息

## 同步方式

1. 运行 `npm run sync:upstream`
2. 脚本会从上游仓库拉取 `README.md`、`README.en.md`、`LICENSE`、`claude-code/*.md`、`codex/*.md`
3. 所有文件会写入 `content/upstream/`
4. 同时生成 `content/upstream/manifest.json`，记录同步时间、上游仓库、上游 commit 和文章列表

## 自动同步

仓库新增了 `.github/workflows/sync-upstream.yml`：

- 支持手动触发 `workflow_dispatch`
- 每天定时执行一次同步与构建验证
- 有变更时直接提交并推送到 `main`

## 上游来源与许可

- 上游仓库：[stormzhang/ai-coding-guide](https://github.com/stormzhang/ai-coding-guide)
- 同步内容来源于上游公开文件
- 上游许可证：MIT，`LICENSE` 会一并同步到 `content/upstream/LICENSE`
