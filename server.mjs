import { createReadStream, existsSync, statSync } from "node:fs";
import { createServer } from "node:http";
import { extname, join, normalize, resolve } from "node:path";

const root = resolve(".");
const port = Number(process.env.PORT || 4173);

const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".svg": "image/svg+xml"
};

function resolvePath(url) {
  const pathname = decodeURIComponent(new URL(url, "http://localhost").pathname);
  const requested = pathname === "/" ? "/Web.html" : pathname;
  const filePath = normalize(join(root, requested));
  if (!filePath.startsWith(root)) return null;
  return filePath;
}

createServer((req, res) => {
  const filePath = resolvePath(req.url || "/");
  if (!filePath || !existsSync(filePath) || !statSync(filePath).isFile()) {
    res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("Not found");
    return;
  }

  res.writeHead(200, {
    "Content-Type": types[extname(filePath).toLowerCase()] || "application/octet-stream"
  });
  createReadStream(filePath).pipe(res);
}).listen(port, "127.0.0.1", () => {
  console.log(`Grace Dental site: http://127.0.0.1:${port}/Web.html`);
});
