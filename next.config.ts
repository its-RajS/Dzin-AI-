import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ['@/packages/database', '@/packages/utils'],
  experimental: {
    // Ensure proper symlink handling for pnpm workspaces on Windows
    externalDir: true,
  },
};

export default nextConfig;
