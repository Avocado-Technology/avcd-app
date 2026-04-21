import createNextIntlPlugin from "next-intl/plugin";

// Explicit path so resolution never depends on implicit defaults (see next-intl/plugin docs).
// Dev/build must use Webpack so this plugin runs; Turbopack does not apply webpack plugins
// (Next.js Turbopack docs). Use `npm run dev:turbo` only if you accept broken next-intl.
const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  serverExternalPackages: ["elkjs"],
  turbopack: {
    resolveExtensions: [".js", ".jsx", ".ts", ".tsx", ".json"],
    resolveAlias: {
      "elkjs/lib/elk.bundled.js": "elkjs/lib/elk.bundled.js",
    },
  },
  webpack: (config, { isServer }) => {
    if (!isServer && process.env.WATCHPACK_POLLING === "true") {
      config.watchOptions = { poll: 1000, aggregateTimeout: 300 };
    }
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        "web-worker": false,
      };
    }
    return config;
  },
};

export default withNextIntl(nextConfig);
