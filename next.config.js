/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['localhost'],
  },
  experimental: {
    serverActions: true,
  },
  env: {
    MONGODB_URI: process.env.MONGODB_URI,
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    GOOGLE_APPLICATION_CREDENTIALS: process.env.GOOGLE_APPLICATION_CREDENTIALS,
    JWT_SECRET: process.env.JWT_SECRET,
    ELEVENLABS_API_KEY: process.env.ELEVENLABS_API_KEY,
  },
}

module.exports = nextConfig 