const { createVanillaExtractPlugin } = require('@vanilla-extract/next-plugin');
const withVanillaExtract = createVanillaExtractPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  reactStrictMode: false,
  webpack: (config) => {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });
    return config;
  },
  serverRuntimeConfig: {
    httpServerOptions: {
      maxRequestBodySize: 50 * 1024 * 1024,
    },
  },
};

module.exports = withVanillaExtract(nextConfig);
