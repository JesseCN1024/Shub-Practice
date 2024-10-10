/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*', // Match all API routes starting with /api/
        destination: 'https://test-share.shub.edu.vn/api/:path*', // Proxy to external API
      },
    ];
  },
};

export default nextConfig;
