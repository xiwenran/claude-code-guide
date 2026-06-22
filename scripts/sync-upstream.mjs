import { mkdtemp, rm, mkdir, cp, readdir, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { execFileSync } from "node:child_process";

const upstreamRepo = "https://github.com/stormzhang/ai-coding-guide";
const tempRoot = await mkdtemp(path.join(os.tmpdir(), "claude-code-guide-upstream-"));
const cloneDir = path.join(tempRoot, "repo");
const outputDir = path.resolve("content/upstream");
const targets = [
  "README.md",
  "README.en.md",
  "LICENSE",
  "claude-code",
  "codex",
];

function runGit(args, cwd) {
  return execFileSync("git", args, {
    cwd,
    encoding: "utf-8",
    stdio: ["ignore", "pipe", "inherit"],
  }).trim();
}

async function collectMarkdownFiles(dir, prefix = "") {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const relativePath = prefix ? `${prefix}/${entry.name}` : entry.name;
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      files.push(...await collectMarkdownFiles(fullPath, relativePath));
      continue;
    }

    if (entry.isFile() && entry.name.endsWith(".md")) {
      const category = relativePath.startsWith("claude-code/")
        ? "claude-code"
        : relativePath.startsWith("codex/")
          ? "codex"
          : "root";
      const title = entry.name.replace(/\.md$/i, "").replace(/[\-_]+/g, " ").trim();
      files.push({
        category,
        file: relativePath,
        title,
      });
    }
  }

  return files.sort((a, b) => a.file.localeCompare(b.file, "en"));
}

try {
  console.log(`Cloning ${upstreamRepo} ...`);
  runGit(["clone", "--depth", "1", upstreamRepo, cloneDir]);

  await rm(outputDir, { recursive: true, force: true });
  await mkdir(outputDir, { recursive: true });

  for (const target of targets) {
    const sourcePath = path.join(cloneDir, target);
    if (!existsSync(sourcePath)) {
      throw new Error(`Upstream target not found: ${target}`);
    }
    await cp(sourcePath, path.join(outputDir, target), { recursive: true });
  }

  const upstreamCommit = runGit(["rev-parse", "HEAD"], cloneDir);
  const sections = await collectMarkdownFiles(outputDir);
  const manifest = {
    updatedAt: new Date().toISOString(),
    upstreamRepo,
    upstreamCommit,
    sections,
  };

  await writeFile(
    path.join(outputDir, "manifest.json"),
    `${JSON.stringify(manifest, null, 2)}\n`,
    "utf-8",
  );

  console.log(`Synced ${sections.length} markdown files from ${upstreamCommit.slice(0, 7)}.`);
} finally {
  await rm(tempRoot, { recursive: true, force: true });
}
