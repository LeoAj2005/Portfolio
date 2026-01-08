/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'image.tmdb.org', // Allow Movie Posters
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com', // Allow Unsplash Photos
      },
      {
        protocol: 'https',
        hostname: 'i.scdn.co', // Allow Spotify Album Art
      },
      {
        protocol: 'https',
        hostname: 'cdn.simpleicons.org', // Allow Tech Icons
      },
       {
        protocol: 'https',
        hostname: 'cdn.jsdelivr.net', // Allow DevIcons
      },
    ],
  },
};

module.exports = nextConfig;