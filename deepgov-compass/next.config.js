/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['localhost'],
  },
  // Enable the frames.js handler
  experimental: {
    serverComponentsExternalPackages: ['sharp'],
  },
}

module.exports = nextConfig;