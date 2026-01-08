/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  // Disable strict image optimization for static export
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: 'https', hostname: 'image.tmdb.org' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'i.scdn.co' },
      { protocol: 'https', hostname: 'cdn.simpleicons.org' },
      { protocol: 'https', hostname: 'cdn.jsdelivr.net' },
      { protocol: 'https', hostname: 'cdn.arstechnica.net' },
    ],
  },
  // IGNORE TYPESCRIPT ERRORS
  typescript: {
    ignoreBuildErrors: true,
  },
  // IGNORE ESLINT ERRORS
  eslint: {
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;