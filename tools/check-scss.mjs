#!/usr/bin/env node

import { access, readdir, stat } from "node:fs/promises";
import path from "node:path";

const stylesDir = path.resolve(process.cwd(), "styles");

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

async function exists(filePath) {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function run() {
  if (!(await exists(stylesDir))) {
    console.log("No styles directory found. Skipping SCSS check.");
    return;
  }

  const allFiles = await listFilesRecursive(stylesDir);
  const scssFiles = allFiles.filter((file) => {
    const isScss = file.endsWith(".scss");
    const fileName = path.basename(file);
    return isScss && !fileName.startsWith("_");
  });

  if (scssFiles.length === 0) {
    console.log("No SCSS entry files found. Skipping SCSS check.");
    return;
  }

  const warnings = [];

  for (const scssFile of scssFiles) {
    const cssFile = scssFile.replace(/\.scss$/, ".css");
    const relativeScss = path.relative(process.cwd(), scssFile);
    const relativeCss = path.relative(process.cwd(), cssFile);

    if (!(await exists(cssFile))) {
      warnings.push(
        `Missing compiled CSS for ${relativeScss}. Expected ${relativeCss}.`
      );
      continue;
    }

    const scssStats = await stat(scssFile);
    const cssStats = await stat(cssFile);

    if (scssStats.mtimeMs > cssStats.mtimeMs) {
      warnings.push(
        `${relativeScss} is newer than ${relativeCss}. Build will use the existing CSS output as-is.`
      );
    }
  }

  if (warnings.length === 0) {
    console.log("SCSS check passed. Existing compiled CSS is up to date.");
    return;
  }

  console.log("SCSS check completed with warnings:");
  for (const warning of warnings) {
    console.log(`- ${warning}`);
  }
}

run().catch((error) => {
  console.error("SCSS check failed:", error);
  process.exit(1);
});
