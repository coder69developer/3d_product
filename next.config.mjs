/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: process.env.NODE_ENV === 'production' ? '/3d_product' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/3d_product/' : '',
};

export default nextConfig;
