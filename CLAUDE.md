# Claude Code 完全指南 — 项目说明

## 项目概述
这是一个 Claude Code 零基础学习平台网站，基于官方文档（code.claude.com/docs/zh-CN）内容用通俗语言重新整理，面向完全不懂编程的新手用户。

## 技术栈
- 前端框架：React 18（函数组件 + Hooks）
- 构建工具：Vite 5
- 样式方案：全部使用 inline style（没有 CSS 文件，没有 Tailwind）
- 字体：Noto Sans SC（中文）+ JetBrains Mono（代码）
- 部署平台：Cloudflare Pages / Vercel / Netlify（静态站点）
- 单文件架构：所有页面和组件都在 src/App.jsx 一个文件中

## 项目结构
```
├── index.html          # HTML 入口
├── package.json        # 依赖配置
├── vite.config.js      # Vite 构建配置
├── CLAUDE.md           # 本文件（项目说明）
├── README.md           # 部署说明文档
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

## App.jsx 文件结构（核心文件）

文件按以下顺序组织，修改时请保持这个结构：

```
1. THEME & STYLES（主题色、字体常量）
   - C 对象：所有颜色定义
   - F 常量：正文字体
   - M 常量：代码字体

2. SITEMAP（站点地图 — 所有页面定义）
   - 每个页面有 id、title、nav、group、icon
   - PAGE_ORDER 数组：页面顺序
   - TOP_GROUPS 数组：顶部导航分组

3. SHARED COMPONENTS（共享组件）
   - Link：跨页面链接（goTo 跳转）
   - WhereTag：「在哪里用」标签
   - CodeBox：代码块（带复制按钮）
   - Tip：提示框（tip/warn/info/key 四种类型）
   - Card：卡片容器
   - Quiz：交互测验
   - Grid：网格布局
   - SectionTitle：章节标题
   - Breadcrumb：面包屑导航
   - FeatureLocationTable：功能对比表格

4. PAGE CONTENTS（各页面内容组件）
   - HomePage：首页
   - OverviewPage：什么是 Claude Code
   - WherePage：在哪里打开和使用（Tab 切换 5 种方式）
   - InstallPage：安装配置（步骤流）
   - HowWorksPage：工作原理
   - CommandsPage：命令和快捷键
   - MemoryPage：CLAUDE.md 记忆系统
   - PromptsPage：提示词技巧（好坏对比）
   - WorkflowsPage：常见工作流（手风琴展开）
   - ThinkPage：Think 深度思考模式
   - PlanPage：Plan 规划模式
   - SubagentsPage：子代理
   - MCPPage：MCP 扩展连接
   - SkillsPage：Skills 技能包
   - HooksPage：Hooks 自动化
   - PracticePage：官方最佳实践（7 个可展开章节）
   - PlatformsPage：平台与集成
   - ExercisesPage：动手练习

5. PAGES MAP（页面组件映射表）

6. MAIN APP（主应用组件）
   - 顶部导航栏（苹果风格毛玻璃效果）
   - 移动端菜单抽屉
   - 内容区域（带前进/返回导航）
   - 浮动按钮（回到顶部 + 回到首页）
   - 页脚
```

## 设计规范

### 颜色
- 背景：#fafafa（浅灰）、#fff（白色卡片）、#f5f5f7（次级背景）
- 文字：#1d1d1f（主文字）、#6e6e73（次级）、#86868b（辅助）
- 强调色：#e8550f（橙色，品牌色）、#ff6b2b（亮橙）
- 功能色：#0066cc（蓝色链接）、#1d7d34（绿色成功）、#d30000（红色错误）、#bf5af2（紫色）、#ffd60a（黄色警告）

### 字体
- 正文：'SF Pro Display', 'Noto Sans SC', -apple-system, sans-serif
- 代码：'SF Mono', 'JetBrains Mono', monospace

### 风格
- 苹果官网风格：亮色主题、大留白、圆角卡片（16px）
- 导航栏毛玻璃效果（backdrop-filter: blur）
- 代码块暗色主题（#1d1d1f 背景）
- 所有交互带 hover 效果

## 编码规范

### React
- 只使用函数组件 + Hooks（useState、useRef、useCallback）
- 所有样式用 inline style 对象，不使用 className
- 每个页面组件接收 `{goTo}` prop 用于页面跳转
- 页面间跳转统一使用 `goTo("pageId")` 函数

### 内容
- 所有技术概念必须用通俗中文解释，面向完全不懂编程的新手
- 每个功能必须标注「在哪里使用」（用 WhereTag 组件）
- 代码块必须有复制按钮（用 CodeBox 组件）
- 页面间要有交叉链接（用 Link 组件）
- 进阶功能要有面包屑导航（用 Breadcrumb 组件）

### 添加新页面的步骤
1. 在 SITEMAP 对象中添加页面定义
2. 在 PAGE_ORDER 数组中添加页面 ID（控制顺序）
3. 如果需要新分组，在 TOP_GROUPS 中添加
4. 创建页面组件函数（接收 {goTo} 参数）
5. 在 PAGES 映射表中注册
6. 在相关页面中添加 Link 引用

## 注意事项
- 不要拆分文件：目前所有代码在一个 App.jsx 中，这是有意为之（方便在 Claude.ai 的 Artifact 中直接预览）
- 不要引入 CSS 框架：所有样式用 inline style，保持零依赖
- 不要使用 localStorage：在沙箱环境中不可用
- 代码块复制功能使用 document.execCommand("copy") 而不是 navigator.clipboard（后者在 iframe 沙箱中被禁用）
- 如果项目后续要拆分文件，建议按页面拆分到 src/pages/ 目录
