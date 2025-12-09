import type { NextConfig } from "next";
import withPWA from "@ducanh2912/next-pwa";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'raw.githubusercontent.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

// Only apply PWA in production builds to avoid Turbopack/Webpack conflicts in dev
const isDev = process.env.NODE_ENV === "development";

export default isDev 
  ? nextConfig 
  : withPWA({
      dest: "public",
      cacheOnFrontEndNav: true,
      aggressiveFrontEndNavCaching: true,
      reloadOnOnline: true,
      disable: false,
      sw: "sw.js",
      workboxOptions: {
        disableDevLogs: true,
        skipWaiting: true,
        clientsClaim: true,
        swDest: "sw.js",
        importScripts: ['/sw-helpers.js'],
      },
    })(nextConfig);
