/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === 'production';

const nextConfig = {             // static HTML export
  basePath: isProd ? '/3d_product' : '', // prefix all routes
  assetPrefix: isProd ? '/3d_product/' : '', // prefix _next/static assets
  
  images: {
    unoptimized: true
  }
};

module.exports = nextConfig;
