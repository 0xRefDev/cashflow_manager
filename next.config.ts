import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    resolveAlias: {},
    rules: {},
  },
  typescript: {
    ignoreBuildErrors: false
  },
};

export default nextConfig;