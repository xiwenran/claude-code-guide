import React from "react";

const elementStyles = {
  paragraph: {
    margin: "0 0 18px",
    lineHeight: 1.82,
    fontSize: 17,
    color: "#1d2733",
  },
  heading: {
    margin: "32px 0 14px",
    lineHeight: 1.25,
    color: "#111b26",
  },
  list: {
    margin: "0 0 20px",
    paddingLeft: 24,
    lineHeight: 1.8,
    fontSize: 17,
    color: "#1d2733",
  },
  blockquote: {
    margin: "0 0 22px",
    padding: "14px 18px",
    borderLeft: "4px solid #0f62fe",
    background: "#f7fbff",
    color: "#35506d",
    lineHeight: 1.8,
    fontSize: 16,
  },
  codeBlockWrap: {
    margin: "0 0 22px",
    borderRadius: 14,
    overflow: "hidden",
    background: "#0f1720",
  },
  codeBlock: {
    margin: 0,
    padding: "18px 20px",
    overflowX: "auto",
    color: "#e4f0ff",
    fontSize: 14,
    lineHeight: 1.7,
  },
  inlineCode: {
    padding: "2px 6px",
    borderRadius: 6,
    background: "#eef3f8",
    fontSize: "0.92em",
  },
  image: {
    display: "block",
    maxWidth: "100%",
    height: "auto",
    borderRadius: 12,
    margin: "8px 0 6px",
    border: "1px solid #d9e1ea",
  },
  figcaption: {
    color: "#5f6f82",
    fontSize: 14,
    lineHeight: 1.6,
  },
};

export function extractTitleFromMarkdown(markdown) {
  const lines = String(markdown || "").split("\n");
  for (const line of lines) {
    const match = line.match(/^#\s+(.+)$/);
    if (match) {
      return stripInlineMarkdown(match[1]).trim();
    }
  }
  return "";
}

export function stripInlineMarkdown(input) {
  return String(input || "")
    .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, "$1")
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, "$1")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/`([^`]+)`/g, "$1");
}

export function MarkdownRenderer({ markdown, resolveAsset, resolveLink, onOpenArticle }) {
  const blocks = parseMarkdown(markdown);

  return React.createElement(
    React.Fragment,
    null,
    blocks.map((block, index) => renderBlock(block, index, { resolveAsset, resolveLink, onOpenArticle })),
  );
}

function renderBlock(block, index, helpers) {
  if (block.type === "heading") {
    const Tag = `h${Math.min(block.level, 6)}`;
    return React.createElement(
      Tag,
      {
        key: `heading-${index}`,
        style: {
          ...elementStyles.heading,
          fontSize: headingSize(block.level),
        },
      },
      renderInline(block.text, helpers, `heading-${index}`),
    );
  }

  if (block.type === "paragraph") {
    const imageOnlyMatch = block.text.trim().match(/^!\[([^\]]*)\]\(([^)]+)\)$/);
    if (imageOnlyMatch) {
      const alt = imageOnlyMatch[1];
      const src = helpers.resolveAsset(imageOnlyMatch[2]);
      if (!src) {
        return React.createElement(
          "p",
          { key: `image-fallback-${index}`, style: elementStyles.paragraph },
          `[图片未映射：${imageOnlyMatch[2]}]`,
        );
      }
      return React.createElement(
        "figure",
        { key: `figure-${index}`, style: { margin: "0 0 24px" } },
        React.createElement("img", { src, alt, style: elementStyles.image }),
        alt ? React.createElement("figcaption", { style: elementStyles.figcaption }, alt) : null,
      );
    }

    return React.createElement(
      "p",
      { key: `paragraph-${index}`, style: elementStyles.paragraph },
      renderInline(block.text, helpers, `paragraph-${index}`),
    );
  }

  if (block.type === "blockquote") {
    return React.createElement(
      "blockquote",
      { key: `blockquote-${index}`, style: elementStyles.blockquote },
      block.lines.map((line, lineIndex) =>
        React.createElement(
          "p",
          { key: `quote-line-${index}-${lineIndex}`, style: { margin: lineIndex === block.lines.length - 1 ? 0 : "0 0 10px" } },
          renderInline(line, helpers, `quote-${index}-${lineIndex}`),
        ),
      ),
    );
  }

  if (block.type === "unordered-list" || block.type === "ordered-list") {
    const Tag = block.type === "ordered-list" ? "ol" : "ul";
    return React.createElement(
      Tag,
      { key: `list-${index}`, style: elementStyles.list },
      block.items.map((item, itemIndex) =>
        React.createElement(
          "li",
          {
            key: `list-item-${index}-${itemIndex}`,
            style: { marginBottom: itemIndex === block.items.length - 1 ? 0 : 8 },
          },
          renderInline(item, helpers, `list-${index}-${itemIndex}`),
        ),
      ),
    );
  }

  if (block.type === "code") {
    return React.createElement(
      "div",
      { key: `code-${index}`, style: elementStyles.codeBlockWrap },
      React.createElement("pre", { style: elementStyles.codeBlock }, block.code),
    );
  }

  return null;
}

function renderInline(text, helpers, keyPrefix) {
  const output = [];
  const pattern = /!\[([^\]]*)\]\(([^)]+)\)|\[([^\]]+)\]\(([^)]+)\)|\*\*([^*]+)\*\*|`([^`]+)`/g;
  let lastIndex = 0;
  let match;

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > lastIndex) {
      output.push(text.slice(lastIndex, match.index));
    }

    if (match[1] !== undefined) {
      const src = helpers.resolveAsset(match[2]);
      if (src) {
        output.push(
          React.createElement("img", {
            key: `${keyPrefix}-img-${match.index}`,
            src,
            alt: match[1],
            style: { ...elementStyles.image, display: "inline-block", maxHeight: 320, margin: "6px 0" },
          }),
        );
      } else {
        output.push(match[1] || match[2]);
      }
    } else if (match[3] !== undefined) {
      const link = helpers.resolveLink(match[4]);
      if (link.type === "article") {
        output.push(
          React.createElement(
            "button",
            {
              key: `${keyPrefix}-link-${match.index}`,
              onClick: () => helpers.onOpenArticle(link.file),
              style: {
                border: "none",
                background: "transparent",
                padding: 0,
                color: "#0a48b3",
                textDecoration: "underline",
                cursor: "pointer",
                font: "inherit",
              },
            },
            match[3],
          ),
        );
      } else {
        output.push(
          React.createElement(
            "a",
            {
              key: `${keyPrefix}-link-${match.index}`,
              href: link.href,
              target: "_blank",
              rel: "noreferrer",
              style: { color: "#0a48b3", textDecoration: "none", fontWeight: 600 },
            },
            match[3],
          ),
        );
      }
    } else if (match[5] !== undefined) {
      output.push(
        React.createElement("strong", { key: `${keyPrefix}-strong-${match.index}` }, match[5]),
      );
    } else if (match[6] !== undefined) {
      output.push(
        React.createElement("code", { key: `${keyPrefix}-code-${match.index}`, style: elementStyles.inlineCode }, match[6]),
      );
    }

    lastIndex = pattern.lastIndex;
  }

  if (lastIndex < text.length) {
    output.push(text.slice(lastIndex));
  }

  return output;
}

function parseMarkdown(markdown) {
  const lines = String(markdown || "").replace(/\r\n/g, "\n").split("\n");
  const blocks = [];
  let index = 0;

  while (index < lines.length) {
    const line = lines[index];

    if (!line.trim()) {
      index += 1;
      continue;
    }

    if (line.startsWith("```")) {
      const codeLines = [];
      index += 1;
      while (index < lines.length && !lines[index].startsWith("```")) {
        codeLines.push(lines[index]);
        index += 1;
      }
      if (index < lines.length) {
        index += 1;
      }
      blocks.push({ type: "code", code: codeLines.join("\n") });
      continue;
    }

    const headingMatch = line.match(/^(#{1,6})\s+(.+)$/);
    if (headingMatch) {
      blocks.push({
        type: "heading",
        level: headingMatch[1].length,
        text: headingMatch[2],
      });
      index += 1;
      continue;
    }

    if (line.startsWith(">")) {
      const quoteLines = [];
      while (index < lines.length && lines[index].startsWith(">")) {
        quoteLines.push(lines[index].replace(/^>\s?/, ""));
        index += 1;
      }
      blocks.push({ type: "blockquote", lines: quoteLines });
      continue;
    }

    if (/^[-*+]\s+/.test(line)) {
      const items = [];
      while (index < lines.length && /^[-*+]\s+/.test(lines[index])) {
        items.push(lines[index].replace(/^[-*+]\s+/, ""));
        index += 1;
      }
      blocks.push({ type: "unordered-list", items });
      continue;
    }

    if (/^\d+\.\s+/.test(line)) {
      const items = [];
      while (index < lines.length && /^\d+\.\s+/.test(lines[index])) {
        items.push(lines[index].replace(/^\d+\.\s+/, ""));
        index += 1;
      }
      blocks.push({ type: "ordered-list", items });
      continue;
    }

    const paragraphLines = [line];
    index += 1;
    while (
      index < lines.length &&
      lines[index].trim() &&
      !lines[index].startsWith("```") &&
      !/^(#{1,6})\s+/.test(lines[index]) &&
      !lines[index].startsWith(">") &&
      !/^[-*+]\s+/.test(lines[index]) &&
      !/^\d+\.\s+/.test(lines[index])
    ) {
      paragraphLines.push(lines[index]);
      index += 1;
    }
    blocks.push({ type: "paragraph", text: paragraphLines.join(" ").trim() });
  }

  return blocks;
}

function headingSize(level) {
  if (level === 1) {
    return 34;
  }
  if (level === 2) {
    return 28;
  }
  if (level === 3) {
    return 22;
  }
  if (level === 4) {
    return 18;
  }
  return 16;
}
