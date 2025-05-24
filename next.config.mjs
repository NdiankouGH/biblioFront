/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  experimental: {
    outputFileTracingRoot: undefined
  }
};

export default nextConfig;
