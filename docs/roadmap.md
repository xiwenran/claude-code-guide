# Roadmap

## 当前主线状态

- 当前阶段：Phase 1 - 自动同步上游内容并更新站点标题（🚧）
- 对应 commit：待提交
- 一句话现状：已获授权，正在补齐上游同步脚本、首页双入口和自动同步工作流。

## 主线计划

### Phase 1 - 自动同步上游内容并更新站点标题

- 状态：🚧
- 范围：`src/App.jsx`、`index.html`、`package.json`、`README.md`、`scripts/sync-upstream.mjs`、`.github/workflows/sync-upstream.yml`、`content/upstream/`
- 目标：把站点定位升级为 Claude Code 与 Codex 双入口指南，并建立上游内容自动同步能力。
- 验收：`npm run sync:upstream` 成功生成 `content/upstream/manifest.json`；`npm run build` 成功；首页可见 Claude Code 与 Codex 两个同步入口卡片。
- 阻断条件：上游仓库不可访问；本地缺少 Node 运行环境；构建依赖未安装导致 `npm run build` 无法执行。
