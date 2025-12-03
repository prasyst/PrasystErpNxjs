/** @type {import('next').NextConfig} */
const nextConfig = {
    // output: 'export',
      experimental: {
    turbopack: true, // Enable Turbopack (faster bundler)
  },
      reactStrictMode: true, 
     assetPrefix: '/',
  trailingSlash: true,
   images: {
    // unoptimized: true, 
       unoptimized: process.env.NODE_ENV === 'development',
  },
};

export default nextConfig;
