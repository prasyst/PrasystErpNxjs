/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  reactStrictMode: true,
  assetPrefix: '/',
  trailingSlash: true,
  images: {
  unoptimized: true, 
  },
};

export default nextConfig;
