# Claude Code 完全指南 — 项目说明

## 项目概述
这是一个 Claude Code 零基础学习平台网站，基于官方文档（code.claude.com/docs/zh-CN）内容用通俗语言重新整理，面向完全不懂编程的新手用户。

## 在线地址
- 网站：https://claude-code-guide-eqn.pages.dev
- 仓库：https://github.com/xiwenran/claude-code-guide

## 技术栈
- 前端框架：React 18（函数组件 + Hooks）
- 构建工具：Vite 5
- 样式方案：全部使用 inline style（没有 CSS 文件，没有 Tailwind）
- 字体：Noto Sans SC（中文）+ JetBrains Mono（代码）
- 部署平台：Cloudflare Pages（自动部署，推送 GitHub 即更新）
- 单文件架构：所有页面和组件都在 src/App.jsx 一个文件中

## 项目结构
```
├── index.html          # HTML 入口
├── package.json        # 依赖配置
├── vite.config.js      # Vite 构建配置
├── CLAUDE.md           # 本文件（项目说明）
├── README.md           # 项目介绍
└── src/
    ├── main.jsx        # React 挂载入口
    └── App.jsx         # 核心文件：包含所有页面、组件、数据、路由
```

## 常用命令
```bash
npm install        # 安装依赖
npm run dev        # 启动本地开发服务器（http://localhost:5173）
npm run build      # 构建生产版本（输出到 dist/）
npm run preview    # 预览构建结果
```

## 部署流程
- 修改 GitHub 上的文件 → Cloudflare Pages 自动构建部署（1-2分钟）
- 构建命令：npm run build
- 输出目录：dist
- 不需要手动操作 Cloudflare

## App.jsx 文件结构（核心文件，约 840 行）

文件按以下顺序组织，修改时请保持这个结构：

```
1. THEME & STYLES（主题色、字体常量）
   - C 对象：所有颜色定义（亮色主题，苹果风格）
   - F 常量：正文字体
   - M 常量：代码字体

2. SITEMAP（站点地图 — 所有页面定义）
   - 每个页面有 id、title、nav、group、icon
   - PAGE_ORDER 数组：页面顺序（控制上一页/下一页）
   - TOP_GROUPS 数组：顶部导航分组

3. SHARED COMPONENTS（共享组件）
   - Link：跨页面链接（goTo 跳转）
   - WhereTag：「在哪里用」蓝色标签
   - CodeBox：代码块（暗色背景 + 复制按钮）
   - Tip：提示框（tip/warn/info/key 四种类型）
   - Card：卡片容器（白色背景，hover 效果）
   - Quiz：交互测验组件
   - Grid：响应式网格布局
   - SectionTitle：章节标题 + 副标题
   - Breadcrumb：面包屑导航（进阶子页面用）
   - FeatureLocationTable：功能 × 平台对比表格

4. PAGE CONTENTS（18个页面组件）
   快速开始：
   - HomePage：首页（9宫格导航卡片）
   - OverviewPage：什么是 Claude Code
   - WherePage：在哪里打开和使用（Tab 切换 5 种方式）
   - InstallPage：安装配置（步骤流程）
   
   核心概念：
   - HowWorksPage：工作原理（代理循环图）
   - CommandsPage：命令和快捷键在哪用（系统终端 vs Claude Code 会话）
   - MemoryPage：CLAUDE.md 记忆系统（含用户主目录详解）
   
   日常使用：
   - PromptsPage：提示词技巧（好坏对比，普通人视角）
   - WorkflowsPage：常见工作流（手风琴展开）
   
   进阶功能（每个都有独立详情页）：
   - ThinkPage：Think 深度思考模式（4个级别详解）
   - PlanPage：Plan 规划模式（3种进入方式）
   - SubagentsPage：子代理（含自定义 agent 配置文件示例）
   - MCPPage：MCP 扩展连接（6个常用工具 + 3种配置方式）
   - SkillsPage：Skills 技能包
   - HooksPage：Hooks 自动化钩子（4种触发时机 + 配置示例）
   
   最佳实践：
   - PracticePage：官方最佳实践（7个可展开章节，含黄金法则）
   
   更多：
   - PlatformsPage：平台与团队集成
   - ExercisesPage：动手练习（4级难度）

5. PAGES MAP（页面组件映射表）

6. MAIN APP（主应用组件）
   - 顶部导航栏（苹果风格，毛玻璃效果，下拉菜单）
   - 单项分组直接跳转，多项分组显示下拉菜单
   - 移动端汉堡菜单抽屉
   - 内容区域（返回按钮 + 上下页导航 + 浏览历史）
   - 浮动按钮（回到顶部 ↑ + 回到首页 ⚡）
   - 页脚
```

## 设计规范

### 颜色（亮色主题）
- 背景：#fafafa（页面）、#fff（卡片）、#f5f5f7（次级背景）、#1d1d1f（代码块）
- 文字：#1d1d1f（主文字）、#6e6e73（次级）、#86868b（辅助）
- 强调色：#e8550f（橙色品牌色）、#ff6b2b（亮橙）
- 功能色：#0066cc（蓝色链接）、#1d7d34（绿色成功）、#d30000（红色错误）、#bf5af2（紫色）、#ffd60a（黄色警告）

### 字体
- 正文：'SF Pro Display', 'Noto Sans SC', -apple-system, sans-serif
- 代码：'SF Mono', 'JetBrains Mono', monospace
- 正文基础字号：16px，标题：32px，副标题：17px

### 设计风格
- 苹果官网风格：亮色主题、大留白、圆角卡片（16px）
- 导航栏毛玻璃效果（backdrop-filter: blur）
- 代码块暗色主题 + 复制按钮
- 所有交互带 hover 效果和过渡动画

## 编码规范

### React
- 只使用函数组件 + Hooks（useState、useRef、useCallback）
- 所有样式用 inline style 对象，不使用 className（除极少数媒体查询）
- 每个页面组件接收 `{goTo}` prop 用于页面跳转
- 页面间跳转统一使用 `goTo("pageId")` 函数

### 内容规范
- 所有技术概念必须用通俗中文解释，面向完全不懂编程的新手
- 每个功能必须标注「在哪里使用」（用 WhereTag 组件）
- 代码块必须有复制按钮（用 CodeBox 组件）
- 页面间要有交叉链接（用 Link 组件）
- 进阶功能要有面包屑导航（用 Breadcrumb 组件）
- 技术路径（如 ~/.claude/）必须解释清楚在电脑的哪个位置

### 添加新页面的步骤
1. 在 SITEMAP 对象中添加页面定义（id、title、nav、group、icon）
2. 在 PAGE_ORDER 数组中添加页面 ID（控制前后页顺序）
3. 如果需要新的顶部导航分组，在 TOP_GROUPS 中添加
4. 创建页面组件函数（接收 {goTo} 参数）
5. 在 PAGES 映射表中注册组件
6. 在相关页面中用 Link 组件添加交叉链接

## 注意事项
- 不要拆分文件：所有代码在一个 App.jsx 中（方便在 Claude.ai Artifact 中预览）
- 不要引入 CSS 框架：所有样式用 inline style，保持零外部依赖
- 不要使用 localStorage：在沙箱环境中不可用
- 代码块复制用 document.execCommand("copy") + Selection API（navigator.clipboard 在 iframe 中被禁用）
- 导航栏宽度和内容区宽度保持一致（maxWidth: 860px）
- 首页标题居中，副标题一行显示，不加句号
