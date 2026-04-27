#!/usr/bin/env node

import {
  mkdir,
  readdir,
  readFile,
  rm,
  stat,
  writeFile
} from "node:fs/promises";
import path from "node:path";

const rootDir = process.cwd();
const distDir = path.join(rootDir, "dist");

const sourceFolders = ["assets", "db", "scripts", "styles", "pages"];
const rootFiles = ["index.html"];

function minifyHtml(input) {
  return (
    input
      // Strip HTML comments.
      .replace(/<!--[\s\S]*?-->/g, "")
      // Collapse whitespace between tags.
      .replace(/>\s+</g, "><")
      // Collapse long runs of spaces and tabs.
      .replace(/[ \t]{2,}/g, " ")
      .trim()
  );
}

function minifyCss(input) {
  return (
    input
      // Remove block comments.
      .replace(/\/\*[\s\S]*?\*\//g, "")
      // Collapse whitespace.
      .replace(/\s+/g, " ")
      // Trim around punctuation.
      .replace(/\s*([{}:;,>])\s*/g, "$1")
      // Remove redundant final semicolons.
      .replace(/;}/g, "}")
      .trim()
  );
}

async function listFilesRecursive(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await listFilesRecursive(fullPath)));
      continue;
    }
    files.push(fullPath);
  }

  return files;
}

async function writeOutputFile(sourcePath, destinationPath) {
  await mkdir(path.dirname(destinationPath), { recursive: true });

  const fileExtension = path.extname(sourcePath).toLowerCase();
  const raw = await readFile(sourcePath, "utf8");

  let output = raw;
  if (fileExtension === ".html") {
    output = minifyHtml(raw);
  } else if (fileExtension === ".css") {
    output = minifyCss(raw);
  }

  await writeFile(destinationPath, output);
}

async function copyBinaryFile(sourcePath, destinationPath) {
  await mkdir(path.dirname(destinationPath), { recursive: true });
  const fileBuffer = await readFile(sourcePath);
  await writeFile(destinationPath, fileBuffer);
}

function isTextFile(filePath) {
  const extension = path.extname(filePath).toLowerCase();
  return extension === ".html" || extension === ".css" || extension === ".js";
}

function shouldSkipFile(filePath) {
  const fileName = path.basename(filePath);
  const extension = path.extname(filePath).toLowerCase();
  return (
    fileName === ".DS_Store" ||
    extension === ".scss" ||
    extension === ".map"
  );
}

async function copyFolder(relativeFolder) {
  const sourceFolder = path.join(rootDir, relativeFolder);
  let folderStats;
  try {
    folderStats = await stat(sourceFolder);
  } catch (error) {
    if (error.code === "ENOENT") {
      return;
    }
    throw error;
  }

  if (!folderStats.isDirectory()) {
    return;
  }

  const files = await listFilesRecursive(sourceFolder);
  for (const sourcePath of files) {
    if (shouldSkipFile(sourcePath)) {
      continue;
    }

    const relativePath = path.relative(rootDir, sourcePath);
    const destinationPath = path.join(distDir, relativePath);

    if (isTextFile(sourcePath)) {
      await writeOutputFile(sourcePath, destinationPath);
    } else {
      await copyBinaryFile(sourcePath, destinationPath);
    }
  }
}

async function copyRootFiles() {
  for (const fileName of rootFiles) {
    const sourcePath = path.join(rootDir, fileName);
    const destinationPath = path.join(distDir, fileName);
    await writeOutputFile(sourcePath, destinationPath);
  }
}

async function run() {
  await rm(distDir, { recursive: true, force: true });
  await mkdir(distDir, { recursive: true });

  await copyRootFiles();
  for (const folder of sourceFolders) {
    await copyFolder(folder);
  }

  console.log("Build complete.");
  console.log(`Output: ${distDir}`);
}

run().catch((error) => {
  console.error("Build failed:", error);
  process.exit(1);
});
