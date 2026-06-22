/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['fluent-ffmpeg']
  },
  async redirects() {
    return [
      {
        source: '/',
        destination: '/api/landing',
        permanent: false,
      },
    ]
  },
}

module.exports = nextConfig
