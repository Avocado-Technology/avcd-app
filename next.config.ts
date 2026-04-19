import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",

  // External packages that should not be bundled
  serverExternalPackages: ["elkjs"],

  // Turbopack configuration for external packages
  turbopack: {
    resolveExtensions: [
      '.js',
      '.jsx',
      '.ts',
      '.tsx',
      '.json',
    ],
    resolveAlias: {
      'elkjs/lib/elk.bundled.js': 'elkjs/lib/elk.bundled.js',
    }
  },

  // Enable polling for Docker file watching (macOS/Windows)
  webpack: (config, { isServer }) => {
    if (!isServer && process.env.WATCHPACK_POLLING === "true") {
      config.watchOptions = {
        poll: 1000,
        aggregateTimeout: 300,
      };
    }
    
    // Configure fallbacks for elkjs dependencies
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        'web-worker': false,
      };
    }
    
    return config;
  },
};

export default nextConfig;
