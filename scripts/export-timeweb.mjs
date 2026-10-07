import { fileURLToPath } from "node:url";
import path from "node:path";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outputDir = path.join(projectRoot, "timeweb-dist");

await rm(outputDir, { recursive: true, force: true });
await mkdir(outputDir, { recursive: true });
await cp(path.join(projectRoot, "dist", "client"), outputDir, { recursive: true });

const { default: app } = await import("../dist/server/index.js");
const executionContext = {
  waitUntil() {},
  passThroughOnException() {},
};

const staticRoutes = [
  { route: "/", dir: "" },
  { route: "/na-svoem-uchastke", dir: "na-svoem-uchastke" },
  { route: "/semejnaya-ipoteka", dir: "semejnaya-ipoteka" },
  { route: "/zemlya-i-dom", dir: "zemlya-i-dom" },
];

for (const { route, dir } of staticRoutes) {
  const response = await app.fetch(
    new Request("https://ikioma.ru" + route),
    {},
    executionContext,
  );

  if (!response.ok) {
    throw new Error("Static render failed for " + route + " with HTTP " + response.status);
  }

  const html = await response.text();
  const targetDir = dir ? path.join(outputDir, dir) : outputDir;
  await mkdir(targetDir, { recursive: true });
  await writeFile(path.join(targetDir, "index.html"), html, "utf8");
}

await writeFile(
  path.join(outputDir, ".htaccess"),
  [
    "DirectoryIndex index.html",
    "RewriteEngine On",
    "RewriteCond %{REQUEST_FILENAME} !-f",
    "RewriteCond %{REQUEST_FILENAME} !-d",
    "RewriteRule ^ index.html [L]",
    "",
  ].join("\n"),
  "utf8",
);

console.log("Timeweb package created at " + outputDir);
