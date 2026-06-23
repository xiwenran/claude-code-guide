import React, { useEffect, useMemo, useState } from "react";
import upstreamManifest from "../content/upstream/manifest.json";
import { MarkdownRenderer, extractTitleFromMarkdown, stripInlineMarkdown } from "./markdown.js";

const markdownFiles = import.meta.glob("../content/upstream/**/*.md", {
  query: "?raw",
  import: "default",
  eager: true,
});

const imageFiles = import.meta.glob(
  [
    "../content/upstream/**/*.png",
    "../content/upstream/**/*.jpg",
    "../content/upstream/**/*.jpeg",
    "../content/upstream/**/*.gif",
    "../content/upstream/**/*.webp",
    "../content/upstream/**/*.svg",
  ],
  {
    eager: true,
    import: "default",
  },
);

const SHELL_WIDTH = 1240;

const COLORS = {
  page: "#f6f4ef",
  pageGlow: "#fbfaf7",
  panel: "#fffdf8",
  panelStrong: "#fffaf0",
  card: "#fffefb",
  text: "#1f2430",
  textSoft: "#5e6472",
  textDim: "#7d8493",
  line: "#e7dfd0",
  accent: "#c7682f",
  accentDeep: "#96461d",
  accentSoft: "#f7eadf",
  accentWash: "#fcf1e7",
  blue: "#4f6f8f",
  blueSoft: "#edf3f8",
  shadow: "0 20px 48px rgba(58, 46, 24, 0.08)",
  shadowSoft: "0 12px 28px rgba(58, 46, 24, 0.06)",
  codeBg: "#1c2430",
  codeText: "#eef4ff",
};

const CATEGORY_META = {
  "claude-code": {
    label: "Claude Code",
    shortLabel: "Claude",
    route: "claude-code",
    eyebrow: "Anthropic 路线",
    heroTitle: "按主题学会 Claude Code",
    heroDescription:
      "从安装、入口、上下文管理到技能扩展，按真实学习顺序整理，而不是把所有同步文章堆成一面墙。",
    themeIntro: "适合从终端与多入口使用方式切入，再逐步进入协作、自动化与最佳实践。",
    accent: "#c7682f",
    accentSoft: "#f7eadf",
    surface: "#fffaf3",
    fallbackTheme: "参考与排障",
    themes: [
      {
        key: "quick-start",
        name: "快速开始",
        description: "先知道它是什么、怎么装、第一次怎么跑，尽快建立可用心智模型。",
        readingOrder: "建议顺序：认识工具 -> 安装配置 -> 第一次跑通 -> 入门练习",
        matchers: [
          "01-what-is-claude-code",
          "02-install",
          "06-coding-plan",
          "07-first-run",
          "39-getting-started-practice",
        ],
      },
      {
        key: "entry-points",
        name: "使用入口",
        description: "按你工作的环境选入口：终端、编辑器、桌面端、网页与云端。",
        readingOrder: "建议顺序：终端默认路径 -> VS Code / JetBrains -> 桌面端 -> Web / Cloud",
        matchers: ["08-vscode", "09-jetbrains", "10-desktop", "11-web-and-cloud"],
      },
      {
        key: "core-capabilities",
        name: "核心能力",
        description: "围绕项目初始化、界面、提示词、记忆和上下文，建立高频使用手感。",
        readingOrder: "建议顺序：项目准备 -> 界面与命令 -> 提示词 -> CLAUDE.md -> 上下文管理",
        matchers: [
          "03-how-it-works",
          "12-project-init",
          "13-project-structure",
          "14-interface-and-shortcuts",
          "15-prompting",
          "18-claude-md-guide",
          "19-context-management",
          "25-memory",
          "35-modes-and-control",
          "36-slash-commands",
          "37-checkpoints",
        ],
      },
      {
        key: "extensions",
        name: "扩展能力",
        description: "把多模态、MCP、子代理、插件、Skills 和更深层配置串成能力扩展层。",
        readingOrder: "建议顺序：多模态 -> MCP / 子代理 -> 插件与 Skills -> SDK 与高级配置",
        matchers: [
          "17-images-multimodal",
          "22-mcp",
          "23-subagents",
          "24-plugins",
          "26-agent-skills",
          "27-skills-in-practice",
          "28-skill-creator",
          "29-agent-teams",
          "33-hooks",
          "38-plugins-reference",
          "40-chrome",
          "41-parallel-tasks",
          "45-agent-sdk",
          "47-voice",
          "53-remotion-video",
        ],
      },
      {
        key: "workflow-best-practices",
        name: "工作流与最佳实践",
        description: "从计划、选型、Git、GitHub Actions 到反模式，收敛成更稳定的团队工作流。",
        readingOrder: "建议顺序：做计划 -> 常见工作流 -> 选功能 -> Git / CI -> 最佳实践与反模式",
        matchers: [
          "16-common-workflows",
          "30-choosing-features",
          "43-git-workflow",
          "44-github-actions",
          "48-capstone-project",
          "49-best-practices",
          "50-anti-patterns",
        ],
      },
      {
        key: "reference",
        name: "参考与排障",
        description: "把权限、安全、配置、CLI 参考、术语和排障内容收在一起，方便按需查找。",
        readingOrder: "建议顺序：先查权限安全，再看配置参考，最后再查故障与术语。",
        matchers: [
          "04-api-config",
          "05-third-party-models",
          "20-permissions",
          "21-security",
          "31-settings-json",
          "32-output-styles",
          "34-cli-reference",
          "42-env-vars",
          "46-dev-config",
          "51-troubleshooting",
          "52-glossary",
        ],
      },
    ],
  },
  codex: {
    label: "Codex",
    shortLabel: "Codex",
    route: "codex",
    eyebrow: "OpenAI 路线",
    heroTitle: "按主题掌握 Codex",
    heroDescription:
      "不再从 40 篇平铺清单里自己找路，而是按使用入口、配置模型、权限安全和自动化能力顺着读。",
    themeIntro: "适合先跑通第一条任务，再根据你所在环境继续进入配置、权限和扩展能力。",
    accent: "#56759a",
    accentSoft: "#edf3f8",
    surface: "#f8fbff",
    fallbackTheme: "更多",
    themes: [
      {
        key: "quick-start",
        name: "快速开始",
        description: "先认识 Codex、安装、跑第一条任务，再决定是否要继续迁移深用。",
        readingOrder: "建议顺序：认识 Codex -> 核心概念 -> 安装 -> 第一条任务",
        matchers: ["01-what-is-codex", "02-core-concepts", "03-install", "06-first-task"],
      },
      {
        key: "entry-points",
        name: "使用入口",
        description: "按设备和工作环境选择最适合的入口：桌面端、CLI、IDE 或 Cloud。",
        readingOrder: "建议顺序：桌面端 -> CLI -> IDE -> Cloud",
        matchers: ["07-desktop-app", "08-cli", "09-ide", "10-cloud"],
      },
      {
        key: "config-models",
        name: "配置与模型",
        description: "把 AGENTS.md、配置文件、模型选择、速度和记忆能力放在同一条配置线里。",
        readingOrder: "建议顺序：AGENTS.md -> prompting -> config -> memory -> models / speed",
        matchers: [
          "11-agents-md",
          "12-slash-commands",
          "13-prompting",
          "18-config",
          "19-memory",
          "30-models",
          "31-speed",
        ],
      },
      {
        key: "permissions-security",
        name: "权限与安全",
        description: "围绕权限、沙箱、安全和企业场景建立边界感，避免把执行力用成风险源。",
        readingOrder: "建议顺序：先读权限，再读安全，最后看企业与平台边界。",
        matchers: ["15-permissions", "16-security", "39-enterprise"],
      },
      {
        key: "extensions-automation",
        name: "扩展与自动化",
        description: "把 computer use、MCP、子代理、skills、plugins、automation 与 integrations 放在同一路径。",
        readingOrder: "建议顺序：外部能力 -> MCP / 子代理 -> Skills / Plugins -> 自动化与集成",
        matchers: [
          "17-computer-use",
          "20-mcp",
          "21-subagents",
          "22-skills",
          "23-plugins",
          "24-hooks",
          "27-automation",
          "28-noninteractive",
          "29-integrations",
        ],
      },
      {
        key: "migration-practice-reference",
        name: "迁移 / 最佳实践 / 参考",
        description: "把 worktrees、Git、迁移、速查、最佳实践、FAQ 和词汇表组织成后段资料区。",
        readingOrder: "建议顺序：工作流基础 -> 迁移 -> 速查与实践 -> FAQ / 词汇表",
        matchers: [
          "04-pricing",
          "05-third-party-models",
          "14-workflows",
          "25-worktrees",
          "26-git-github",
          "32-migrate-from-claude-code",
          "33-windows",
          "34-capstone",
          "35-cheatsheet",
          "36-best-practices",
          "37-faq",
          "38-glossary",
          "README",
        ],
      },
    ],
  },
};

function normalizeContentPath(globKey) {
  return globKey.replace("../content/upstream/", "");
}

function toSlug(file) {
  return file.replace(/\.md$/, "").split("/").pop();
}

function parseHash(hashValue) {
  const hash = (hashValue || "").replace(/^#\/?/, "");
  if (!hash) {
    return { type: "home" };
  }
  if (hash === "legacy") {
    return { type: "legacy" };
  }
  if (hash === "claude-code" || hash === "codex") {
    return { type: "category", category: hash };
  }
  if (hash.startsWith("article/")) {
    return { type: "article", file: decodeURIComponent(hash.slice("article/".length)) };
  }
  return { type: "home" };
}

function formatTime(input) {
  if (!input) {
    return "待同步";
  }
  return new Date(input).toLocaleString("zh-CN", { hour12: false });
}

function shortenCommit(commit) {
  return commit ? commit.slice(0, 7) : "待同步";
}

function buildSourceUrl(file) {
  if (!upstreamManifest.upstreamRepo || !upstreamManifest.upstreamCommit) {
    return null;
  }
  return `${upstreamManifest.upstreamRepo}/blob/${upstreamManifest.upstreamCommit}/${file}`;
}

function normalizeRelativePath(baseDir, target) {
  const cleanTarget = target.split("#")[0].split("?")[0];
  const segments = baseDir ? baseDir.split("/") : [];
  cleanTarget.split("/").forEach((part) => {
    if (!part || part === ".") {
      return;
    }
    if (part === "..") {
      segments.pop();
      return;
    }
    segments.push(part);
  });
  return segments.join("/");
}

function extractLeadingNumber(file) {
  const match = file.match(/\/(\d+)[-_]/);
  return match ? Number(match[1]) : null;
}

function humanizeSlug(slug) {
  return slug
    .replace(/\.md$/, "")
    .replace(/^\d+[-_]?/, "")
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function toPathLabel(file) {
  const parts = file.replace(/\.md$/, "").split("/");
  const name = parts.pop() || "";
  const dir = parts.pop() || "";
  return `${dir} / ${humanizeSlug(name)}`;
}

function getArticleTitle(article) {
  if (article.title && article.title !== "README") {
    return article.title;
  }
  if (article.raw) {
    const markdownTitle = extractTitleFromMarkdown(article.raw);
    if (markdownTitle) {
      return markdownTitle;
    }
  }
  return humanizeSlug(article.file.split("/").pop() || article.file);
}

function getArticleSummary(article) {
  const lines = String(article.raw || "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  for (const line of lines) {
    if (line.startsWith("#")) {
      continue;
    }
    if (line.startsWith("![")) {
      continue;
    }
    const cleaned = stripInlineMarkdown(line.replace(/^>\s*/, "").replace(/^[-*]\s+/, "")).trim();
    if (!cleaned) {
      continue;
    }
    return cleaned.length > 90 ? `${cleaned.slice(0, 90)}...` : cleaned;
  }

  return "保留上游正文原文，适合在对应主题路径里继续阅读。";
}

function classifyTheme(category, article) {
  const meta = CATEGORY_META[category];
  const slug = article.file.split("/").pop() || article.file;
  for (const theme of meta.themes) {
    if (theme.matchers.some((matcher) => slug.includes(matcher))) {
      return theme.name;
    }
  }
  return meta.fallbackTheme;
}

function App() {
  const [route, setRoute] = useState(() => parseHash(window.location.hash));

  useEffect(() => {
    const onHashChange = () => setRoute(parseHash(window.location.hash));
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  const contentIndex = useMemo(() => {
    const assetMap = {};
    Object.entries(imageFiles).forEach(([key, value]) => {
      assetMap[normalizeContentPath(key)] = value;
    });

    const allArticles = (upstreamManifest.sections || [])
      .filter((entry) => entry.category === "claude-code" || entry.category === "codex")
      .map((entry, index) => {
        const raw = markdownFiles[`../content/upstream/${entry.file}`] || "";
        const article = {
          ...entry,
          raw,
          index,
          slug: toSlug(entry.file),
        };
        return {
          ...article,
          title: getArticleTitle(article),
          summary: getArticleSummary(article),
          order: extractLeadingNumber(entry.file),
        };
      });

    const byFile = new Map(allArticles.map((article) => [article.file, article]));
    const byCategory = {};
    const themeLookup = {};
    const articleOrder = {};

    Object.keys(CATEGORY_META).forEach((category) => {
      const categoryArticles = allArticles
        .filter((article) => article.category === category)
        .sort((a, b) => {
          if (a.order !== null && b.order !== null) {
            return a.order - b.order;
          }
          return a.file.localeCompare(b.file);
        });

      const meta = CATEGORY_META[category];
      const grouped = meta.themes.map((theme) => ({
        ...theme,
        articles: categoryArticles.filter((article) => classifyTheme(category, article) === theme.name),
      }));

      const usedFiles = new Set(grouped.flatMap((theme) => theme.articles.map((article) => article.file)));
      const fallbackArticles = categoryArticles.filter((article) => !usedFiles.has(article.file));

      if (fallbackArticles.length > 0) {
        grouped.push({
          key: "fallback",
          name: meta.fallbackTheme,
          description: "没有落进主主题路径的文章会先放在这里，保证上游同步内容仍然完整可读。",
          readingOrder: "建议顺序：按需查阅，优先回到与你当前问题最接近的主题。",
          articles: fallbackArticles,
        });
      }

      grouped.forEach((theme, themeIndex) => {
        themeLookup[category] ||= {};
        themeLookup[category][theme.name] = theme;
        theme.articles.forEach((article, articleIndex) => {
          articleOrder[article.file] = {
            sequence: articleIndex + 1,
            themeName: theme.name,
            themeKey: theme.key,
            themeIndex,
          };
        });
      });

      byCategory[category] = {
        articles: categoryArticles,
        themes: grouped,
      };
    });

    return { assetMap, byFile, byCategory, themeLookup, articleOrder };
  }, []);

  const currentArticle = route.type === "article" ? contentIndex.byFile.get(route.file) : null;

  const navigate = (nextRoute) => {
    let nextHash = "#/";
    if (nextRoute.type === "category") {
      nextHash = `#/${nextRoute.category}`;
    } else if (nextRoute.type === "article") {
      nextHash = `#/article/${encodeURIComponent(nextRoute.file)}`;
    } else if (nextRoute.type === "legacy") {
      nextHash = "#/legacy";
    }
    window.location.hash = nextHash;
  };

  const resolveAsset = (article, target) => {
    if (!target) {
      return null;
    }
    if (/^(https?:)?\/\//.test(target) || target.startsWith("data:")) {
      return target;
    }
    const baseDir = article.file.includes("/") ? article.file.slice(0, article.file.lastIndexOf("/")) : "";
    const normalized = normalizeRelativePath(baseDir, target);
    return contentIndex.assetMap[normalized] || null;
  };

  const resolveLink = (article, target) => {
    if (!target) {
      return { type: "external", href: "#" };
    }
    if (/^(https?:)?\/\//.test(target) || target.startsWith("mailto:")) {
      return { type: "external", href: target };
    }
    const baseDir = article.file.includes("/") ? article.file.slice(0, article.file.lastIndexOf("/")) : "";
    const normalized = normalizeRelativePath(baseDir, target);
    if (normalized.endsWith(".md") && contentIndex.byFile.has(normalized)) {
      return { type: "article", file: normalized };
    }
    const asset = contentIndex.assetMap[normalized];
    if (asset) {
      return { type: "external", href: asset };
    }
    return { type: "external", href: target };
  };

  let page = null;
  if (route.type === "category") {
    page = (
      <CategoryPage
        category={route.category}
        categoryData={contentIndex.byCategory[route.category]}
        onOpenArticle={(file) => navigate({ type: "article", file })}
      />
    );
  } else if (route.type === "article" && currentArticle) {
    page = (
      <ArticlePage
        article={currentArticle}
        categoryData={contentIndex.byCategory[currentArticle.category]}
        articleMeta={contentIndex.articleOrder[currentArticle.file]}
        onGoHome={() => navigate({ type: "home" })}
        onGoCategory={() => navigate({ type: "category", category: currentArticle.category })}
        onOpenArticle={(file) => navigate({ type: "article", file })}
        resolveAsset={(target) => resolveAsset(currentArticle, target)}
        resolveLink={(target) => resolveLink(currentArticle, target)}
      />
    );
  } else if (route.type === "legacy") {
    page = <LegacyPage onGoCategory={(category) => navigate({ type: "category", category })} />;
  } else {
    page = (
      <HomePage
        counts={{
          "claude-code": contentIndex.byCategory["claude-code"]?.articles.length || 0,
          codex: contentIndex.byCategory.codex?.articles.length || 0,
        }}
        onGoCategory={(category) => navigate({ type: "category", category })}
        onGoLegacy={() => navigate({ type: "legacy" })}
      />
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: COLORS.page, color: COLORS.text }}>
      <style>{globalStyles}</style>
      <TopNav route={route} onNavigate={navigate} />
      <main style={{ maxWidth: SHELL_WIDTH, margin: "0 auto", padding: "24px 24px 72px" }}>{page}</main>
      <footer
        style={{
          borderTop: `1px solid ${COLORS.line}`,
          padding: "22px 24px 32px",
          color: COLORS.textDim,
          fontSize: 13,
        }}
      >
        <div style={{ maxWidth: SHELL_WIDTH, margin: "0 auto" }}>
          Claude Code & Codex 完全指南 · 上游来源
          {" "}
          <a href={upstreamManifest.upstreamRepo} target="_blank" rel="noreferrer" style={anchorStyle}>
            stormzhang/ai-coding-guide
          </a>
          {" "}
          · 同步 commit {shortenCommit(upstreamManifest.upstreamCommit)}
        </div>
      </footer>
    </div>
  );
}

function TopNav({ route, onNavigate }) {
  const items = [
    { label: "首页", route: { type: "home" }, active: route.type === "home" },
    {
      label: "Claude Code",
      route: { type: "category", category: "claude-code" },
      active:
        (route.type === "category" && route.category === "claude-code") ||
        (route.type === "article" && route.file.startsWith("claude-code/")),
    },
    {
      label: "Codex",
      route: { type: "category", category: "codex" },
      active:
        (route.type === "category" && route.category === "codex") ||
        (route.type === "article" && route.file.startsWith("codex/")),
    },
    { label: "本地旧版", route: { type: "legacy" }, active: route.type === "legacy" },
  ];

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 20,
        borderBottom: `1px solid ${COLORS.line}`,
        backdropFilter: "blur(14px)",
        background: "rgba(246, 244, 239, 0.88)",
      }}
    >
      <div
        style={{
          maxWidth: SHELL_WIDTH,
          margin: "0 auto",
          padding: "14px 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 14,
          flexWrap: "wrap",
        }}
      >
        <button onClick={() => onNavigate({ type: "home" })} style={brandButtonStyle}>
          <span style={brandBadgeStyle}>CC</span>
          <span>
            Claude Code & Codex
            <span style={{ display: "block", fontSize: 12, color: COLORS.textDim, fontWeight: 500 }}>
              按主题学习路径整理的中文资料站
            </span>
          </span>
        </button>

        <nav style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {items.map((item) => (
            <button
              key={item.label}
              onClick={() => onNavigate(item.route)}
              style={{
                ...plainButton({
                  padding: "8px 14px",
                  borderRadius: 999,
                  border: `1px solid ${item.active ? COLORS.accent : COLORS.line}`,
                  background: item.active ? COLORS.accentSoft : "rgba(255,255,255,0.48)",
                  color: item.active ? COLORS.accentDeep : COLORS.textSoft,
                  fontWeight: item.active ? 700 : 600,
                }),
              }}
            >
              {item.label}
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
}

function HomePage({ counts, onGoCategory, onGoLegacy }) {
  return (
    <div style={{ display: "grid", gap: 22 }}>
      <section style={heroPanelStyle}>
        <div style={{ display: "grid", gap: 18, maxWidth: 860 }}>
          <MetaPill>学习站首页</MetaPill>
          <h1 style={{ margin: 0, fontSize: "clamp(40px, 6vw, 58px)", lineHeight: 1.04, letterSpacing: 0 }}>
            不从文章堆里找路，先从主题学习路径开始。
          </h1>
          <p style={{ margin: 0, fontSize: 18, color: COLORS.textSoft, lineHeight: 1.8 }}>
            这里保留上游 Markdown 正文，但入口不再是 53 篇和 40 篇平铺列表。Claude Code 与 Codex
            都重新整理成主题目录，适合先按路径学习，再进入真实文章阅读页。
          </p>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <PrimaryButton onClick={() => onGoCategory("claude-code")}>从 Claude Code 开始</PrimaryButton>
            <SecondaryButton onClick={() => onGoCategory("codex")}>从 Codex 开始</SecondaryButton>
            <GhostButton onClick={onGoLegacy}>查看本地旧版</GhostButton>
          </div>
        </div>
      </section>

      <section
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: 18,
        }}
      >
        {Object.entries(CATEGORY_META).map(([category, meta]) => (
          <PathwayCard
            key={category}
            meta={meta}
            count={counts[category]}
            onOpen={() => onGoCategory(category)}
          />
        ))}
      </section>

      <section
        style={{
          display: "grid",
          gridTemplateColumns: "1.15fr 0.85fr",
          gap: 18,
        }}
      >
        <InfoPanel
          title="为什么要这样整理"
          description="上游同步解决了内容来源，但没有解决用户怎么学。新的首页不再把资料当目录清单，而是把它们变成可跟读、可回看、可按主题切换的学习站。"
        >
          <div style={{ display: "grid", gap: 10 }}>
            {[
              "先看到学习路径，而不是几十篇并列卡片。",
              "分类页按主题区块组织，每块都给一句用途和建议阅读顺序。",
              "文章页保留真实 Markdown 正文，同时补齐返回、同主题、上一篇/下一篇。",
            ].map((item) => (
              <ChecklistRow key={item} text={item} />
            ))}
          </div>
        </InfoPanel>

        <InfoPanel
          title="站点现在的阅读感"
          description="整体视觉回到更轻盈、偏教程的气质，不做后台表格感，也不把导航做成一排厚重蓝按钮。"
        >
          <div style={{ display: "grid", gap: 10 }}>
            <ToneCard label="布局" text="宽屏控制在约 1240px，留出呼吸感，也不再压得过窄。" />
            <ToneCard label="导航" text="顶部保留四个入口，但样式回到轻薄、半透明、低压感。" />
            <ToneCard label="正文" text="保留原文渲染，外层补齐教程页常见的路径导航和邻近阅读。" />
          </div>
        </InfoPanel>
      </section>
    </div>
  );
}

function CategoryPage({ category, categoryData, onOpenArticle }) {
  const meta = CATEGORY_META[category];

  return (
    <div style={{ display: "grid", gap: 22 }}>
      <section
        style={{
          ...heroPanelStyle,
          background: `linear-gradient(135deg, ${meta.surface} 0%, ${COLORS.panel} 58%, ${COLORS.pageGlow} 100%)`,
          borderColor: meta.accentSoft,
        }}
      >
        <div style={{ display: "grid", gap: 12, maxWidth: 900 }}>
          <MetaPill>{meta.eyebrow}</MetaPill>
          <h1 style={{ margin: 0, fontSize: "clamp(34px, 4.8vw, 50px)", lineHeight: 1.08 }}>{meta.heroTitle}</h1>
          <p style={{ margin: 0, color: COLORS.textSoft, fontSize: 17, lineHeight: 1.8 }}>{meta.heroDescription}</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
            <StatPill label="主题" value={`${categoryData.themes.length} 组`} />
            <StatPill label="文章" value={`${categoryData.articles.length} 篇`} />
            <StatPill label="同步时间" value={formatTime(upstreamManifest.updatedAt)} />
          </div>
        </div>
      </section>

      <section style={{ padding: "0 2px" }}>
        <div style={{ marginBottom: 18, color: COLORS.textSoft, fontSize: 15, lineHeight: 1.8 }}>{meta.themeIntro}</div>
        <div style={{ display: "grid", gap: 18 }}>
          {categoryData.themes.map((theme) => (
            <ThemeSection key={theme.key} category={category} theme={theme} onOpenArticle={onOpenArticle} />
          ))}
        </div>
      </section>
    </div>
  );
}

function ThemeSection({ category, theme, onOpenArticle }) {
  const meta = CATEGORY_META[category];

  return (
    <section
      style={{
        padding: "24px 24px 22px",
        borderRadius: 20,
        border: `1px solid ${COLORS.line}`,
        background: COLORS.panel,
        boxShadow: COLORS.shadowSoft,
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0, 1fr)",
          gap: 10,
          marginBottom: 18,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
          <span
            style={{
              width: 34,
              height: 34,
              borderRadius: 12,
              background: meta.accentSoft,
              color: meta.accent,
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 14,
              fontWeight: 800,
            }}
          >
            {String(theme.articles.length).padStart(2, "0")}
          </span>
          <h2 style={{ margin: 0, fontSize: 28, lineHeight: 1.15 }}>{theme.name}</h2>
        </div>
        <p style={{ margin: 0, color: COLORS.textSoft, fontSize: 15, lineHeight: 1.8 }}>{theme.description}</p>
        <div
          style={{
            padding: "11px 14px",
            borderRadius: 14,
            background: meta.surface,
            color: COLORS.textSoft,
            fontSize: 14,
            lineHeight: 1.7,
          }}
        >
          {theme.readingOrder}
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(270px, 1fr))",
          gap: 14,
        }}
      >
        {theme.articles.map((article, index) => (
          <ArticleCard
            key={article.file}
            article={article}
            sequence={index + 1}
            accentColor={meta.accent}
            surfaceColor={meta.surface}
            onOpen={() => onOpenArticle(article.file)}
          />
        ))}
      </div>
    </section>
  );
}

function ArticlePage({ article, categoryData, articleMeta, onGoHome, onGoCategory, onOpenArticle, resolveAsset, resolveLink }) {
  const meta = CATEGORY_META[article.category];
  const theme = categoryData.themes.find((item) => item.name === articleMeta.themeName) || categoryData.themes[0];
  const themeArticles = theme?.articles || [];
  const articleIndex = themeArticles.findIndex((item) => item.file === article.file);
  const previousArticle = articleIndex > 0 ? themeArticles[articleIndex - 1] : null;
  const nextArticle = articleIndex >= 0 && articleIndex < themeArticles.length - 1 ? themeArticles[articleIndex + 1] : null;
  const sourceUrl = buildSourceUrl(article.file);

  return (
    <div style={{ display: "grid", gap: 22 }}>
      <section
        style={{
          padding: "24px 26px",
          borderRadius: 20,
          border: `1px solid ${COLORS.line}`,
          background: COLORS.panel,
          boxShadow: COLORS.shadowSoft,
        }}
      >
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 16 }}>
          <button onClick={onGoHome} style={crumbButtonStyle}>
            首页
          </button>
          <span style={crumbDividerStyle}>/</span>
          <button onClick={onGoCategory} style={crumbButtonStyle}>
            {meta.label}
          </button>
          <span style={crumbDividerStyle}>/</span>
          <span style={{ color: COLORS.textSoft, fontSize: 14 }}>{theme.name}</span>
        </div>

        <div style={{ display: "grid", gap: 12 }}>
          <MetaPill>
            {meta.shortLabel} · {theme.name} · 第 {articleMeta.sequence} 篇
          </MetaPill>
          <h1 style={{ margin: 0, fontSize: "clamp(32px, 4.2vw, 46px)", lineHeight: 1.08 }}>{article.title}</h1>
          <p style={{ margin: 0, color: COLORS.textSoft, fontSize: 16, lineHeight: 1.8 }}>{article.summary}</p>
        </div>

        <div
          style={{
            display: "flex",
            gap: 10,
            flexWrap: "wrap",
            marginTop: 18,
          }}
        >
          <StatPill label="路径" value={toPathLabel(article.file)} />
          <StatPill label="同步" value={formatTime(upstreamManifest.updatedAt)} />
          <StatPill label="上游 commit" value={shortenCommit(upstreamManifest.upstreamCommit)} />
        </div>

        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 18 }}>
          <SecondaryButton onClick={onGoCategory}>返回主题目录</SecondaryButton>
          {sourceUrl ? (
            <a href={sourceUrl} target="_blank" rel="noreferrer" style={linkChipStyle}>
              查看上游原文
            </a>
          ) : null}
        </div>
      </section>

      <div className="article-layout">
        <article
          style={{
            minWidth: 0,
            padding: "28px 30px",
            borderRadius: 22,
            border: `1px solid ${COLORS.line}`,
            background: COLORS.card,
            boxShadow: COLORS.shadow,
          }}
        >
          <MarkdownRenderer
            markdown={article.raw}
            resolveAsset={resolveAsset}
            resolveLink={resolveLink}
            onOpenArticle={onOpenArticle}
          />
        </article>

        <aside style={{ display: "grid", gap: 14, alignSelf: "start" }}>
          <SidebarPanel title="同主题文章" hint={`${theme.name} · ${themeArticles.length} 篇`}>
            <div style={{ display: "grid", gap: 10 }}>
              {themeArticles.map((item, index) => (
                <button
                  key={item.file}
                  onClick={() => onOpenArticle(item.file)}
                  style={{
                    ...plainButton({
                      textAlign: "left",
                      width: "100%",
                      padding: "12px 12px 12px 14px",
                      borderRadius: 14,
                      border: `1px solid ${item.file === article.file ? meta.accentSoft : COLORS.line}`,
                      background: item.file === article.file ? meta.surface : COLORS.panel,
                    }),
                  }}
                >
                  <div style={{ fontSize: 12, color: COLORS.textDim, marginBottom: 5 }}>
                    {String(index + 1).padStart(2, "0")} · {toPathLabel(item.file)}
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 700, lineHeight: 1.45 }}>{item.title}</div>
                </button>
              ))}
            </div>
          </SidebarPanel>

          <SidebarPanel title="同目录下一篇" hint="优先保持阅读连续性">
            {nextArticle ? (
              <ArticleMiniCard article={nextArticle} label={`下一篇 · ${String(articleIndex + 2).padStart(2, "0")}`} onOpen={() => onOpenArticle(nextArticle.file)} />
            ) : (
              <SidebarEmpty text="这一主题已经读到最后一篇了，可以回到目录切到下一主题。" />
            )}
          </SidebarPanel>
        </aside>
      </div>

      <section
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: 16,
        }}
      >
        <NeighborCard
          label="上一篇"
          article={previousArticle}
          fallback="这是这个主题里的第一篇。"
          onOpen={onOpenArticle}
        />
        <NeighborCard
          label="下一篇"
          article={nextArticle}
          fallback="这个主题已经读完，可以回到目录继续下一组。"
          onOpen={onOpenArticle}
        />
      </section>
    </div>
  );
}

function LegacyPage({ onGoCategory }) {
  return (
    <div style={{ display: "grid", gap: 22 }}>
      <section style={heroPanelStyle}>
        <div style={{ display: "grid", gap: 14, maxWidth: 880 }}>
          <MetaPill>保留旧入口</MetaPill>
          <h1 style={{ margin: 0, fontSize: "clamp(32px, 4.4vw, 46px)", lineHeight: 1.1 }}>本地旧版仍在，但不再占主路径。</h1>
          <p style={{ margin: 0, color: COLORS.textSoft, fontSize: 16, lineHeight: 1.8 }}>
            旧版主要承担对照作用。现在真正的阅读入口已经切到主题目录与上游 Markdown 正文页，不需要再围着手写导览转。
          </p>
        </div>
      </section>

      <section
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: 16,
        }}
      >
        <InfoCard title="之前的问题" description="目录是主角，文章正文只是附属，用户很难知道应该先读什么。" />
        <InfoCard title="现在的处理" description="首页只负责给路，分类页按主题组织，文章页才承接真正内容。" />
        <InfoCard title="下一步阅读" description="直接进入 Claude Code 或 Codex 目录，按主题顺着读即可。" />
      </section>

      <section style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        <PrimaryButton onClick={() => onGoCategory("claude-code")}>打开 Claude Code 目录</PrimaryButton>
        <SecondaryButton onClick={() => onGoCategory("codex")}>打开 Codex 目录</SecondaryButton>
      </section>
    </div>
  );
}

function PathwayCard({ meta, count, onOpen }) {
  return (
    <button
      onClick={onOpen}
      style={{
        ...plainButton({
          width: "100%",
          textAlign: "left",
          padding: "24px 24px 22px",
          borderRadius: 22,
          border: `1px solid ${COLORS.line}`,
          background: `linear-gradient(180deg, ${meta.surface} 0%, ${COLORS.panel} 100%)`,
          boxShadow: COLORS.shadowSoft,
        }),
      }}
    >
      <div style={{ display: "grid", gap: 12 }}>
        <MetaPill>{meta.eyebrow}</MetaPill>
        <div>
          <h2 style={{ margin: 0, fontSize: 30, lineHeight: 1.08 }}>{meta.label}</h2>
          <p style={{ margin: "10px 0 0", color: COLORS.textSoft, fontSize: 15, lineHeight: 1.75 }}>{meta.heroDescription}</p>
        </div>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <StatPill label="主题" value={`${meta.themes.length} 组`} />
          <StatPill label="文章" value={`${count} 篇`} />
        </div>
        <div
          style={{
            paddingTop: 8,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
            color: meta.accent,
            fontWeight: 700,
          }}
        >
          <span>进入主题目录</span>
          <span style={{ fontSize: 20 }}>→</span>
        </div>
      </div>
    </button>
  );
}

function ArticleCard({ article, sequence, accentColor, surfaceColor, onOpen }) {
  return (
    <button
      onClick={onOpen}
      style={{
        ...plainButton({
          width: "100%",
          textAlign: "left",
          padding: "18px 18px 16px",
          borderRadius: 18,
          border: `1px solid ${COLORS.line}`,
          background: COLORS.card,
          minHeight: 190,
        }),
      }}
    >
      <div style={{ display: "grid", gap: 10 }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center" }}>
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: 34,
              height: 34,
              borderRadius: 12,
              background: surfaceColor,
              color: accentColor,
              fontWeight: 800,
              fontSize: 13,
            }}
          >
            {String(sequence).padStart(2, "0")}
          </span>
          <span style={{ fontSize: 12, color: COLORS.textDim }}>{toPathLabel(article.file)}</span>
        </div>
        <div>
          <h3 style={{ margin: 0, fontSize: 20, lineHeight: 1.25 }}>{article.title}</h3>
          <p style={{ margin: "10px 0 0", color: COLORS.textSoft, fontSize: 14, lineHeight: 1.75 }}>{article.summary}</p>
        </div>
        <div style={{ color: accentColor, fontSize: 13, fontWeight: 700 }}>阅读全文</div>
      </div>
    </button>
  );
}

function SidebarPanel({ title, hint, children }) {
  return (
    <section
      style={{
        padding: "18px 18px 16px",
        borderRadius: 18,
        border: `1px solid ${COLORS.line}`,
        background: COLORS.panel,
      }}
    >
      <div style={{ marginBottom: 12 }}>
        <div style={{ fontSize: 16, fontWeight: 800, lineHeight: 1.2 }}>{title}</div>
        {hint ? <div style={{ marginTop: 5, fontSize: 12, color: COLORS.textDim }}>{hint}</div> : null}
      </div>
      {children}
    </section>
  );
}

function ArticleMiniCard({ article, label, onOpen }) {
  return (
    <button
      onClick={onOpen}
      style={{
        ...plainButton({
          width: "100%",
          textAlign: "left",
          padding: "12px 14px",
          borderRadius: 14,
          border: `1px solid ${COLORS.line}`,
          background: COLORS.card,
        }),
      }}
    >
      <div style={{ fontSize: 12, color: COLORS.textDim, marginBottom: 5 }}>{label}</div>
      <div style={{ fontSize: 15, fontWeight: 700, lineHeight: 1.45 }}>{article.title}</div>
      <div style={{ marginTop: 6, fontSize: 12, color: COLORS.textSoft }}>{toPathLabel(article.file)}</div>
    </button>
  );
}

function NeighborCard({ label, article, fallback, onOpen }) {
  return (
    <section
      style={{
        padding: "18px 20px",
        borderRadius: 18,
        border: `1px solid ${COLORS.line}`,
        background: COLORS.panel,
      }}
    >
      <div style={{ fontSize: 12, color: COLORS.textDim, marginBottom: 8 }}>{label}</div>
      {article ? (
        <button onClick={() => onOpen(article.file)} style={plainButton({ textAlign: "left", width: "100%" })}>
          <div style={{ fontSize: 19, fontWeight: 800, lineHeight: 1.3 }}>{article.title}</div>
          <div style={{ marginTop: 8, color: COLORS.textSoft, fontSize: 14 }}>{toPathLabel(article.file)}</div>
        </button>
      ) : (
        <div style={{ color: COLORS.textSoft, fontSize: 14, lineHeight: 1.7 }}>{fallback}</div>
      )}
    </section>
  );
}

function InfoPanel({ title, description, children }) {
  return (
    <section
      style={{
        padding: "22px 24px",
        borderRadius: 20,
        border: `1px solid ${COLORS.line}`,
        background: COLORS.panel,
        boxShadow: COLORS.shadowSoft,
      }}
    >
      <h2 style={{ margin: 0, fontSize: 24, lineHeight: 1.15 }}>{title}</h2>
      <p style={{ margin: "12px 0 0", color: COLORS.textSoft, fontSize: 15, lineHeight: 1.8 }}>{description}</p>
      <div style={{ marginTop: 16 }}>{children}</div>
    </section>
  );
}

function InfoCard({ title, description }) {
  return (
    <section
      style={{
        padding: "20px 20px 18px",
        borderRadius: 18,
        border: `1px solid ${COLORS.line}`,
        background: COLORS.panel,
      }}
    >
      <h3 style={{ margin: 0, fontSize: 20, lineHeight: 1.2 }}>{title}</h3>
      <p style={{ margin: "10px 0 0", color: COLORS.textSoft, fontSize: 14, lineHeight: 1.75 }}>{description}</p>
    </section>
  );
}

function ToneCard({ label, text }) {
  return (
    <div
      style={{
        padding: "12px 14px",
        borderRadius: 14,
        border: `1px solid ${COLORS.line}`,
        background: COLORS.card,
      }}
    >
      <div style={{ fontSize: 13, fontWeight: 800, color: COLORS.accentDeep, marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: 14, color: COLORS.textSoft, lineHeight: 1.7 }}>{text}</div>
    </div>
  );
}

function ChecklistRow({ text }) {
  return (
    <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
      <span
        style={{
          width: 22,
          height: 22,
          borderRadius: 11,
          background: COLORS.accentSoft,
          color: COLORS.accentDeep,
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 12,
          fontWeight: 800,
          flexShrink: 0,
          marginTop: 1,
        }}
      >
        ✓
      </span>
      <span style={{ color: COLORS.textSoft, fontSize: 14, lineHeight: 1.7 }}>{text}</span>
    </div>
  );
}

function SidebarEmpty({ text }) {
  return <div style={{ color: COLORS.textSoft, fontSize: 14, lineHeight: 1.7 }}>{text}</div>;
}

function StatPill({ label, value }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        padding: "8px 10px",
        borderRadius: 999,
        border: `1px solid ${COLORS.line}`,
        background: COLORS.panel,
        fontSize: 13,
      }}
    >
      <span style={{ color: COLORS.textDim }}>{label}</span>
      <span style={{ fontWeight: 700 }}>{value}</span>
    </span>
  );
}

function PrimaryButton({ children, onClick }) {
  return (
    <button
      onClick={onClick}
      style={plainButton({
        padding: "12px 18px",
        borderRadius: 14,
        background: COLORS.accent,
        color: "#fff",
        fontWeight: 700,
        boxShadow: "0 12px 24px rgba(199, 104, 47, 0.22)",
      })}
    >
      {children}
    </button>
  );
}

function SecondaryButton({ children, onClick }) {
  return (
    <button
      onClick={onClick}
      style={plainButton({
        padding: "12px 18px",
        borderRadius: 14,
        border: `1px solid ${COLORS.line}`,
        background: COLORS.panel,
        color: COLORS.text,
        fontWeight: 700,
      })}
    >
      {children}
    </button>
  );
}

function GhostButton({ children, onClick }) {
  return (
    <button
      onClick={onClick}
      style={plainButton({
        padding: "12px 18px",
        borderRadius: 14,
        color: COLORS.textSoft,
        fontWeight: 700,
      })}
    >
      {children}
    </button>
  );
}

function MetaPill({ children }) {
  return (
    <span
      style={{
        display: "inline-flex",
        width: "fit-content",
        alignItems: "center",
        padding: "8px 12px",
        borderRadius: 999,
        background: COLORS.accentSoft,
        color: COLORS.accentDeep,
        fontSize: 13,
        fontWeight: 800,
      }}
    >
      {children}
    </span>
  );
}

function plainButton(extra) {
  return {
    border: "none",
    background: "transparent",
    cursor: "pointer",
    font: "inherit",
    color: "inherit",
    ...extra,
  };
}

const globalStyles = `
  * { box-sizing: border-box; }
  body {
    margin: 0;
    font-family: "Inter", "Noto Sans SC", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    color: ${COLORS.text};
    background:
      radial-gradient(circle at top left, rgba(255,255,255,0.88) 0%, rgba(255,255,255,0) 32%),
      linear-gradient(180deg, ${COLORS.pageGlow} 0%, ${COLORS.page} 35%, #f4f0e8 100%);
  }
  code, pre {
    font-family: "SFMono-Regular", Consolas, "Liberation Mono", Menlo, monospace;
  }
  a {
    color: ${COLORS.accentDeep};
  }
  .article-layout {
    display: grid;
    grid-template-columns: minmax(0, 1fr) 294px;
    gap: 20px;
    align-items: start;
  }
  @media (max-width: 1080px) {
    .article-layout {
      grid-template-columns: minmax(0, 1fr);
    }
  }
  @media (max-width: 720px) {
    body {
      font-size: 15px;
    }
  }
`;

const anchorStyle = {
  color: COLORS.accentDeep,
  textDecoration: "none",
  fontWeight: 700,
};

const linkChipStyle = {
  display: "inline-flex",
  alignItems: "center",
  padding: "11px 16px",
  borderRadius: 14,
  textDecoration: "none",
  border: `1px solid ${COLORS.line}`,
  background: COLORS.panel,
  color: COLORS.accentDeep,
  fontWeight: 700,
};

const heroPanelStyle = {
  padding: "34px 34px 30px",
  borderRadius: 28,
  border: `1px solid ${COLORS.line}`,
  background: `linear-gradient(135deg, ${COLORS.panelStrong} 0%, ${COLORS.panel} 52%, ${COLORS.pageGlow} 100%)`,
  boxShadow: COLORS.shadow,
};

const brandButtonStyle = plainButton({
  display: "inline-flex",
  alignItems: "center",
  gap: 12,
  textAlign: "left",
});

const brandBadgeStyle = {
  width: 40,
  height: 40,
  borderRadius: 14,
  background: COLORS.accentSoft,
  color: COLORS.accentDeep,
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  fontWeight: 900,
  letterSpacing: 0,
};

const crumbButtonStyle = plainButton({
  color: COLORS.accentDeep,
  fontSize: 14,
  fontWeight: 700,
});

const crumbDividerStyle = {
  color: COLORS.textDim,
  fontSize: 14,
};

export default App;
