import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",

  // Enable polling for Docker file watching (macOS/Windows)
  webpack: (config, { isServer }) => {
    if (!isServer && process.env.WATCHPACK_POLLING === "true") {
      config.watchOptions = {
        poll: 1000,
        aggregateTimeout: 300,
      };
    }
    return config;
  },
};

export default nextConfig;
