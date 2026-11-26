import type { NextConfig } from "next";

// Static export: the prototype has no server, auth or database (CLAUDE.md, decision D5).
// PAGES_BASE_PATH is set by the GitHub Pages workflow ("/appogado"); empty for local runs and tests.
const basePath = process.env.PAGES_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  basePath,
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
};

export default nextConfig;
