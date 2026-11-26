import type { NextConfig } from "next";

// Static export: the prototype has no server, auth or database (CLAUDE.md, decision D5).
const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
};

export default nextConfig;
