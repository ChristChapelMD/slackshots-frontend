/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "platform.slack-edge.com",
      },
      {
        hostname: "source.unsplash.com",
      },
      {
        hostname: "picsum.photos",
      },
      {
        hostname: "localhost",
      },
    ],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
};

module.exports = nextConfig;
