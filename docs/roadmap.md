# Roadmap

## 当前主线状态

- 当前阶段：Phase 5 - 首页改为体系导航，并切到单体系学习路径（✅）
- 对应 commit：未提交（working tree）
- 一句话现状：首页先选 Claude Code / Codex；进入后顶部菜单只展示当前体系主题，学习路径与正文都直接来自上游文章。

## 主线计划

### Phase 1 - 自动同步上游内容并更新站点标题

- 状态：✅
- 范围：`src/App.jsx`、`index.html`、`package.json`、`README.md`、`scripts/sync-upstream.mjs`、`.github/workflows/sync-upstream.yml`、`content/upstream/`
- 目标：把站点定位升级为 Claude Code 与 Codex 双入口指南，并建立上游内容自动同步能力。
- 验收：`npm run sync:upstream` 成功生成 `content/upstream/manifest.json`；`npm run build` 成功；首页可见 Claude Code 与 Codex 两个同步入口卡片。
- 阻断条件：上游仓库不可访问；本地缺少 Node 运行环境；构建依赖未安装导致 `npm run build` 无法执行。

### Phase 2 - 上游 Markdown 正文接入与宽屏布局放宽

- 状态：✅
- 范围：`src/App.jsx`、`src/markdown.js`、`README.md`、`docs/roadmap.md`
- 目标：把站点主路径改为可读的上游资料站，让首页、分类目录、文章正文都直接基于 `content/upstream/` 的真实 Markdown 展示；同时放宽整站宽屏布局，不再把内容压得过窄。
- 验收：首页 CTA 与双卡片直达 Claude Code / Codex 目录；目录标题优先取 Markdown 第一行；正文来自 `content/upstream/**/*.md` raw 内容；文章页可返回目录并支持上一篇/下一篇；`npm run build` 成功。
- 阻断条件：Vite 无法读取 raw markdown；同步目录缺失或 manifest 不完整；本地构建依赖不可用。

### Phase 3 - 主题归档与用户视角 UI 重做

- 状态：✅
- 范围：`src/App.jsx`、`README.md`、`docs/roadmap.md`
- 目标：保留上游 Markdown 正文读取能力，但把 Claude Code / Codex 目录改成主题学习路径；首页、分类页、文章页恢复更轻盈的教程站阅读感，不再是平铺列表。
- 验收：首页强调按主题学习路径进入；Claude Code / Codex 都按主题区块组织文章；文章页保留真实 Markdown 正文并补齐返回主题目录、上一篇/下一篇、同主题侧栏；`npm run build` 成功。
- 阻断条件：主题归类规则遗漏过多文章；现有 Markdown 渲染与新文章页结构冲突；本地构建依赖不可用。

### Phase 4 - 恢复原 UI 风格并接入主题文章菜单

- 状态：✅
- 范围：`src/App.jsx`、`src/markdown.js`、`README.md`、`docs/roadmap.md`
- 目标：保留 5aa0413 这套白底、圆角卡片、轻顶部下拉菜单的原视觉，把上游文章按主题并入现有顶部菜单，同时保留 Claude Code / Codex 主题目录页，以及直接读取 `content/upstream/` Markdown 的文章阅读页。
- 验收：顶部菜单按快速开始、使用入口、核心概念、进阶功能、最佳实践、参考资料归类；首页两张大卡片进入 `claudeGuide` / `codexGuide`；目录页按指定主题分组；文章页支持返回目录、上一篇/下一篇、来源 commit、原文件路径；在 `/tmp` 副本内 `npm run build` 成功。
- 阻断条件：上游文章清单缺失导致目录不可构建；Vite raw markdown 读取失败；构建依赖不可用。

### Phase 5 - 首页改为体系导航，并切到单体系学习路径

- 状态：✅
- 范围：`src/App.jsx`、`README.md`、`docs/roadmap.md`
- 目标：删除首页上的手写本地学习入口，改为 Claude Code / Codex 双体系导航；进入某个体系后，顶部菜单、学习路径页和面包屑只展示当前体系内容；文章标题展示时去掉编号前缀。
- 验收：首页保留原视觉但改成双体系入口卡片；顶部明显可切换 Claude Code / Codex；单体系下拉菜单不再出现“本地学习页”或另一套体系文章；GuideLandingPage 作为体系首页；文章列表和正文页文案不再写“本地学习页”；`git diff --check` 通过，如依赖可用则 `npm run build` 通过。
- 阻断条件：上游文章标题无法稳定去前缀；现有路由状态与单体系导航冲突；本地构建依赖不可用。
