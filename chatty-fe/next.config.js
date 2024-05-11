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
  images: {
    remotePatterns: [
      {
        hostname: '3.35.178.237',
        port: '9010',
      },
      {
        hostname: 'http://t1.kakaocdn.net',
      },
      {
        hostname: 'http://lh3.googleusercontent.com',
      },
    ],
  },
  serverRuntimeConfig: {
    httpServerOptions: {
      maxRequestBodySize: 50 * 1024 * 1024,
    },
  },
};

module.exports = withVanillaExtract(nextConfig);
