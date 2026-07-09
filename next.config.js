/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'trae-api-cn.mchost.guru',
        port: '',
        pathname: '/api/ide/v1/text_to_image',
      },
      {
        protocol: 'https',
        hostname: 'i0.hdslb.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

module.exports = nextConfig;
