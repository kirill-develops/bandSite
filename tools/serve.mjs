#!/usr/bin/env node

import http from "node:http";
import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function readOption(name, fallback) {
  const args = process.argv.slice(2);
  const index = args.indexOf(name);
  if (index === -1 || index === args.length - 1) {
    return fallback;
  }
  return args[index + 1];
}

const rootOption = readOption("--root", ".");
const portOption = Number.parseInt(readOption("--port", "8080"), 10);
const host = readOption("--host", "127.0.0.1");
const port = Number.isNaN(portOption) ? 8080 : portOption;
const rootDir = path.resolve(__dirname, "..", rootOption);

const mimeTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".ico": "image/x-icon",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".otf": "font/otf",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".txt": "text/plain; charset=utf-8",
  ".webp": "image/webp",
  ".woff": "font/woff",
  ".woff2": "font/woff2"
};

function normalizeRequestPath(urlPath) {
  const decodedPath = decodeURIComponent(urlPath.split("?")[0] || "/");
  const normalized = path.normalize(decodedPath).replace(/^(\.\.[/\\])+/, "");
  return normalized.startsWith("/") ? normalized.slice(1) : normalized;
}

async function resolvePath(requestPath) {
  const absolutePath = path.resolve(rootDir, requestPath);
  if (!absolutePath.startsWith(rootDir)) {
    throw Object.assign(new Error("Forbidden"), { code: 403 });
  }

  try {
    const fileStats = await stat(absolutePath);
    if (fileStats.isDirectory()) {
      return path.join(absolutePath, "index.html");
    }
    return absolutePath;
  } catch (error) {
    if (error.code !== "ENOENT") {
      throw error;
    }
    const indexPath = path.join(absolutePath, "index.html");
    try {
      await stat(indexPath);
      return indexPath;
    } catch {
      throw Object.assign(new Error("Not Found"), { code: 404 });
    }
  }
}

const server = http.createServer(async (req, res) => {
  try {
    const requestPath = normalizeRequestPath(req.url || "/");
    const resolvedPath = await resolvePath(requestPath || "index.html");
    const extension = path.extname(resolvedPath).toLowerCase();
    const contentType = mimeTypes[extension] || "application/octet-stream";
    const body = await readFile(resolvedPath);

    res.writeHead(200, { "Content-Type": contentType });
    res.end(body);
  } catch (error) {
    if (error.code === 403) {
      res.writeHead(403, { "Content-Type": "text/plain; charset=utf-8" });
      res.end("403 Forbidden");
      return;
    }
    if (error.code === 404 || error.code === "ENOENT") {
      res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      res.end("404 Not Found");
      return;
    }

    res.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("500 Internal Server Error");
    console.error(error);
  }
});

server.on("error", (error) => {
  if (error.code === "EADDRINUSE") {
    console.error(`Port ${port} is already in use on ${host}.`);
    process.exit(1);
  }
  if (error.code === "EPERM") {
    console.error(
      `Unable to bind ${host}:${port} in this environment (permission denied).`
    );
    process.exit(1);
  }
  console.error("Server failed to start:", error);
  process.exit(1);
});

server.listen(port, host, () => {
  console.log(`Static server running at http://${host}:${port}`);
  console.log(`Serving: ${rootDir}`);
});
