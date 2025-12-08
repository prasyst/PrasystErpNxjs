/** @type {import('next').NextConfig} */
const nextConfig = {
   output: 'export',
  reactStrictMode: true,
  assetPrefix: '/',
  trailingSlash: true,
  images: {
     unoptimized: true, 
    unoptimized: process.env.NODE_ENV === 'development',
  },
};

export default nextConfig;
