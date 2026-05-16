/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: '/RESET-COMMERCIAL-CLEANING',
  reactStrictMode: true,
  images: {
    domains: ['localhost', 'images.unsplash.com'],
    unoptimized: true,
  },
  webpack: (config, { isServer }) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      path: false,
      crypto: false,
    };

    return config;
  },
};

module.exports = nextConfig;
