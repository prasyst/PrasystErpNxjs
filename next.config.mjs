// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   output: 'export',
//   reactStrictMode: true,
//   assetPrefix: '/',
//   trailingSlash: true,
//   images: {
//   unoptimized: true, 
//   },
// };

// export default nextConfig;


/** @type {import('next').NextConfig} */
import withPWA from 'next-pwa';

const nextConfig = {
  // output: 'export',
  reactStrictMode: true,
  assetPrefix: '/',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  experimental: {
    turbo: false, // Disable turbopack
  },
};

const pwaConfig = {
  dest: 'public',
  register: false, // Manual registration
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
  fallbacks: {
    document: '/offline.html', // Optional: create offline page
  },
  runtimeCaching: [
    {
      urlPattern: /^https:\/\/fonts\.(googleapis|gstatic)\.com\/.*/i,
      handler: 'CacheFirst',
      options: {
        cacheName: 'google-fonts',
        expiration: {
          maxEntries: 10,
          maxAgeSeconds: 60 * 60 * 24 * 365
        }
      }
    },
    {
      urlPattern: /\.(?:png|jpg|jpeg|svg|gif|ico|webp)$/,
      handler: 'CacheFirst',
      options: {
        cacheName: 'images',
        expiration: {
          maxEntries: 60,
          maxAgeSeconds: 30 * 24 * 60 * 60
        }
      }
    },
    {
      urlPattern: /\.(?:js|css)$/,
      handler: 'StaleWhileRevalidate',
      options: {
        cacheName: 'static-resources',
        expiration: {
          maxEntries: 60,
          maxAgeSeconds: 24 * 60 * 60
        }
      }
    },
    {
      urlPattern: /\/$/,
      handler: 'NetworkFirst',
      options: {
        cacheName: 'start-url',
        expiration: {
          maxEntries: 1,
          maxAgeSeconds: 24 * 60 * 60
        }
      }
    }
  ]
};

export default withPWA(pwaConfig)(nextConfig);